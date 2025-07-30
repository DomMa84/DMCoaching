/**
 * Astro API Route: /api/contact
 * 
 * DATEI PFAD: src/pages/api/contact.js
 * 
 * Contact API v18.1 - Supabase Integration (Astro Version)
 * 
 * CHANGELOG v18.1:
 * - Echte Supabase PostgreSQL Integration
 * - Intelligentes Fallback zu Demo Database
 * - Astro-kompatible API-Struktur
 * - Environment Variables: import.meta.env
 * - Response-Format für Astro optimiert
 */

import { createClient } from '@supabase/supabase-js';

// ===============================
// SUPABASE SETUP (PRODUCTION)
// ===============================

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://bqcwyfzspdbcanondyyz.supabase.co';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3d5ZnpzcGRiY2Fub25keXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODI0NjQsImV4cCI6MjA2OTM1ODQ2NH0.d5QxZWZGDiMyigiEHctL9jImTQyqqxBhBE6YUmdBhrI';

let supabase = null;
let supabaseConnectionTested = false;

// Supabase Client initialisieren
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.warn('❌ Supabase client initialization failed:', error.message);
  }
}

// ===============================
// DEMO DATABASE (FALLBACK)
// ===============================

const demoDatabase = {
  contacts: [
    {
      id: 1,
      name: "Max Mustermann",
      email: "max@example.com",
      phone: "+49 123 456789",
      company: "Musterfirma GmbH",
      message: "Interesse an strategischer Beratung für Expansion in neue Märkte.",
      status: "new",
      notes: "",
      created_at: "2025-07-25T10:30:00Z",
      updated_at: "2025-07-25T10:30:00Z"
    },
    {
      id: 2,
      name: "Anna Schmidt",
      email: "a.schmidt@techcorp.de",
      phone: "+49 987 654321",
      company: "TechCorp Solutions",
      message: "Benötigen Unterstützung bei Vertriebsoptimierung. Zeitnaher Termin gewünscht.",
      status: "contacted",
      notes: "Erstgespräch am 28.07. vereinbart",
      created_at: "2025-07-24T14:15:00Z",
      updated_at: "2025-07-26T09:20:00Z"
    },
    {
      id: 3,
      name: "Robert Klein",
      email: "robert.klein@startup-innovations.com",
      phone: "+49 555 123456",
      company: "Startup Innovations",
      message: "Junges Unternehmen sucht erfahrenen Interim Manager für Strukturaufbau.",
      status: "converted",
      notes: "3-Monats-Projekt gestartet",
      created_at: "2025-07-20T16:45:00Z",
      updated_at: "2025-07-23T11:10:00Z"
    }
  ]
};

// ===============================
// DATABASE FUNKTIONEN
// ===============================

async function testSupabaseConnection() {
  if (!supabase || supabaseConnectionTested) {
    return supabase !== null;
  }

  try {
    const { count, error } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    
    console.log(`✅ Supabase connection successful. Found ${count} contacts.`);
    supabaseConnectionTested = true;
    return true;
  } catch (error) {
    console.warn('❌ Supabase connection test failed:', error.message);
    supabaseConnectionTested = true;
    return false;
  }
}

async function getAllContacts() {
  if (supabase && await testSupabaseConnection()) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // leadform zu leadForm mapping für Admin Dashboard
      const contacts = data.map(contact => ({
        ...contact,
        leadForm: contact.leadform || false
      }));
      
      console.log(`✅ Loaded ${contacts.length} contacts from Supabase`);
      return contacts;
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database fallback');
  return demoDatabase.contacts;
}

async function createContact(contactData) {
  if (supabase && await testSupabaseConnection()) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          message: contactData.message,
          status: 'new',
          notes: '',
          leadform: contactData.leadForm || false
        }])
        .select()
        .single();

      if (error) throw error;
      
      console.log(`✅ Contact created in Supabase with ID: ${data.id}`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase createContact failed:', error.message);
    }
  }
  
  console.log('📦 Creating contact in demo database');
  const newContact = {
    id: demoDatabase.contacts.length + 1,
    ...contactData,
    status: 'new',
    notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  demoDatabase.contacts.unshift(newContact);
  return newContact;
}

async function updateContact(contactId, updateData) {
  if (supabase && await testSupabaseConnection()) {
    try {
      // Erlaubte Felder für Updates (leadForm hinzugefügt)
      const allowedFields = ['status', 'notes', 'leadform'];
      const updates = {};
      
      // leadForm zu leadform mapping für Supabase
      if (updateData.hasOwnProperty('leadForm')) {
        updates.leadform = updateData.leadForm;
      }
      
      // Andere Felder direkt übernehmen
      allowedFields.forEach(field => {
        if (updateData.hasOwnProperty(field) && field !== 'leadform') {
          updates[field] = updateData[field];
        }
      });
      
      if (Object.keys(updates).length === 0) {
        throw new Error('No valid fields to update');
      }
      
      // Updated_at hinzufügen
      updates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`✅ Contact ${contactId} updated in Supabase`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase updateContact failed:', error.message);
    }
  }
  
  console.log(`📦 Updating contact ${contactId} in demo database`);
  const contact = demoDatabase.contacts.find(c => c.id == contactId);
  if (contact) {
    Object.assign(contact, updateData);
    contact.updated_at = new Date().toISOString();
    return contact;
  }
  return null;
}

