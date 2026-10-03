const API = 'http://localhost:5000/api';

// ===== Load My Bookings =====
async function loadMyBookings() {
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('bookingsContainer').innerHTML = `
            <div style="text-align:center;padding:60px;">
                <i class="fas fa-lock" style="font-size:3rem;color:#98a2b3;margin-bottom:16px;"></i>
                <p style="color:#475467;margin-bottom:20px;">Please login to see your bookings</p>
                <button class="btn-primary" onclick="openModal('signin')">Login Now</button>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`${API}/bookings/my-bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        const container = document.getElementById('bookingsContainer');

        if (data.success && data.bookings.length > 0) {
            container.innerHTML = data.bookings.map(b => `
                <div class="booking-item">
                    <div class="booking-info">
                        <h3>${b.serviceId?.title || 'Service'}</h3>
                        <p><i class="fas fa-calendar"></i> ${new Date(b.date).toLocaleDateString()}</p>
                        <p><i class="fas fa-clock"></i> ${b.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${b.address}</p>
                        <p class="price">৳${b.totalPrice}</p>
                    </div>
                    <div class="booking-status">
                        <span class="status-badge status-${b.status}">${b.status.toUpperCase()}</span>
                        ${b.status === 'pending' ? `<button class="btn-cancel" onclick="cancelBooking('${b._id}')">Cancel</button>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div style="text-align:center;padding:60px;">
                    <i class="fas fa-calendar-times" style="font-size:3rem;color:#98a2b3;margin-bottom:16px;"></i>
                    <p style="color:#475467;">No bookings yet</p>
                    <a href="services.html" class="btn-primary" style="text-decoration:none;display:inline-block;margin-top:16px;padding:12px 28px;">Browse Services</a>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('bookingsContainer').innerHTML = `
            <p style="text-align:center;color:#b42318;padding:40px;">Error loading bookings.</p>
        `;
    }
}

// ===== Cancel Booking =====
async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API}/bookings/${id}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
            alert('Booking cancelled successfully');
            loadMyBookings();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error cancelling booking');
    }
}

window.addEventListener('DOMContentLoaded', loadMyBookings);