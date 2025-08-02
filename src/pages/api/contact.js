/**
 * Astro API Route: /api/contact
 * 
 * DATEI PFAD: src/pages/api/contact.js
 * 
 * Contact API v18.3.0 - E-Mail Integration Strato SMTP
 * 
 * CHANGELOG v18.3.0:
 * - ✅ NEW: Strato SMTP E-Mail Integration
 * - ✅ NEW: Corporate Design E-Mail Templates
 * - ✅ NEW: Lead-Form vs Normal-Form E-Mail Templates
 * - ✅ KEEP: Enhanced Statistics Funktionalität vollständig
 * - ✅ KEEP: Telefon-Pflichtfeld Validation
 */

import { createClient } from '@supabase/supabase-js';

// ===============================
// E-MAIL INTEGRATION (STRATO SMTP)
// ===============================

let nodemailer = null;
let emailTransporter = null;

// Dynamischer Import für Nodemailer (falls verfügbar)
try {
  nodemailer = await import('nodemailer');
  console.log('✅ Nodemailer loaded for email functionality');
  
  // Strato SMTP Transporter konfigurieren
  if (import.meta.env.SMTP_HOST && import.meta.env.SMTP_USER && import.meta.env.SMTP_PASS) {
    emailTransporter = nodemailer.default.createTransporter({
      host: import.meta.env.SMTP_HOST, // smtp.strato.de
      port: parseInt(import.meta.env.EMAIL_PORT) || 587,
      secure: import.meta.env.EMAIL_SECURE === 'true' || false, // true für 465, false für 587
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });
    console.log('✅ Strato SMTP transporter configured v18.3.0');
  } else {
    console.warn('⚠️ SMTP Environment variables not configured - using simulation');
  }
} catch (error) {
  console.warn('⚠️ Nodemailer not available, using email simulation:', error.message);
}

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
    console.log('✅ Supabase client initialized v18.3.0');
  } catch (error) {
    console.warn('❌ Supabase client initialization failed:', error.message);
  }
}

// ===============================
// E-MAIL TEMPLATES (CORPORATE DESIGN)
// ===============================

