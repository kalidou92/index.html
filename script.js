// Application principale file. pour le salon de massage

// Variables globales
let currentPage = 'dashboard';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDashboard();
    initClients();
    initServices();
    initAppointments();
    initNewAppointment();
    initModals();
});

// ==================== NAVIGATION ====================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Désactiver tous les éléments de navigation
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.remove('active');
    });
    
    // Afficher la page sélectionnée
    document.getElementById(page).classList.add('active');
    
    // Activer l'élément de navigation correspondant
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    currentPage = page;
    
    // Rafraîchir les données selon la page
    switch(page) {
        case 'dashboard':
            initDashboard();
            break;
        case 'clients':
            renderClients();
            break;
        case 'services':
            renderServices();
            break;
        case 'appointments':
            renderAppointments();
            break;
    }
}

// ==================== TABLEAU DE BORD ====================
function initDashboard() {
    // Mettre à jour les statistiques
    document.getElementById('total-clients').textContent = clients.length;
    document.getElementById('total-services').textContent = services.length;
    
    const todayAppointments = getTodayAppointments();
    document.getElementById('today-appointments').textContent = todayAppointments.length;
    
    // Calculer les revenus du jour
    const completedToday = todayAppointments.filter(a => a.statut === 'completed' || a.statut === 'confirmed');
    const revenue = completedToday.reduce((sum, a) => sum + a.prix, 0);
    document.getElementById('today-revenue').textContent = revenue + '€';
    
    // Afficher les rendez-vous du jour
    renderTodayAppointments();
    
    // Afficher les clients récents
    renderRecentClients();
}

function renderTodayAppointments() {
    const container = document.getElementById('today-appointments-list');
    const todayAppointments = getTodayAppointments().sort((a, b) => a.heure.localeCompare(b.heure));
    
    if (todayAppointments.length === 0) {
        container.innerHTML = '<p class="no-data">Aucun rendez-vous aujourd\'hui</p>';
        return;
    }
    
    container.innerHTML = todayAppointments.map(apt => {
        const client = getClientById(apt.clientId);
        const service = getServiceById(apt.serviceId);
        const statusClass = getStatusClass(apt.statut);
        
        return `
            <div class="appointment-item">
                <div class="appointment-time">${apt.heure}</div>
                <div class="appointment-info">
                    <strong>${client ? client.prenom + ' ' + client.nom : 'Client Inconnu'}</strong>
                    <span>${service ? service.nom : 'Service Inconnu'}</span>
                </div>
                <span class="status-badge ${statusClass}">${getStatusText(apt.statut)}</span>
            </div>
        `;
    }).join('');
}

function renderRecentClients() {
    const container = document.getElementById('recent-clients');
    const recentClients = [...clients].sort((a, b) => b.id - a.id).slice(0, 5);
    
    if (recentClients.length === 0) {
        container.innerHTML = '<p class="no-data">Aucun client</p>';
        return;
    }
    
    container.innerHTML = recentClients.map(client => `
        <div class="client-item">
            <div class="client-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="client-info">
                <strong>${client.prenom} ${client.nom}</strong>
                <span>${client.tel}</span>
            </div>
        </div>
    `).join('');
}

// ==================== CLIENTS ====================
function initClients() {
    // Bouton ajouter client
    document.getElementById('add-client-btn').addEventListener('click', function() {
        openClientModal();
    });
    
    // Recherche client
    document.getElementById('client-search').addEventListener('input', function(e) {
        renderClients(e.target.value);
    });
    
    renderClients();
}

