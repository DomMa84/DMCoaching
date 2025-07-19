// src/lib/database.ts v3.0 (Development mode with local fallback)
import mysql from 'mysql2/promise';

console.log('🗄️ Database v3.0 loaded');

// Entwicklungsumgebung erkennen
const isDevelopment = process.env.NODE_ENV !== 'production';

// Debugging für Entwicklung
console.log('🔍 DB Config v3.0:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD,
  isDevelopment: isDevelopment
});

interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
  gdprConsent: boolean;
  leadForm: boolean;
  honeypot: string;
}

interface DatabaseContact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'neu' | 'offen' | 'abgeschlossen';
  notes: string;
  gdpr_consent: boolean;
  lead_form: boolean;
  created_at: string;
  updated_at: string;
}

// Lokale Datenbank-Simulation für Entwicklung
let localContacts: DatabaseContact[] = [
  {
    id: 1,
    name: 'Max Mustermann',
    email: 'max.mustermann@email.de',
    phone: '+49 123 456789',
    message: 'Ich interessiere mich für eine Beratung bezüglich Vermögensaufbau. Könnten wir einen Termin vereinbaren?',
    status: 'neu',
    notes: '',
    gdpr_consent: true,
    lead_form: false,
    created_at: '2025-07-18T12:30:00Z',
    updated_at: '2025-07-18T12:30:00Z'
  },
  {
    id: 2,
    name: 'Lisa Weber',
    email: 'lisa.weber@example.com',
    phone: '+49 987 654321',
    message: 'Hallo, ich hätte gerne Informationen zu Ihren Versicherungsprodukten für junge Familien.',
    status: 'offen',
    notes: 'Termin für nächste Woche vereinbart',
    gdpr_consent: true,
    lead_form: false,
    created_at: '2025-07-18T09:15:00Z',
    updated_at: '2025-07-18T09:15:00Z'
  },
  {
    id: 3,
    name: 'Thomas Schmidt',
    email: 'thomas.schmidt@firma.de',
    phone: '+49 555 123456',
    message: 'Firmenversicherung für 15 Mitarbeiter gesucht. Bitte um Rückruf.',
    status: 'abgeschlossen',
    notes: 'Angebot versendet, Vertrag unterschrieben',
    gdpr_consent: true,
    lead_form: false,
    created_at: '2025-07-17T14:45:00Z',
    updated_at: '2025-07-17T14:45:00Z'
  }
];

let nextId = 4;

// Datenbank-Konfiguration für Strato (nur für Produktion)
const dbConfig = {
  host: process.env.DB_HOST || 'database-5017670143.webspace-host.com',
  user: process.env.DB_USER || 'dbu5377946',
  password: process.env.DB_PASSWORD || 'MaierValue#2025',
  database: process.env.DB_NAME || 'dbs14130950',
  charset: 'utf8mb4',
  connectTimeout: 5000,
  acquireTimeout: 5000,
  timeout: 5000,
  ssl: false
};

console.log('⚙️ Database config v3.0 initialized');

let pool: mysql.Pool;

