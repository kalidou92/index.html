// Données initiales pour le salon de massage

// Services disponibles
const services = [
    {
        id: 1,
        nom: "Massage Suédois",
        description: "Massage relaxant utilisant des mouvements longs et fluides pour détendre les muscles",
        duree: 60,
        prix: 65,
        categorie: "massage"
    },
    {
        id: 2,
        nom: "Massage Deep Tissue",
        description: "Massage profond ciblant les couches musculaires profondes pour soulager les tensions",
        duree: 60,
        prix: 75,
        categorie: "massage"
    },
    {
        id: 3,
        nom: "Massage Sportif",
        description: "Massage adapté aux athlètes pour améliorer la récupération et la performance",
        duree: 45,
        prix: 55,
        categorie: "massage"
    },
    {
        id: 4,
        nom: "Massage aux Pierres Chaudes",
        description: "Utilisation de pierres volcaniques chaudes pour une relaxation profonde",
        duree: 75,
        prix: 85,
        categorie: "massage"
    },
    {
        id: 5,
        nom: "Soin du Visage",
        description: "Nettoyage et hydratation du visage pour une peau radieuse",
        duree: 45,
        prix: 50,
        categorie: "soin"
    },
    {
        id: 6,
        nom: "Aromathérapie",
        description: "Massage utilisant des huiles essentielles pour le bien-être émotionnel",
        duree: 60,
        prix: 70,
        categorie: "massage"
    }
];

// Clients
const clients = [
    {
        id: 1,
        nom: "Dupont",
        prenom: "Marie",
        tel: "06 12 34 56 78",
        email: "marie.dupont@email.fr",
        adresse: "15 rue de la Paix, 75001 Paris",
        notes: "Préfère les massages le matin",
        dateCreation: "2024-01-15"
    },
    {
        id: 2,
        nom: "Martin",
        prenom: "Jean",
        tel: "06 23 45 67 89",
        email: "jean.martin@email.fr",
        adresse: "8 avenue des Champs-Élysées, 75008 Paris",
        notes: "Allergique à certaines huiles essentielles",
        dateCreation: "2024-02-20"
    },
    {
        id: 3,
        nom: "Bernard",
        prenom: "Sophie",
        tel: "06 34 56 78 90",
        email: "sophie.bernard@email.fr",
        adresse: "22 rue de Rivoli, 75001 Paris",
        notes: "Cliente régulière",
        dateCreation: "2024-03-10"
    },
    {
        id: 4,
        nom: "Thomas",
        prenom: "Pierre",
        tel: "06 45 67 89 01",
        email: "pierre.thomas@email.fr",
        adresse: "5 boulevard Saint-Germain, 75005 Paris",
        notes: "",
        dateCreation: "2024-03-25"
    }
];

// Rendez-vous
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const appointments = [
    {
        id: 1,
        clientId: 1,
        serviceId: 1,
        date: todayStr,
        heure: "09:00",
        duree: 60,
        prix: 65,
        statut: "confirmed",
        notes: "Premier rendez-vous"
    },
    {
        id: 2,
        clientId: 2,
        serviceId: 2,
        date: todayStr,
        heure: "10:30",
        duree: 60,
        prix: 75,
        statut: "confirmed",
        notes: ""
    },
    {
        id: 3,
        clientId: 3,
        serviceId: 4,
        date: todayStr,
        heure: "14:00",
        duree: 75,
        prix: 85,
        statut: "pending",
        notes: "Massage offert"
    },
    {
        id: 4,
        clientId: 1,
        serviceId: 3,
        date: todayStr,
        heure: "16:00",
        duree: 45,
        prix: 55,
        statut: "confirmed",
        notes: ""
    },
    {
        id: 5,
        clientId: 4,
        serviceId: 5,
        date: todayStr,
        heure: "11:00",
        duree: 45,
        prix: 50,
        statut: "completed",
        notes: "Soin réalisé"
    }
];

// Fonctions utilitaires pour la gestion des données
function getNextId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

function addClient(client) {
    client.id = getNextId(clients);
    client.dateCreation = new Date().toISOString().split('T')[0];
    clients.push(client);
    return client;
}

function updateClient(id, updates) {
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
        clients[index] = { ...clients[index], ...updates };
        return clients[index];
    }
    return null;
}

function deleteClient(id) {
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
        clients.splice(index, 1);
        return true;
    }
    return false;
}

function addService(service) {
    service.id = getNextId(services);
    services.push(service);
    return service;
}

function updateService(id, updates) {
    const index = services.findIndex(s => s.id === id);
    if (index !== -1) {
        services[index] = { ...services[index], ...updates };
        return services[index];
    }
    return null;
}

function deleteService(id) {
    const index = services.findIndex(s => s.id === id);
    if (index !== -1) {
        services.splice(index, 1);
        return true;
    }
    return false;
}

function addAppointment(appointment) {
    appointment.id = getNextId(appointments);
    appointments.push(appointment);
    return appointment;
}

function updateAppointment(id, updates) {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates };
        return appointments[index];
    }
    return null;
}

function deleteAppointment(id) {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments.splice(index, 1);
        return true;
    }
    return false;
}

function getClientById(id) {
    return clients.find(c => c.id === id);
}

function getServiceById(id) {
    return services.find(s => s.id === id);
}

function getAppointmentsByDate(date) {
    return appointments.filter(a => a.date === date);
}

function getTodayAppointments() {
    return appointments.filter(a => a.date === todayStr);
}