function renderClients(searchTerm = '') {
    const tbody = document.getElementById('clients-tbody');
    let filteredClients = clients;
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredClients = clients.filter(c => 
            c.nom.toLowerCase().includes(term) ||
            c.prenom.toLowerCase().includes(term) ||
            c.tel.includes(term) ||
            c.email.toLowerCase().includes(term)
        );
    }
    
    if (filteredClients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Aucun client trouvé</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredClients.map(client => `
        <tr>
            <td>${client.id}</td>
            <td>${client.nom}</td>
            <td>${client.prenom}</td>
            <td>${client.tel}</td>
            <td>${client.email || '-'}</td>
            <td class="actions">
                <button class="btn-icon" onclick="editClient(${client.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteClientConfirm(${client.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editClient(id) {
    const client = getClientById(id);
    if (client) {
        openClientModal(client);
    }
}

function deleteClientConfirm(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client?')) {
        deleteClient(id);
        renderClients();
        initDashboard();
    }
}

// ==================== SERVICES ====================
function initServices() {
    document.getElementById('add-service-btn').addEventListener('click', function() {
        openServiceModal();
    });
    
    renderServices();
}

function renderServices() {
    const container = document.getElementById('services-grid');
    
    if (services.length === 0) {
        container.innerHTML = '<p class="no-data">Aucun service disponible</p>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <h3>${service.nom}</h3>
                <span class="service-category">${getCategoryText(service.categorie)}</span>
            </div>
            <p class="service-description">${service.description || 'Aucune description'}</p>
            <div class="service-footer">
                <div class="service-info">
                    <span class="service-duration"><i class="far fa-clock"></i> ${service.duree} min</span>
                    <span class="service-price">${service.prix}€</span>
                </div>
                <div class="service-actions">
                    <button class="btn-icon" onclick="editService(${service.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteServiceConfirm(${service.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function editService(id) {
    const service = getServiceById(id);
    if (service) {
        openServiceModal(service);
    }
}

function deleteServiceConfirm(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service?')) {
        deleteService(id);
        renderServices();
        initDashboard();
    }
}

// ==================== RENDEZ-VOUS ====================
function initAppointments() {
    // Filtres
    document.getElementById('filter-date').addEventListener('change', renderAppointments);
    document.getElementById('filter-status').addEventListener('change', renderAppointments);
    
    renderAppointments();
}

function renderAppointments() {
    const tbody = document.getElementById('appointments-tbody');
    const filterDate = document.getElementById('filter-date').value;
    const filterStatus = document.getElementById('filter-status').value;
    
    let filteredAppointments = [...appointments];
    
    if (filterDate) {
        filteredAppointments = filteredAppointments.filter(a => a.date === filterDate);
    }
    
    if (filterStatus) {
        filteredAppointments = filteredAppointments.filter(a => a.statut === filterStatus);
    }
    
    // Trier par date et heure
    filteredAppointments.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.heure.localeCompare(b.heure);
    });
    
    if (filteredAppointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">Aucun rendez-vous trouvé</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredAppointments.map(apt => {
        const client = getClientById(apt.clientId);
        const service = getServiceById(apt.serviceId);
        const statusClass = getStatusClass(apt.statut);
        
        return `
            <tr>
                <td>${apt.id}</td>
                <td>${client ? client.prenom + ' ' + client.nom : 'Inconnu'}</td>
                <td>${service ? service.nom : 'Inconnu'}</td>
                <td>${formatDate(apt.date)}</td>
                <td>${apt.heure}</td>
                <td>${apt.duree} min</td>
                <td>${apt.prix}€</td>
                <td>
                    <select class="status-select ${statusClass}" onchange="updateAppointmentStatus(${apt.id}, this.value)">
                        <option value="pending" ${apt.statut === 'pending' ? 'selected' : ''}>En attente</option>
                        <option value="confirmed" ${apt.statut === 'confirmed' ? 'selected' : ''}>Confirmé</option>
                        <option value="completed" ${apt.statut === 'completed' ? 'selected' : ''}>Terminé</option>
                        <option value="cancelled" ${apt.statut === 'cancelled' ? 'selected' : ''}>Annulé</option>
                    </select>
                </td>
                <td class="actions">
                    <button class="btn-icon btn-delete" onclick="deleteAppointmentConfirm(${apt.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateAppointmentStatus(id, status) {
    updateAppointment(id, { statut: status });
    initDashboard();
}

function deleteAppointmentConfirm(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous?')) {
        deleteAppointment(id);
        renderAppointments();
        initDashboard();
    }
}

// ==================== NOUVEAU RDV ====================
function initNewAppointment() {
    const form = document.getElementById('appointment-form');
    const clientSelect = document.getElementById('appointment-client');
    const serviceSelect = document.getElementById('appointment-service');
    
    // Remplir la liste des clients
    clientSelect.innerHTML = '<option value="">Sélectionner un client</option>' +
        clients.map(c => `<option value="${c.id}">${c.prenom} ${c.nom}</option>`).join('');
    
    // Remplir la liste des services
    serviceSelect.innerHTML = '<option value="">Sélectionner un service</option>' +
        services.map(s => `<option value="${s.id}" data-duree="${s.duree}" data-prix="${s.prix}">${s.nom} - ${s.prix}€ (${s.duree}min)</option>`).join('');
    
    // Définir la date minimale (aujourd'hui)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointment-date').min = today;
    document.getElementById('appointment-date').value = today;
    
    // Mettre à jour le résumé quand le service change
    serviceSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const duree = selectedOption.getAttribute('data-duree');
        const prix = selectedOption.getAttribute('data-prix');
        
        document.getElementById('summary-duration').textContent = duree ? duree + ' min' : '-';
        document.getElementById('summary-price').textContent = prix ? prix + '€' : '0€';
    });
    
    // Soumettre le formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientId = parseInt(document.getElementById('appointment-client').value);
        const serviceId = parseInt(document.getElementById('appointment-service').value);
        const date = document.getElementById('appointment-date').value;
        const heure = document.getElementById('appointment-time').value;
        const notes = document.getElementById('appointment-notes').value;
        
        const service = getServiceById(serviceId);
        
        if (!clientId || !serviceId || !date || !heure) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        const newAppointment = {
            clientId: clientId,
            serviceId: serviceId,
            date: date,
            heure: heure,
            duree: service.duree,
            prix: service.prix,
            statut: 'pending',
            notes: notes
        };
        
        addAppointment(newAppointment);
        
        // Réinitialiser le formulaire
        form.reset();
        document.getElementById('summary-duration').textContent = '-';
        document.getElementById('summary-price').textContent = '0€';
        document.getElementById('appointment-date').value = today;
        
        alert('Rendez-vous créé avec succès!');
        navigateTo('appointments');
    });
}