// Connection Pool erstellen (nur für Produktion)
export function getPool(): mysql.Pool {
  if (!pool && !isDevelopment) {
    console.log('🔄 Creating new database pool v3.0');
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Datenbank-Verbindung testen
export async function testConnection(): Promise<boolean> {
  if (isDevelopment) {
    console.log('🧪 Development mode v3.0 - using local simulation');
    return true;
  }

  console.log('🧪 Testing database connection v3.0');
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Datenbankverbindung erfolgreich v3.0');
    return true;
  } catch (error) {
    console.error('❌ Datenbankverbindung fehlgeschlagen v3.0:', error);
    return false;
  }
}

// Kontakte aus der Datenbank laden
export async function getContacts(): Promise<DatabaseContact[]> {
  console.log('📋 Loading contacts from database v3.0');
  
  // Entwicklungsmodus: Lokale Simulation
  if (isDevelopment) {
    console.log('🔧 Development mode v3.0 - returning local contacts');
    return localContacts;
  }

  // Produktionsmodus: Echte Datenbank
  try {
    const [rows] = await getPool().execute(`
      SELECT 
        id,
        name,
        email,
        phone,
        message,
        status,
        notes,
        gdpr_consent,
        lead_form,
        created_at,
        updated_at
      FROM contacts 
      ORDER BY created_at DESC
    `);
    
    const contacts = rows as DatabaseContact[];
    console.log('✅ Loaded contacts v3.0:', contacts.length);
    return contacts;
  } catch (error) {
    console.error('❌ Fehler beim Laden der Kontakte v3.0:', error);
    throw error;
  }
}

// Kontakt-Status aktualisieren
export async function updateContactStatus(id: number, status: 'neu' | 'offen' | 'abgeschlossen'): Promise<boolean> {
  console.log('🔄 Updating contact status v3.0:', { id, status });
  
  // Entwicklungsmodus: Lokale Simulation
  if (isDevelopment) {
    const contact = localContacts.find(c => c.id === id);
    if (contact) {
      contact.status = status;
      contact.updated_at = new Date().toISOString();
      console.log('✅ Status updated locally v3.0');
      return true;
    }
    return false;
  }

  // Produktionsmodus: Echte Datenbank
  try {
    await getPool().execute(
      'UPDATE contacts SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    
    console.log('✅ Status updated successfully v3.0');
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren des Status v3.0:', error);
    throw error;
  }
}

// Kontakt-Notizen aktualisieren
export async function updateContactNotes(id: number, notes: string): Promise<boolean> {
  console.log('📝 Updating contact notes v3.0:', { id, notesLength: notes.length });
  
  // Entwicklungsmodus: Lokale Simulation
  if (isDevelopment) {
    const contact = localContacts.find(c => c.id === id);
    if (contact) {
      contact.notes = notes;
      contact.updated_at = new Date().toISOString();
      console.log('✅ Notes updated locally v3.0');
      return true;
    }
    return false;
  }

  // Produktionsmodus: Echte Datenbank
  try {
    await getPool().execute(
      'UPDATE contacts SET notes = ?, updated_at = NOW() WHERE id = ?',
      [notes, id]
    );
    
    console.log('✅ Notes updated successfully v3.0');
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Notizen v3.0:', error);
    throw error;
  }
}

// Neuen Kontakt speichern
export async function saveContact(contactData: ContactData): Promise<number> {
  console.log('💾 Saving new contact v3.0:', {
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    hasMessage: !!contactData.message,
    gdprConsent: contactData.gdprConsent,
    leadForm: contactData.leadForm
  });
  
  // Entwicklungsmodus: Lokale Simulation
  if (isDevelopment) {
    const newContact: DatabaseContact = {
      id: nextId++,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      message: contactData.message,
      status: 'neu',
      notes: '',
      gdpr_consent: contactData.gdprConsent,
      lead_form: contactData.leadForm,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    localContacts.unshift(newContact); // Am Anfang hinzufügen
    console.log('✅ Contact saved locally v3.0 with ID:', newContact.id);
    return newContact.id;
  }

  // Produktionsmodus: Echte Datenbank
  try {
    const [result] = await getPool().execute(`
      INSERT INTO contacts (
        name, 
        email, 
        phone, 
        message, 
        status,
        gdpr_consent,
        lead_form,
        honeypot,
        created_at
      ) VALUES (?, ?, ?, ?, 'neu', ?, ?, ?, NOW())
    `, [
      contactData.name,
      contactData.email,
      contactData.phone,
      contactData.message,
      contactData.gdprConsent,
      contactData.leadForm,
      contactData.honeypot
    ]);
    
    const insertId = (result as any).insertId;
    console.log('✅ Contact saved successfully v3.0 with ID:', insertId);
    return insertId;
  } catch (error) {
    console.error('❌ Fehler beim Speichern des Kontakts v3.0:', error);
    throw error;
  }
}