async function getContactStats() {
  if (supabase && await testSupabaseConnection()) {
    try {
      const { count: total } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      const { data: statusData } = await supabase
        .from('contacts')
        .select('status')
        .not('status', 'is', null);

      const stats = { total: total || 0, new: 0, contacted: 0, converted: 0, archived: 0 };
      
      statusData?.forEach(row => {
        if (stats.hasOwnProperty(row.status)) {
          stats[row.status]++;
        }
      });

      console.log(`✅ Stats loaded from Supabase: ${stats.total} total contacts`);
      return stats;
    } catch (error) {
      console.warn('❌ Supabase getContactStats failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database stats');
  const stats = { total: 0, new: 0, contacted: 0, converted: 0, archived: 0 };
  demoDatabase.contacts.forEach(contact => {
    stats.total++;
    stats[contact.status] = (stats[contact.status] || 0) + 1;
  });
  return stats;
}

// ===============================
// E-MAIL FUNKTIONEN (VEREINFACHT FÜR ASTRO)
// ===============================

async function sendSimulatedEmail(to, subject, message) {
  // Für Astro-Environment - E-Mail-Simulation
  console.log(`📧 Email would be sent to: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 Message preview: ${message.substring(0, 100)}...`);
  
  return {
    success: true,
    simulation: true,
    messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}

// ===============================
// ASTRO API ENDPOINTS
// ===============================

export async function GET({ url }) {
  const searchParams = new URL(url).searchParams;
  const action = searchParams.get('action');

  try {
    // CORS Headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'list':
        const contacts = await getAllContacts();
        return new Response(JSON.stringify({ contacts }), { 
          status: 200, 
          headers 
        });
        
      case 'stats':
        const stats = await getContactStats();
        return new Response(JSON.stringify({ stats }), { 
          status: 200, 
          headers 
        });
        
      case 'debug':
        const debugInfo = {
          supabase: {
            url: supabaseUrl ? 'Connected' : 'Not configured',
            key: supabaseKey ? 'Present' : 'Missing',
            client: supabase ? 'Initialized' : 'Failed',
            tested: supabaseConnectionTested
          },
          environment: {
            supabaseUrl: supabaseUrl || 'undefined',
            hasKey: !!supabaseKey,
            keyLength: supabaseKey ? supabaseKey.length : 0
          },
          version: '18.1-astro',
          timestamp: new Date().toISOString(),
          runtime: 'Astro API Route'
        };
        
        return new Response(JSON.stringify(debugInfo), { 
          status: 200, 
          headers 
        });
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action parameter' }), { 
          status: 400, 
          headers 
        });
    }

  } catch (error) {
    console.error('API GET Error:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { name, email, message, phone, company } = body;

    // CORS Headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Validierung
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        error: 'Name, E-Mail und Nachricht sind Pflichtfelder' 
      }), { 
        status: 400, 
        headers 
      });
    }

    // E-Mail Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        error: 'Ungültiges E-Mail-Format' 
      }), { 
        status: 400, 
        headers 
      });
    }

    // Honeypot Spam-Schutz
    if (body.website) {
      return new Response(JSON.stringify({ 
        error: 'Spam erkannt' 
      }), { 
        status: 400, 
        headers 
      });
    }

    const contactData = { name, email, message, phone, company };
    
    try {
      // Kontakt in Datenbank speichern
      const newContact = await createContact(contactData);
      
      // E-Mail-Simulation (für Astro)
      const confirmationResult = await sendSimulatedEmail(
        email,
        'Bestätigung Ihrer Kontaktanfrage - Dominik Maier',
        message
      );
      
      const adminResult = await sendSimulatedEmail(
        'kontakt@dominik-maier.com',
        `🎯 Neue Kontaktanfrage von ${name}`,
        message
      );

      const emailsSent = confirmationResult.success && adminResult.success;
      const isSimulation = confirmationResult.simulation || adminResult.simulation;

      return new Response(JSON.stringify({
        success: true,
        message: 'Vielen Dank! Ihre Nachricht wurde gespeichert.',
        contact: newContact,
        emailStatus: {
          sent: emailsSent,
          simulation: isSimulation,
          confirmation: confirmationResult.success,
          admin: adminResult.success
        },
        database: supabase && await testSupabaseConnection() ? 'supabase' : 'demo'
      }), { 
        status: 200, 
        headers 
      });

    } catch (error) {
      console.error('Contact creation error:', error);
      return new Response(JSON.stringify({
        error: 'Fehler beim Speichern der Kontaktdaten',
        debug: error.message
      }), { 
        status: 500, 
        headers 
      });
    }

  } catch (error) {
    console.error('API POST Error:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT({ request, url }) {
  try {
    const searchParams = new URL(url).searchParams;
    const id = searchParams.get('id');
    const body = await request.json();

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (!id) {
      return new Response(JSON.stringify({ error: 'Contact ID required' }), { 
        status: 400, 
        headers 
      });
    }

    try {
      const updatedContact = await updateContact(id, body);
      
      if (!updatedContact) {
        return new Response(JSON.stringify({ error: 'Contact not found' }), { 
          status: 404, 
          headers 
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Kontakt erfolgreich aktualisiert',
        contact: updatedContact,
        database: supabase && await testSupabaseConnection() ? 'supabase' : 'demo'
      }), { 
        status: 200, 
        headers 
      });

    } catch (error) {
      console.error('Contact update error:', error);
      return new Response(JSON.stringify({
        error: 'Fehler beim Aktualisieren des Kontakts',
        debug: error.message
      }), { 
        status: 500, 
        headers 
      });
    }

  } catch (error) {
    console.error('API PUT Error:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}