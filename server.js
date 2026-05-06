const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Driver Schema
const driverSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    experience: String,
    rating: Number,
    price: String,
    vehicleType: String,
    license: String,
    isAvailable: { type: Boolean, default: true }
});

const Driver = mongoose.model('Driver', driverSchema);
// booking schema
const bookingSchema = new mongoose.Schema({
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    customerName: String,
    pickupLocation: String,
    destination: String,
    bookingDateTime: Date,
    status: { type: String, default: 'confirmed' }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes

// Get all drivers
app.get('/api/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        res.json({ message: "Booking saved successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add sample drivers (run once)
app.get('/add-sample-drivers', async (req, res) => {
    try {
        await Driver.insertMany([
            {
                name: "Rahul Sharma",
                phone: "+91 9876543210",
                address: "Mumbai",
                experience: "5 years",
                rating: 4.8,
                price: "₹800/hr",
                vehicleType: "Sedan",
                license: "MH1234"
            },
            {
                name: "Priya Patel",
                phone: "+91 9876543211",
                address: "Delhi",
                experience: "7 years",
                rating: 4.9,
                price: "₹900/hr",
                vehicleType: "SUV",
                license: "DL5678"
            }
        ]);

        res.send("Sample drivers added");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Test route
app.get('/', (req, res) => {
    res.send("API is running...");
});

// ✅ Start server ONLY after DB connects
async function startServer() {
    try {
        await mongoose.connect('mongodb+srv://vivekbalwantmakne_db_user:vivek123@cluster0.ww7lmwa.mongodb.net/driverRental');
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("MongoDB Error:", error);
    }
}

startServer();