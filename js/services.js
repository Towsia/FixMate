const API = 'http://localhost:5000/api';

// ===== Load Services Preview (Home Page - শুধু ৩টা) =====
async function loadServicesPreview() {
    try {
        const res = await fetch(`${API}/services`);
        const data = await res.json();

        const grid = document.getElementById('servicePreviewGrid');
        if (!grid) return;

        if (data.success && data.services.length > 0) {
            const preview = data.services.slice(0, 3);
            grid.innerHTML = preview.map(s => `
                <a href="service-details.html?id=${s._id}" class="service-card">
                    <div class="icon"><i class="fas fa-tools"></i></div>
                    <h3>${s.title}</h3>
                    <p>${s.description.substring(0, 60)}...</p>
                    <div class="price">৳${s.price}</div>
                </a>
            `).join('');
        } else {
            grid.innerHTML = ''; // No services, empty
        }
    } catch (error) {
        console.log('Could not load services:', error.message);
        document.getElementById('servicePreviewGrid').innerHTML = '';
    }
}

// ===== Search (Home Page) =====
function searchServices() {
    const query = document.getElementById('searchInput')?.value || '';
    if (query) {
        window.location.href = `services.html?search=${query}`;
    } else {
        window.location.href = 'services.html';
    }
}

window.addEventListener('DOMContentLoaded', loadServicesPreview);