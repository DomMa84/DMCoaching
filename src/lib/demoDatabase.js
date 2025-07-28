// src/lib/demoDatabase.js v1.0 (Preview Server Demo Database)
// Demo-Datenbank Simulation für Preview Server
// ✅ ZWECK: Realistische Datenbank-Simulation ohne externe Abhängigkeiten
// ✅ FEATURES: CRUD-Operationen, Demo-Daten, später MySQL-kompatibel
// ✅ VERWENDUNG: ContactForm → Admin Dashboard Integration

console.log('📊 Demo Database v1.0 loaded - Preview Server ready');

// ✅ DEMO DATENBANK - IN-MEMORY STORAGE
let demoContacts = [
  {
    id: 1,
    name: 'Max Mustermann',
    email: 'max.mustermann@email.de',
    phone: '+49 123 456789',
    message: 'Ich interessiere mich für eine Beratung bezüglich strategischer Unternehmensentwicklung. Könnten wir einen Termin vereinbaren? Ich leite ein mittelständisches Unternehmen mit 50 Mitarbeitern.',
    status: 'neu',
    notes: '',
    leadForm: false,
    source: 'Website-Kontaktformular',
    gdprConsent: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.100',
    created_at: '2025-07-28T10:30:00Z',
    updated_at: '2025-07-28T10:30:00Z',
    processed: false
  },
  {
    id: 2,
    name: 'Lisa Weber',
    email: 'lisa.weber@techstart.com',
    phone: '+49 987 654321',
    message: 'Hallo Herr Maier, wir sind ein Startup im Bereich KI-Technologie und benötigen Unterstützung bei der Vertriebsoptimierung. Können Sie uns dabei helfen, unsere Sales-Prozesse zu verbessern?',
    status: 'offen',
    notes: 'Termin für nächste Woche vereinbart - Mittwoch 14:00 Uhr. Sehr interessanter Case für KI-Startup.',
    leadForm: true,
    source: 'Website-Kontaktformular',
    gdprConsent: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ipAddress: '192.168.1.101',
    created_at: '2025-07-27T14:15:00Z',
    updated_at: '2025-07-28T09:20:00Z',
    processed: true
  },
  {
    id: 3,
    name: 'Thomas Schmidt',
    email: 'thomas.schmidt@industriefirma.de',
    phone: '+49 555 123456',
    message: 'Guten Tag, wir sind ein Industrieunternehmen mit 200 Mitarbeitern und benötigen Interim Management für unsere Marketingabteilung. Der bisherige Leiter hat kurzfristig gekündigt.',
    status: 'abgeschlossen',
    notes: 'Projekt erfolgreich abgeschlossen. 6-monatiges Interim Management durchgeführt. Nachfolger erfolgreich eingearbeitet. Sehr zufriedener Kunde.',
    leadForm: false,
    source: 'Website-Kontaktformular',
    gdprConsent: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.102',
    created_at: '2025-07-15T08:45:00Z',
    updated_at: '2025-07-26T16:30:00Z',
    processed: true
  },
  {
    id: 4,
    name: 'Sandra Müller',
    email: 'sandra.mueller@consulting-firm.de',
    phone: '+49 711 987654',
    message: 'Sehr geehrter Herr Maier, wir möchten gerne eine Wertanalyse für unser Beratungsunternehmen durchführen lassen. Können Sie uns ein Angebot unterbreiten?',
    status: 'neu',
    notes: '',
    leadForm: true,
    source: 'Website-Kontaktformular',
    gdprConsent: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    ipAddress: '192.168.1.103',
    created_at: '2025-07-28T08:20:00Z',
    updated_at: '2025-07-28T08:20:00Z',
    processed: false
  },
  {
    id: 5,
    name: 'Michael Braun',
    email: 'michael.braun@handelsunternehmen.de',
    phone: '+49 40 555666',
    message: 'Hallo, wir haben Probleme mit unseren Marketing-Strategien. Die Reichweite ist zu gering und die Conversion-Rate zu niedrig. Können Sie uns dabei helfen?',
    status: 'offen',
    notes: 'Erstberatung am Telefon durchgeführt. Analyse der aktuellen Marketing-Kanäle erforderlich. Folgeberatung geplant.',
    leadForm: false,
    source: 'Website-Kontaktformular',
    gdprConsent: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
    ipAddress: '192.168.1.104',
    created_at: '2025-07-26T16:45:00Z',
    updated_at: '2025-07-27T10:15:00Z',
    processed: true
  }
];

// ✅ ID COUNTER für neue Kontakte
let nextContactId = 6;

// ✅ DATABASE OPERATIONS

/**
 * Alle Kontakte abrufen
 * @returns {Array} Array aller Kontakte
 */
