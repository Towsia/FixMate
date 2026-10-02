const API = 'http://localhost:5000/api';
let allServices = [];
let allCategories = [];

// ===== Load Services + Categories =====
async function loadAllServices() {
    try {
        // Load Services
        const res = await fetch(`${API}/services`);
        const data = await res.json();
        allServices = data.services || [];

        // Load Categories
        const catRes = await fetch(`${API}/categories`);
        const catData = await catRes.json();
        allCategories = catData.categories || [];

        // Populate Category Filter
        const catFilter = document.getElementById('categoryFilter');
        if (catFilter) {
            allCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat._id;
                option.textContent = cat.name;
                catFilter.appendChild(option);
            });
        }

        renderServices(allServices);
    } catch (error) {
        console.log('Error loading services:', error.message);
        document.getElementById('allServicesGrid').innerHTML =
            '<p style="text-align:center;grid-column:1/-1;color:#b42318;padding:40px;">Error loading services.</p>';
    }
}

// ===== Render Services =====
function renderServices(services) {
    const grid = document.getElementById('allServicesGrid');
    if (!grid) return;

    if (services.length > 0) {
        grid.innerHTML = services.map(s => `
            <a href="service-details.html?id=${s._id}" class="service-card">
                <div class="icon"><i class="fas fa-tools"></i></div>
                <h3>${s.title}</h3>
                <p>${s.description.substring(0, 60)}...</p>
                <div class="price">৳${s.price}</div>
                <div class="location"><i class="fas fa-map-marker-alt"></i> ${s.location || 'N/A'}</div>
            </a>
        `).join('');
    } else {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#98a2b3;padding:40px;">No services found.</p>';
    }
}

// ===== Filter Services =====
function filterServices() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let filtered = allServices;

    if (query) {
        filtered = filtered.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)
        );
    }

    if (category) {
        filtered = filtered.filter(s => s.categoryId === category);
    }

    renderServices(filtered);
}

// Load on page start
window.addEventListener('DOMContentLoaded', loadAllServices);