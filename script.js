// Store drivers from API
let allDrivers = [];

// 🔗 Fetch drivers from backend
async function fetchDrivers() {
    try {
        console.log("Fetching drivers...");

        const res = await fetch('http://localhost:5000/api/drivers');
        const data = await res.json();

        console.log("Drivers:", data);

        allDrivers = data;
        displayDrivers(allDrivers);

    } catch (error) {
        console.error("Error fetching drivers:", error);
    }
}

// 🔍 Search functionality
function searchDrivers() {
    const location = document.getElementById('locationSearch').value.toLowerCase();
    const vehicleType = document.getElementById('vehicleType').value.toLowerCase();
    
    const filteredDrivers = allDrivers.filter(driver => 
        driver.address.toLowerCase().includes(location) ||
        driver.vehicleType.toLowerCase().includes(vehicleType)
    );
    
    displayDrivers(filteredDrivers);
}

// 🎯 Display drivers
function displayDrivers(driversList) {
    const driversGrid = document.getElementById('driversGrid');
    driversGrid.innerHTML = '';

    if (driversList.length === 0) {
        driversGrid.innerHTML = "<p>No drivers available</p>";
        return;
    }
    
    driversList.forEach(driver => {
        const driverCard = createDriverCard(driver);
        driversGrid.appendChild(driverCard);
    });
}

// 🧩 Create driver card
function createDriverCard(driver) {
    const card = document.createElement('div');
    card.className = 'driver-card';
    card.onclick = () => openBookingModal(driver);
    
    card.innerHTML = `
        <div class="driver-avatar">
            ${driver.name.charAt(0)}
        </div>
        <div class="driver-info">
            <h3>${driver.name}</h3>
            <div class="driver-details">
                <span class="rating">${driver.rating} ⭐</span>
                <span class="price">${driver.price}</span>
            </div>
            <div class="driver-stats">
                <span>${driver.experience}</span>
                <span>${driver.vehicleType}</span>
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem;">
                📱 ${driver.phone}<br>
                📍 ${driver.address}
            </div>
            <button class="book-btn">Book Driver</button>
        </div>
    `;
    
    return card;
}

// 📦 Modal functions
function openBookingModal(driver) {
    document.getElementById('selectedDriverId').value = driver._id;
    document.getElementById('bookingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// 📝 Booking form submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const bookingData = {
        driverId: document.getElementById('selectedDriverId').value,
        customerName: document.getElementById('customerName').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        destination: document.getElementById('destination').value,
        bookingDateTime: document.getElementById('bookingDateTime').value
    };

    try {
        const res = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        await res.json();

        alert("Booking Confirmed ✅");
        closeModal();
        this.reset();

    } catch (error) {
        console.error(error);
        const popup = document.getElementById('successPopup');
popup.classList.add('show');

setTimeout(() => {
    popup.classList.remove('show');
}, 3000);
    }
});

// 🚀 Initialize
document.addEventListener('DOMContentLoaded', function() {
    fetchDrivers();

    window.onclick = function(event) {
        const modal = document.getElementById('bookingModal');
        if (event.target == modal) {
            closeModal();
        }
    }
});