function getEmailTemplate(type, data) {
  const baseStyle = `
    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #D2AE6C 0%, #B8954A 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          Dominik Maier
        </h1>
        <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">
          Coaching & Interim Management
        </p>
      </div>
      <div style="padding: 40px 30px; background: #ffffff;">
  `;
  
  const baseFooter = `
      </div>
      <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 14px;">
          <strong>Dominik Maier</strong><br>
          Coaching & Interim Management<br>
          Gaisbachweg 4, 77776 Bad Rippoldsau
        </p>
        <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 14px;">
          📞 +49 7440 913367 | 📧 webmaster@maier-value.com<br>
          🌐 <a href="https://dominik-maier.com" style="color: #D2AE6C; text-decoration: none;">dominik-maier.com</a>
        </p>
        <p style="color: #868e96; margin: 0; font-size: 12px;">
          Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese Nachricht.
        </p>
      </div>
    </div>
  `;

  switch (type) {
    case 'confirmation_normal':
      return baseStyle + `
        <h2 style="color: #343a40; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">
          Vielen Dank für Ihre Kontaktanfrage!
        </h2>
        <p style="color: #495057; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
          Liebe/r ${data.name},
        </p>
        <p style="color: #495057; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
          herzlichen Dank für Ihr Interesse an meinen Leistungen im Bereich Coaching und Interim Management. 
          Ihre Nachricht ist bei mir eingegangen und ich werde mich in Kürze bei Ihnen melden.
        </p>
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #D2AE6C;">
          <h3 style="color: #343a40; margin: 0 0 15px 0; font-size: 18px;">Ihre Anfrage im Überblick:</h3>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>E-Mail:</strong> ${data.email}</p>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Telefon:</strong> ${data.phone}</p>
          ${data.company ? `<p style="color: #495057; margin: 0 0 10px 0;"><strong>Unternehmen:</strong> ${data.company}</p>` : ''}
          ${data.message ? `<p style="color: #495057; margin: 0 0 10px 0;"><strong>Nachricht:</strong> ${data.message}</p>` : ''}
        </div>
        <p style="color: #495057; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
          Ich melde mich zeitnah bei Ihnen zurück, um Ihr Anliegen zu besprechen und gemeinsam 
          die optimale Lösung für Ihre Herausforderungen zu finden.
        </p>
        <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 16px;">
          Mit freundlichen Grüßen<br>
          <strong style="color: #D2AE6C;">Dominik Maier</strong>
        </p>
      ` + baseFooter;

    case 'confirmation_lead':
      return baseStyle + `
        <h2 style="color: #343a40; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">
          Vielen Dank für Ihr Interesse!
        </h2>
        <p style="color: #495057; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
          Liebe/r ${data.name},
        </p>
        <p style="color: #495057; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
          herzlichen Dank für Ihr Interesse an meinen Leistungen. Ich freue mich über Ihre Kontaktaufnahme 
          und werde mich in den nächsten Tagen bei Ihnen melden.
        </p>
        <div style="background: linear-gradient(135deg, #D2AE6C15 0%, #D2AE6C25 100%); padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #343a40; margin: 0 0 15px 0; font-size: 18px;">Ihre Kontaktdaten:</h3>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>E-Mail:</strong> ${data.email}</p>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Telefon:</strong> ${data.phone}</p>
          ${data.company ? `<p style="color: #495057; margin: 0;"><strong>Unternehmen:</strong> ${data.company}</p>` : ''}
        </div>
        <p style="color: #495057; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
          In der Zwischenzeit können Sie gerne meine aktuellen Insights zu KI im Vertrieb und 
          modernen Business Development Strategien in meinem 
          <a href="https://dominik-maier.com/blog" style="color: #D2AE6C; text-decoration: none;">Blog</a> lesen.
        </p>
        <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 16px;">
          Mit freundlichen Grüßen<br>
          <strong style="color: #D2AE6C;">Dominik Maier</strong>
        </p>
      ` + baseFooter;

    case 'admin_notification':
      return baseStyle + `
        <h2 style="color: #343a40; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">
          🎯 Neue ${data.isLeadForm ? 'Lead-' : ''}Kontaktanfrage
        </h2>
        <div style="background: #e8f4f8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #D2AE6C;">
          <h3 style="color: #343a40; margin: 0 0 15px 0; font-size: 18px;">Kontaktdaten:</h3>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>E-Mail:</strong> ${data.email}</p>
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Telefon:</strong> ${data.phone}</p>
          ${data.company ? `<p style="color: #495057; margin: 0 0 10px 0;"><strong>Unternehmen:</strong> ${data.company}</p>` : ''}
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Formular-Typ:</strong> ${data.isLeadForm ? 'Lead-Form (Schnellanfrage)' : 'Vollständiges Kontaktformular'}</p>
        </div>
        ${data.message ? `
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #343a40; margin: 0 0 15px 0; font-size: 18px;">Nachricht:</h3>
          <p style="color: #495057; margin: 0; line-height: 1.6; font-style: italic;">"${data.message}"</p>
        </div>
        ` : ''}
        ${data.source_page ? `
        <div style="background: #D2AE6C15; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #343a40; margin: 0 0 15px 0; font-size: 16px;">📊 Enhanced Statistics:</h3>
          <p style="color: #495057; margin: 0 0 8px 0; font-size: 14px;"><strong>Quelle:</strong> ${data.source_page}</p>
          ${data.time_slot ? `<p style="color: #495057; margin: 0 0 8px 0; font-size: 14px;"><strong>Zeitslot:</strong> ${data.time_slot}</p>` : ''}
          ${data.device ? `<p style="color: #495057; margin: 0 0 8px 0; font-size: 14px;"><strong>Gerät:</strong> ${data.device}</p>` : ''}
          ${data.browser ? `<p style="color: #495057; margin: 0; font-size: 14px;"><strong>Browser:</strong> ${data.browser}</p>` : ''}
        </div>
        ` : ''}
        <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 16px;">
          Diese Anfrage wurde automatisch über die Homepage erfasst und ist im Admin Dashboard verfügbar.
        </p>
      ` + baseFooter;

    default:
      return baseStyle + `<p>Unbekannter E-Mail-Typ</p>` + baseFooter;
  }
}

// ===============================
// E-MAIL FUNKTIONEN (STRATO SMTP)
// ===============================