export function getAllContacts() {
  console.log('📋 Demo DB: getAllContacts called - returning', demoContacts.length, 'contacts');
  return [...demoContacts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Kontakt nach ID abrufen
 * @param {number} id - Kontakt ID
 * @returns {Object|null} Kontakt oder null
 */
export function getContactById(id) {
  const contact = demoContacts.find(c => c.id === parseInt(id));
  console.log('🔍 Demo DB: getContactById', id, contact ? 'found' : 'not found');
  return contact || null;
}

/**
 * Kontakte nach Status filtern
 * @param {string} status - Status (neu, offen, abgeschlossen)
 * @returns {Array} Gefilterte Kontakte
 */
export function getContactsByStatus(status) {
  const filtered = demoContacts.filter(c => c.status === status);
  console.log('🔍 Demo DB: getContactsByStatus', status, '- found', filtered.length, 'contacts');
  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Neuen Kontakt erstellen
 * @param {Object} contactData - Kontakt-Daten
 * @returns {Object} Erstellter Kontakt
 */
export function createContact(contactData) {
  console.log('✅ Demo DB: createContact called with data:', {
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    messageLength: contactData.message?.length || 0
  });

  const newContact = {
    id: nextContactId++,
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    message: contactData.message || '',
    status: 'neu',
    notes: '',
    leadForm: contactData.leadForm || false,
    source: contactData.source || 'Website-Kontaktformular',
    gdprConsent: contactData.gdprConsent || false,
    userAgent: contactData.userAgent || 'Unknown',
    ipAddress: contactData.ipAddress || 'Unknown',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    processed: false
  };

  demoContacts.push(newContact);
  
  console.log('🎉 Demo DB: Contact created successfully with ID:', newContact.id);
  console.log('📊 Demo DB: Total contacts now:', demoContacts.length);
  
  return newContact;
}

/**
 * Kontakt aktualisieren
 * @param {number} id - Kontakt ID
 * @param {Object} updateData - Zu aktualisierende Daten
 * @returns {Object|null} Aktualisierter Kontakt oder null
 */
export function updateContact(id, updateData) {
  console.log('🔄 Demo DB: updateContact called for ID:', id, 'with data:', updateData);

  const contactIndex = demoContacts.findIndex(c => c.id === parseInt(id));
  
  if (contactIndex === -1) {
    console.log('❌ Demo DB: Contact not found for update:', id);
    return null;
  }

  // Kontakt aktualisieren
  const updatedContact = {
    ...demoContacts[contactIndex],
    ...updateData,
    updated_at: new Date().toISOString()
  };

  demoContacts[contactIndex] = updatedContact;
  
  console.log('✅ Demo DB: Contact updated successfully:', id);
  return updatedContact;
}

/**
 * Kontakt löschen
 * @param {number} id - Kontakt ID
 * @returns {boolean} Erfolgreich gelöscht
 */
export function deleteContact(id) {
  console.log('🗑️ Demo DB: deleteContact called for ID:', id);

  const contactIndex = demoContacts.findIndex(c => c.id === parseInt(id));
  
  if (contactIndex === -1) {
    console.log('❌ Demo DB: Contact not found for deletion:', id);
    return false;
  }

  demoContacts.splice(contactIndex, 1);
  
  console.log('✅ Demo DB: Contact deleted successfully:', id);
  console.log('📊 Demo DB: Total contacts now:', demoContacts.length);
  return true;
}

/**
 * Statistiken abrufen
 * @returns {Object} Kontakt-Statistiken
 */
export function getContactStats() {
  const stats = {
    total: demoContacts.length,
    neu: demoContacts.filter(c => c.status === 'neu').length,
    offen: demoContacts.filter(c => c.status === 'offen').length,
    abgeschlossen: demoContacts.filter(c => c.status === 'abgeschlossen').length,
    leadForm: demoContacts.filter(c => c.leadForm === true).length,
    processed: demoContacts.filter(c => c.processed === true).length,
    lastContact: demoContacts.length > 0 ? 
      Math.max(...demoContacts.map(c => new Date(c.created_at))) : null
  };

  console.log('📊 Demo DB: getContactStats called - stats:', stats);
  return stats;
}

/**
 * Kontakte nach Datum-Bereich abrufen
 * @param {string} startDate - Start-Datum (ISO String)
 * @param {string} endDate - End-Datum (ISO String)
 * @returns {Array} Kontakte im Zeitraum
 */
export function getContactsByDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const filtered = demoContacts.filter(c => {
    const contactDate = new Date(c.created_at);
    return contactDate >= start && contactDate <= end;
  });

  console.log('📅 Demo DB: getContactsByDateRange', startDate, 'to', endDate, '- found', filtered.length, 'contacts');
  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Kontakte nach E-Mail suchen
 * @param {string} email - E-Mail-Adresse
 * @returns {Object|null} Kontakt oder null
 */
export function getContactByEmail(email) {
  const contact = demoContacts.find(c => c.email.toLowerCase() === email.toLowerCase());
  console.log('🔍 Demo DB: getContactByEmail', email, contact ? 'found' : 'not found');
  return contact || null;
}

/**
 * Demo-Datenbank zurücksetzen (für Testing)
 */
export function resetDemoDatabase() {
  console.log('🔄 Demo DB: resetDemoDatabase called - resetting to initial state');
  
  demoContacts = [
    {
      id: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@email.de',
      phone: '+49 123 456789',
      message: 'Ich interessiere mich für eine Beratung bezüglich strategischer Unternehmensentwicklung.',
      status: 'neu',
      notes: '',
      leadForm: false,
      source: 'Website-Kontaktformular',
      gdprConsent: true,
      userAgent: 'Mozilla/5.0',
      ipAddress: '192.168.1.100',
      created_at: '2025-07-28T10:30:00Z',
      updated_at: '2025-07-28T10:30:00Z',
      processed: false
    }
  ];
  
  nextContactId = 2;
  console.log('✅ Demo DB: Database reset complete');
}

/**
 * Demo-Datenbank Status abrufen
 * @returns {Object} Status-Informationen
 */
export function getDemoDbStatus() {
  return {
    version: '1.0',
    type: 'Demo Database (In-Memory)',
    contactCount: demoContacts.length,
    nextId: nextContactId,
    lastUpdated: new Date().toISOString(),
    features: [
      'CRUD Operations',
      'Status Management', 
      'Statistics',
      'Date Range Queries',
      'Email Search',
      'Preview Server Ready'
    ]
  };
}

// ✅ EXPORT DEFAULT für einfache Verwendung
export default {
  getAllContacts,
  getContactById,
  getContactsByStatus,
  createContact,
  updateContact,
  deleteContact,
  getContactStats,
  getContactsByDateRange,
  getContactByEmail,
  resetDemoDatabase,
  getDemoDbStatus
};