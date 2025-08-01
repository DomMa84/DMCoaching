/**
 * Astro API Route: /api/contact
 * 
 * DATEI PFAD: src/pages/api/contact.js
 * 
 * Contact API v18.2.1 - Lead-Form Validation Fix
 * 
 * CHANGELOG v18.2.1:
 * - ✅ FIX: Lead-Form Validation korrigiert (message optional für leadForm)
 * - ✅ FIX: Normale Forms benötigen weiterhin name + email + message
 * - ✅ FIX: Lead-Forms benötigen nur name + email (message optional)
 * - ✅ KEEP: Komplette Enhanced Statistics Funktionalität

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
    console.log('✅ Supabase client initialized v18.2.1');
  } catch (error) {
    console.warn('❌ Supabase client initialization failed:', error.message);
  }
}

// ===============================
// DEMO DATABASE (FALLBACK) - Enhanced Statistics Support
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
      // ✅ NEW v18.2: Enhanced Statistics Demo Data
      source_page: "Strategische Unternehmensentwicklung",
      contact_hour: 10,
      contact_day_of_week: "Donnerstag",
      time_slot: "Vormittag (09-12)",
      contact_date: "2025-07-25",
      browser: "Chrome",
      device: "Desktop",
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
      // ✅ NEW v18.2: Enhanced Statistics Demo Data
      source_page: "Vertriebsoptimierung",
      contact_hour: 14,
      contact_day_of_week: "Mittwoch",
      time_slot: "Nachmittag (14-17)",
      contact_date: "2025-07-24",
      browser: "Safari",
      device: "Mobile",
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
      // ✅ NEW v18.2: Enhanced Statistics Demo Data
      source_page: "Homepage",
      contact_hour: 16,
      contact_day_of_week: "Samstag",
      time_slot: "Nachmittag (14-17)",
      contact_date: "2025-07-20",
      browser: "Chrome",
      device: "Desktop",
      created_at: "2025-07-20T16:45:00Z",
      updated_at: "2025-07-23T11:10:00Z"
    }
  ]
};

// ===============================
// DATABASE FUNKTIONEN (ENHANCED)
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
    
    console.log(`✅ Supabase connection successful v18.2.1. Found ${count} contacts.`);
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
      
      console.log(`✅ Loaded ${contacts.length} contacts from Supabase v18.2.1`);
      return contacts;
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database fallback v18.2.1');
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
          leadform: contactData.leadForm || false,
          // ✅ NEW v18.2: Enhanced Statistics Fields
          source_page: contactData.source_page || null,
          contact_hour: contactData.contact_hour || null,
          contact_day_of_week: contactData.contact_day_of_week || null,
          time_slot: contactData.time_slot || null,
          contact_date: contactData.contact_date || null,
          browser: contactData.browser || null,
          device: contactData.device || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      console.log(`✅ Contact created in Supabase v18.2 with ID: ${data.id} (source: ${contactData.source_page})`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase createContact failed:', error.message);
    }
  }
  
  console.log('📦 Creating contact in demo database v18.2');
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
      // Erlaubte Felder für Updates (Enhanced Statistics Fields hinzugefügt)
      const allowedFields = [
        'status', 'notes', 'leadform', 'name', 'email', 'phone', 'company', 'message',
        'source_page', 'contact_hour', 'contact_day_of_week', 'time_slot', 'contact_date', 'browser', 'device'
      ];
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
      
      console.log(`✅ Contact ${contactId} updated in Supabase v18.2.1`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase updateContact failed:', error.message);
    }
  }
  
  console.log(`📦 Updating contact ${contactId} in demo database v18.2.1`);
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

      console.log(`✅ Stats loaded from Supabase v18.2.1: ${stats.total} total contacts`);
      return stats;
    } catch (error) {
      console.warn('❌ Supabase getContactStats failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database stats v18.2.1');
  const stats = { total: 0, new: 0, contacted: 0, converted: 0, archived: 0 };
  demoDatabase.contacts.forEach(contact => {
    stats.total++;
    stats[contact.status] = (stats[contact.status] || 0) + 1;
  });
  return stats;
}

// ===============================
// ✅ NEW v18.2: ENHANCED STATISTICS FUNCTIONS
// ===============================

async function getEnhancedStats() {
  console.log('📊 Getting Enhanced Statistics v18.2.1');
  
  const contacts = await getAllContacts();
  const now = new Date();
  const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  // Zeitraum-Analyse
  const thisWeekContacts = contacts.filter(c => new Date(c.created_at) >= thisWeekStart);
  const thisMonthContacts = contacts.filter(c => new Date(c.created_at) >= thisMonthStart);
  const lastMonthContacts = contacts.filter(c => {
    const createdAt = new Date(c.created_at);
    return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
  });
  
  // Conversion Rate berechnen
  const totalContacts = contacts.length;
  const convertedContacts = contacts.filter(c => c.status === 'converted').length;
  const conversionRate = totalContacts > 0 ? Math.round((convertedContacts / totalContacts) * 100) : 0;
  
  // Lead vs Normal Contacts
  const leadContacts = contacts.filter(c => c.leadForm || c.leadform).length;
  const normalContacts = totalContacts - leadContacts;
  
  const enhancedStats = {
    timeframe: {
      thisWeek: thisWeekContacts.length,
      thisMonth: thisMonthContacts.length,
      lastMonth: lastMonthContacts.length,
      total: totalContacts
    },
    conversion: {
      rate: conversionRate,
      converted: convertedContacts,
      pending: contacts.filter(c => c.status === 'new' || c.status === 'contacted').length
    },
    types: {
      leads: leadContacts,
      normal: normalContacts,
      leadPercentage: totalContacts > 0 ? Math.round((leadContacts / totalContacts) * 100) : 0
    }
  };
  
  console.log('✅ Enhanced Stats calculated v18.2.1:', enhancedStats);
  return enhancedStats;
}

async function getServiceBreakdown() {
  console.log('📊 Getting Service Breakdown v18.2.1');
  
  const contacts = await getAllContacts();
  const serviceStats = {};
  
  contacts.forEach(contact => {
    const source = contact.source_page || 'Unbekannt';
    serviceStats[source] = (serviceStats[source] || 0) + 1;
  });
  
  // Nach Anzahl sortieren
  const sortedServices = Object.entries(serviceStats)
    .sort(([,a], [,b]) => b - a)
    .map(([service, count]) => ({
      service,
      count,
      percentage: contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0
    }));
  
  console.log('✅ Service Breakdown calculated v18.2.1:', sortedServices);
  return { services: sortedServices, total: contacts.length };
}

async function getTimeAnalysis() {
  console.log('📊 Getting Time Analysis v18.2.1');
  
  const contacts = await getAllContacts();
  
  // Stunden-Analyse
  const hourStats = {};
  const dayStats = {};
  const timeSlotStats = {};
  
  contacts.forEach(contact => {
    // Stunden
    const hour = contact.contact_hour;
    if (hour !== null && hour !== undefined) {
      hourStats[hour] = (hourStats[hour] || 0) + 1;
    }
    
    // Wochentage
    const day = contact.contact_day_of_week;
    if (day) {
      dayStats[day] = (dayStats[day] || 0) + 1;
    }
    
    // Zeitslots
    const timeSlot = contact.time_slot;
    if (timeSlot) {
      timeSlotStats[timeSlot] = (timeSlotStats[timeSlot] || 0) + 1;
    }
  });
  
  // Top 3 Stunden ermitteln
  const topHours = Object.entries(hourStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      timeDisplay: `${hour}:00-${parseInt(hour) + 1}:00`,
      count,
      percentage: contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0
    }));
  
  // Top Wochentag
  const topDay = Object.entries(dayStats)
    .sort(([,a], [,b]) => b - a)[0];
  
  // Top Zeitslot
  const topTimeSlot = Object.entries(timeSlotStats)
    .sort(([,a], [,b]) => b - a)[0];
  
  const timeAnalysis = {
    peak: {
      hours: topHours,
      day: topDay ? { day: topDay[0], count: topDay[1] } : null,
      timeSlot: topTimeSlot ? { slot: topTimeSlot[0], count: topTimeSlot[1] } : null
    },
    distribution: {
      hours: hourStats,
      days: dayStats,
      timeSlots: timeSlotStats
    }
  };
  
  console.log('✅ Time Analysis calculated v18.2.1:', timeAnalysis);
  return timeAnalysis;
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
// ASTRO API ENDPOINTS (ENHANCED v18.2)
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
      
      // ✅ NEW v18.2: Enhanced Statistics Endpoints
      case 'enhanced-stats':
        const enhancedStats = await getEnhancedStats();
        return new Response(JSON.stringify({ enhancedStats }), { 
          status: 200, 
          headers 
        });
        
      case 'service-breakdown':
        const serviceBreakdown = await getServiceBreakdown();
        return new Response(JSON.stringify({ serviceBreakdown }), { 
          status: 200, 
          headers 
        });
        
      case 'time-analysis':
        const timeAnalysis = await getTimeAnalysis();
        return new Response(JSON.stringify({ timeAnalysis }), { 
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
          version: '18.2.1-enhanced-statistics-leadform-fix',
          timestamp: new Date().toISOString(),
          runtime: 'Astro API Route',
          features: ['Enhanced Statistics', 'Service Breakdown', 'Time Analysis', 'Lead-Form Validation']
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
    console.error('API GET Error v18.2.1:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message,
      version: '18.2.1'
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { 
      name, email, message, phone, company,
      // ✅ NEW v18.2: Enhanced Statistics Fields
      source_page, contact_hour, contact_day_of_week, time_slot, 
      contact_date, browser, device
    } = body;

    // CORS Headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // ✅ NEW v18.2.1: Lead-Form Validation Fix
    // Lead-Forms benötigen nur name + email (message optional)
    // Normale Forms benötigen name + email + message
    const isLeadForm = !!body.leadForm;
    
    if (!name || !email) {
      return new Response(JSON.stringify({ 
        error: 'Name und E-Mail sind Pflichtfelder' 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    if (!isLeadForm && !message) {
      return new Response(JSON.stringify({ 
        error: 'Nachricht ist für normale Kontaktformulare erforderlich' 
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

    // ✅ NEW v18.2.1: Enhanced Statistics Data zusammenfassen
    const contactData = { 
      name, email, message: message || '', phone, company,
      leadForm: isLeadForm,
      source_page, contact_hour, contact_day_of_week, 
      time_slot, contact_date, browser, device
    };
    
    console.log('📊 Creating contact with Enhanced Statistics v18.2.1:', {
      name, 
      source_page, 
      contact_hour, 
      time_slot,
      isLeadForm
    });
    
    try {
      // Kontakt in Datenbank speichern
      const newContact = await createContact(contactData);
      
      // E-Mail-Simulation (für Astro)
      const confirmationResult = await sendSimulatedEmail(
        email,
        'Bestätigung Ihrer Kontaktanfrage - Dominik Maier',
        message || `Kontaktanfrage${isLeadForm ? ' (Lead-Form)' : ''} von ${name}`
      );
      
      const adminResult = await sendSimulatedEmail(
        'kontakt@dominik-maier.com',
        `🎯 Neue ${isLeadForm ? 'Lead-' : ''}Kontaktanfrage von ${name} (${source_page || 'Unbekannte Seite'})`,
        message || `${isLeadForm ? 'Lead-Form' : 'Kontakt'} Anfrage ohne Nachricht`
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
        database: supabase && await testSupabaseConnection() ? 'supabase' : 'demo',
        // ✅ NEW v18.2.1: Enhanced Statistics bestätigen
        statistics: {
          source_page: source_page || 'Unbekannt',
          time_slot: time_slot || 'Unbekannt',
          tracked: !!(source_page && contact_hour && contact_day_of_week),
          leadForm: isLeadForm
        }
      }), { 
        status: 200, 
        headers 
      });

    } catch (error) {
      console.error('Contact creation error v18.2.1:', error);
      return new Response(JSON.stringify({
        error: 'Fehler beim Speichern der Kontaktdaten',
        debug: error.message,
        version: '18.2.1'
      }), { 
        status: 500, 
        headers 
      });
    }

  } catch (error) {
    console.error('API POST Error v18.2.1:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message,
      version: '18.2.1'
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
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
        database: supabase && await testSupabaseConnection() ? 'supabase' : 'demo',
        version: '18.2.1'
      }), { 
        status: 200, 
        headers 
      });

    } catch (error) {
      console.error('Contact update error v18.2.1:', error);
      return new Response(JSON.stringify({
        error: 'Fehler beim Aktualisieren des Kontakts',
        debug: error.message,
        version: '18.2.1'
      }), { 
        status: 500, 
        headers 
      });
    }

  } catch (error) {
    console.error('API PUT Error v18.2.1:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message,
      version: '18.2.1.1'
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
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