async function sendEmail(to, subject, htmlContent) {
  // Wenn E-Mail-System nicht verfügbar, Simulation verwenden
  if (!emailTransporter || !nodemailer) {
    console.log(`📧 Email simulation - To: ${to}, Subject: ${subject}`);
    return {
      success: true,
      simulation: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  try {
    // Strato SMTP E-Mail versenden
    const mailOptions = {
      from: {
        name: 'Dominik Maier - Coaching & Interim Management',
        address: import.meta.env.EMAIL_FROM || import.meta.env.SMTP_USER
      },
      to: to,
      subject: subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, ''), // HTML zu Text konvertieren
      headers: {
        'X-Mailer': 'Dominik Maier Homepage v18.3.0',
        'X-Priority': '3'
      }
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully via Strato SMTP: ${info.messageId}`);
    return {
      success: true,
      simulation: false,
      messageId: info.messageId,
      provider: 'strato'
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    // Fallback zu Simulation bei Fehlern
    console.log(`📧 Fallback to email simulation - To: ${to}`);
    return {
      success: false,
      simulation: true,
      error: error.message,
      messageId: `fallback_${Date.now()}`
    };
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
      // ✅ Enhanced Statistics Demo Data
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
      // ✅ Enhanced Statistics Demo Data
      source_page: "Vertriebsoptimierung",
      contact_hour: 14,
      contact_day_of_week: "Mittwoch",
      time_slot: "Nachmittag (14-17)",
      contact_date: "2025-07-24",
      browser: "Safari",
      device: "Mobile",
      created_at: "2025-07-24T14:15:00Z",
      updated_at: "2025-07-26T09:20:00Z"
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
    
    console.log(`✅ Supabase connection successful v18.3.0. Found ${count} contacts.`);
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
      
      console.log(`✅ Loaded ${contacts.length} contacts from Supabase v18.3.0`);
      return contacts;
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database fallback v18.3.0');
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
          // ✅ Enhanced Statistics Fields
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
      
      console.log(`✅ Contact created in Supabase v18.3.0 with ID: ${data.id} (source: ${contactData.source_page})`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase createContact failed:', error.message);
    }
  }
  
  console.log('📦 Creating contact in demo database v18.3.0');
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
      
      console.log(`✅ Contact ${contactId} updated in Supabase v18.3.0`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase updateContact failed:', error.message);
    }
  }
  
  console.log(`📦 Updating contact ${contactId} in demo database v18.3.0`);
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

      console.log(`✅ Stats loaded from Supabase v18.3.0: ${stats.total} total contacts`);
      return stats;
    } catch (error) {
      console.warn('❌ Supabase getContactStats failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database stats v18.3.0');
  const stats = { total: 0, new: 0, contacted: 0, converted: 0, archived: 0 };
  demoDatabase.contacts.forEach(contact => {
    stats.total++;
    stats[contact.status] = (stats[contact.status] || 0) + 1;
  });
  return stats;
}

// ===============================
// ✅ ENHANCED STATISTICS FUNCTIONS (UNVERÄNDERT)
// ===============================

async function getEnhancedStats() {
  console.log('📊 Getting Enhanced Statistics v18.3.0');
  
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
  
  console.log('✅ Enhanced Stats calculated v18.3.0:', enhancedStats);
  return enhancedStats;
}

async function getServiceBreakdown() {
  console.log('📊 Getting Service Breakdown v18.3.0');
  
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
  
  console.log('✅ Service Breakdown calculated v18.3.0:', sortedServices);
  return { services: sortedServices, total: contacts.length };
}

async function getTimeAnalysis() {
  console.log('📊 Getting Time Analysis v18.3.0');
  
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
  
  console.log('✅ Time Analysis calculated v18.3.0:', timeAnalysis);
  return timeAnalysis;
}

// ===============================
// ASTRO API ENDPOINTS (ENHANCED v18.3)
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
      
      // ✅ Enhanced Statistics Endpoints
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
          email: {
            transporter: emailTransporter ? 'Configured' : 'Not configured',
            nodemailer: nodemailer ? 'Available' : 'Not available',
            smtp_host: import.meta.env.SMTP_HOST || 'Not set',
            smtp_user: import.meta.env.SMTP_USER ? 'Present' : 'Not set'
          },
          environment: {
            supabaseUrl: supabaseUrl || 'undefined',
            hasKey: !!supabaseKey,
            keyLength: supabaseKey ? supabaseKey.length : 0
          },
          version: '18.3.0-email-integration',
          timestamp: new Date().toISOString(),
          runtime: 'Astro API Route',
          features: ['Enhanced Statistics', 'Strato SMTP Email', 'Corporate Templates', 'Lead-Form Support']
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
    console.error('API GET Error v18.3.0:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message,
      version: '18.3.0'
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
      // ✅ Enhanced Statistics Fields
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

    // ✅ NEW v18.3.0: Name + E-Mail + Telefon Pflichtfelder für alle Formulare
    const isLeadForm = !!body.leadForm;
    
    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ 
        error: 'Name, E-Mail und Telefonnummer sind Pflichtfelder' 
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

    // ✅ Enhanced Statistics Data zusammenfassen
    const contactData = { 
      name, email, message: message || '', phone, company,
      leadForm: isLeadForm,
      source_page, contact_hour, contact_day_of_week, 
      time_slot, contact_date, browser, device
    };
    
    console.log('📊 Creating contact with Enhanced Statistics v18.3.0:', {
      name, 
      source_page, 
      contact_hour, 
      time_slot,
      isLeadForm
    });
    
    try {
      // Kontakt in Datenbank speichern
      const newContact = await createContact(contactData);
      
      // ✅ NEW v18.3.0: E-Mail Templates versenden
      const emailData = {
        name,
        email,
        phone,
        company,
        message,
        isLeadForm,
        source_page,
        time_slot,
        device,
        browser
      };

      // Bestätigungs-E-Mail an Kunden
      const confirmationTemplate = isLeadForm ? 'confirmation_lead' : 'confirmation_normal';
      const confirmationHtml = getEmailTemplate(confirmationTemplate, emailData);
      const confirmationSubject = isLeadForm 
        ? 'Vielen Dank für Ihr Interesse - Dominik Maier'
        : 'Bestätigung Ihrer Kontaktanfrage - Dominik Maier';
      
      const confirmationResult = await sendEmail(
        email,
        confirmationSubject,
        confirmationHtml
      );
      
      // Admin-Benachrichtigung
      const adminHtml = getEmailTemplate('admin_notification', emailData);
      const adminSubject = `🎯 Neue ${isLeadForm ? 'Lead-' : ''}Kontaktanfrage von ${name} (${source_page || 'Unbekannte Seite'})`;
      
      const adminResult = await sendEmail(
        import.meta.env.EMAIL_TO || 'kontakt@dominik-maier.com',
        adminSubject,
        adminHtml
      );

      const emailsSent = confirmationResult.success && adminResult.success;
      const isSimulation = confirmationResult.simulation || adminResult.simulation;

      return new Response(JSON.stringify({
        success: true,
        message: 'Vielen Dank! Ihre Nachricht wurde gespeichert und eine Bestätigung versendet.',
        contact: newContact,
        emailStatus: {
          sent: emailsSent,
          simulation: isSimulation,
          confirmation: {
            success: confirmationResult.success,
            messageId: confirmationResult.messageId,
            provider: confirmationResult.provider || 'simulation'
          },
          admin: {
            success: adminResult.success,
            messageId: adminResult.messageId,
            provider: adminResult.provider || 'simulation'
          }
        },
        database: supabase && await testSupabaseConnection() ? 'supabase' : 'demo',
        // ✅ Enhanced Statistics bestätigen
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
      console.error('Contact creation error v18.3.0:', error);
      return new Response(JSON.stringify({
        error: 'Fehler beim Speichern der Kontaktdaten',
        debug: error.message,
        version: '18.3.0'
      }), { 
        status: 500, 
        headers 
      });
    }

  } catch (error) {
    console.error('API POST Error v18.3.0:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message,
      version: '18.3.0'
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
        database: supabase && await testSupabaseConnection() ? 'supabase' : 'demo',
        version: '18.3.0'
      }), { 
        status: 200, 
        headers 
      });

    } catch (error) {
      console.error('Contact update error v18.3.0:', error);
      return new Response(JSON.stringify({
        error: 'Fehler beim Aktualisieren des Kontakts',
        debug: error.message,
        version: '18.3.0'
      }), { 
        status: 500, 
        headers 
      });
    }

  } catch (error) {
    console.error('API PUT Error v18.3.0:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message,
      version: '18.3.0'
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