// ==================== MODALS ====================
function initModals() {
    // Modal Client
    const clientModal = document.getElementById('client-modal');
    const clientForm = document.getElementById('client-form');
    
    document.getElementById('cancel-client').addEventListener('click', function() {
        closeModal('client-modal');
    });
    
    clientForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientId = document.getElementById('client-id').value;
        const clientData = {
            nom: document.getElementById('client-nom').value,
            prenom: document.getElementById('client-prenom').value,
            tel: document.getElementById('client-tel').value,
            email: document.getElementById('client-email').value,
            adresse: document.getElementById('client-adresse').value,
            notes: document.getElementById('client-notes').value
        };
        
        if (clientId) {
            updateClient(parseInt(clientId), clientData);
        } else {
            addClient(clientData);
        }
        
        closeModal('client-modal');
        renderClients();
        initDashboard();
        
        // Mettre à jour la liste des clients dans le formulaire de RDV
        const clientSelect = document.getElementById('appointment-client');
        clientSelect.innerHTML = '<option value="">Sélectionner un client</option>' +
            clients.map(c => `<option value="${c.id}">${c.prenom} ${c.nom}</option>`).join('');
    });
    
    // Modal Service
    const serviceModal = document.getElementById('service-modal');
    const serviceForm = document.getElementById('service-form');
    
    document.getElementById('cancel-service').addEventListener('click', function() {
        closeModal('service-modal');
    });
    
    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const serviceId = document.getElementById('service-id').value;
        const serviceData = {
            nom: document.getElementById('service-nom').value,
            description: document.getElementById('service-description').value,
            duree: parseInt(document.getElementById('service-duree').value),
            prix: parseFloat(document.getElementById('service-prix').value),
            categorie: document.getElementById('service-category').value
        };
        
        if (serviceId) {
            updateService(parseInt(serviceId), serviceData);
        } else {
            addService(serviceData);
        }
        
        closeModal('service-modal');
        renderServices();
        initDashboard();
        
        // Mettre à jour la liste des services dans le formulaire de RDV
        const serviceSelect = document.getElementById('appointment-service');
        serviceSelect.innerHTML = '<option value="">Sélectionner un service</option>' +
            services.map(s => `<option value="${s.id}" data-duree="${s.duree}" data-prix="${s.prix}">${s.nom} - ${s.prix}€ (${s.duree}min)</option>`).join('');
    });
    
    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function openClientModal(client = null) {
    const modal = document.getElementById('client-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('client-form');
    
    form.reset();
    
    if (client) {
        title.textContent = 'Modifier le Client';
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-nom').value = client.nom;
        document.getElementById('client-prenom').value = client.prenom;
        document.getElementById('client-tel').value = client.tel;
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-adresse').value = client.adresse || '';
        document.getElementById('client-notes').value = client.notes || '';
    } else {
        title.textContent = 'Nouveau Client';
        document.getElementById('client-id').value = '';
    }
    
    modal.style.display = 'block';
}

function openServiceModal(service = null) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');
    const form = document.getElementById('service-form');
    
    form.reset();
    
    if (service) {
        title.textContent = 'Modifier le Service';
        document.getElementById('service-id').value = service.id;
        document.getElementById('service-nom').value = service.nom;
        document.getElementById('service-description').value = service.description || '';
        document.getElementById('service-duree').value = service.duree;
        document.getElementById('service-prix').value = service.prix;
        document.getElementById('service-category').value = service.categorie;
    } else {
        title.textContent = 'Nouveau Service';
        document.getElementById('service-id').value = '';
    }
    
    modal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ==================== FONCTIONS UTILITAIRES ====================
function getStatusClass(status) {
    const classes = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return classes[status] || '';
}

function getStatusText(status) {
    const texts = {
        'pending': 'En attente',
        'confirmed': 'Confirmé',
        'completed': 'Terminé',
        'cancelled': 'Annulé'
    };
    return texts[status] || status;
}

function getCategoryText(category) {
    const texts = {
        'massage': 'Massage',
        'soin': 'Soin',
        'autre': 'Autre'
    };
    return texts[category] || category;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
