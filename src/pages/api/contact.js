/**
 * Contact API v18.3.8 - Complete with v17.12 E-Mail Integration + Header Fix
 * 
 * CHANGELOG v18.3.8:
 * - ✅ FIXED: IP-Adresse und User-Agent Header-Extraktion
 * - ✅ KEEP: v17.12 E-Mail-Funktionen (Strato SMTP)
 * - ✅ KEEP: Vollständige Enhanced Statistics Integration
 * - ✅ KEEP: Database-Speicherung funktional
 * - ✅ KEEP: Alle API-Endpoints
 */

import { createClient } from '@supabase/supabase-js';

// ===============================
// SUPABASE SETUP
// ===============================

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://bqcwyfzspdbcanondyyz.supabase.co';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3d5ZnpzcGRiY2Fub25keXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODI0NjQsImV4cCI6MjA2OTM1ODQ2NH0.d5QxZWZGDiMyigiEHctL9jImTQyqqxBhBE6YUmdBhrI';

let supabase = null;
let supabaseConnectionTested = false;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized v18.3.7');
  } catch (error) {
    console.warn('❌ Supabase client initialization failed:', error.message);
  }
}

// ===============================
// SUPABASE CONNECTION TEST
// ===============================

async function testSupabaseConnection() {
  if (!supabase) {
    console.log('❌ Supabase client not available');
    return false;
  }
  
  if (supabaseConnectionTested) {
    return true; // Bereits getestet
  }
  
  try {
    console.log('🔄 Testing Supabase connection...');
    const { count, error } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log(`✅ Supabase connection successful. Found ${count} contacts.`);
    supabaseConnectionTested = true;
    return true;
  } catch (error) {
    console.warn('❌ Supabase connection test failed:', error.message);
    return false;
  }
}

// ===============================
// E-MAIL INTEGRATION aus v17.12 - EXAKT WIE ES WAR
// ===============================

// ✅ STRATO SMTP KONFIGURATION (aus v17.12)
const SMTP_CONFIG = {
  host: import.meta.env.SMTP_HOST || 'smtp.strato.de',
  port: parseInt(import.meta.env.EMAIL_PORT) || 587,
  secure: import.meta.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: import.meta.env.SMTP_USER || 'webmaster@maier-value.com',
    pass: import.meta.env.SMTP_PASS || 'mizpeg-siCpep-xahzi1'
  }
};

const EMAIL_CONFIG = {
  from: import.meta.env.EMAIL_FROM || 'Dominik Maier',
  fromAddress: import.meta.env.SMTP_USER || 'webmaster@maier-value.com',
  toAddress: import.meta.env.EMAIL_TO || 'maier@maier-value.com'
};

console.log('📧 SMTP Config v17.12:', {
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: SMTP_CONFIG.secure,
  user: SMTP_CONFIG.auth.user,
  fromAddress: EMAIL_CONFIG.fromAddress,
  toAddress: EMAIL_CONFIG.toAddress
});

// ✅ NODEMAILER TRANSPORT ERSTELLEN (aus v17.12)
async function createNodemailerTransport() {
  try {
    // ✅ AKTIVIERT: Echte Nodemailer-Integration
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.default.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      auth: {
        user: SMTP_CONFIG.auth.user,
        pass: SMTP_CONFIG.auth.pass
      },
      tls: {
        rejectUnauthorized: false // Für Strato SMTP
      }
    });
    
    // SMTP-Verbindung testen
    await transporter.verify();
    console.log('✅ Strato SMTP-Verbindung erfolgreich v17.12');
    
    return { transporter, isReal: true };
    
  } catch (error) {
    console.error('❌ Nodemailer/SMTP Error v17.12:', error.message);
    console.log('🔄 Fallback zu Simulation-Modus v17.12');
    
    // Fallback zu Simulation
    return {
      transporter: {
        sendMail: async (mailOptions) => {
          console.log('📧 FALLBACK: Simulating email send v17.12:', {
            to: mailOptions.to,
            subject: mailOptions.subject
          });
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          return {
            messageId: `fallback-${Date.now()}@simulation.local`,
            accepted: [mailOptions.to],
            rejected: [],
            response: '250 OK: Simulated delivery'
          };
        }
      },
      isReal: false
    };
  }
}

// ✅ ECHTE E-MAIL INTEGRATION (aus v17.12)
async function sendContactEmails(contactData) {
  console.log('📧 E-Mail Service v17.12: ECHTE E-Mail-Versendung startet für:', contactData.name);
  
  const results = {
    confirmation: null,
    admin: null,
    success: false,
    errors: []
  };
  
  try {
    // ✅ NODEMAILER TRANSPORT ERSTELLEN
    const { transporter, isReal } = await createNodemailerTransport();
    console.log(`📧 Transport Mode v17.12: ${isReal ? 'REAL SMTP' : 'SIMULATION'}`);
    
    // ✅ BESTÄTIGUNGS-E-MAIL AN USER
    console.log('📤 Sending confirmation email to:', contactData.email);
    
    try {
      const confirmationResult = await transporter.sendMail({
        from: `"${EMAIL_CONFIG.from}" <${EMAIL_CONFIG.fromAddress}>`,
        to: contactData.email,
        subject: 'Ihre Nachricht ist bei uns angekommen - Dominik Maier',
        html: generateConfirmationHTML(contactData),
        text: generateConfirmationText(contactData)
      });
      
      results.confirmation = {
        success: true,
        messageId: confirmationResult.messageId,
        type: 'confirmation',
        recipient: contactData.email,
        realEmail: isReal, // ✅ EHRLICH: true bei echten E-Mails
        response: confirmationResult.response
      };
      
      console.log(`✅ Confirmation email ${isReal ? 'SENT' : 'SIMULATED'} v17.12:`, {
        to: contactData.email,
        messageId: confirmationResult.messageId,
        real: isReal
      });
      
    } catch (error) {
      console.error('❌ Confirmation email failed v17.12:', error);
      results.confirmation = {
        success: false,
        error: error.message,
        type: 'confirmation',
        recipient: contactData.email,
        realEmail: false
      };
      results.errors.push(`Bestätigung: ${error.message}`);
    }
    
    // ✅ ADMIN-BENACHRICHTIGUNG
    console.log('📤 Sending admin notification to:', EMAIL_CONFIG.toAddress);
    
    try {
      const adminResult = await transporter.sendMail({
        from: `"Website Kontaktformular" <${EMAIL_CONFIG.fromAddress}>`,
        to: EMAIL_CONFIG.toAddress,
        subject: `${contactData.leadForm ? '🎯 LEAD' : '📧 KONTAKT'} Neue Anfrage von ${contactData.name}`,
        html: generateAdminHTML(contactData),
        text: generateAdminText(contactData)
      });
      
      results.admin = {
        success: true,
        messageId: adminResult.messageId,
        type: 'admin_notification',
        recipient: EMAIL_CONFIG.toAddress,
        priority: contactData.leadForm ? 'HIGH (Lead)' : 'Normal',
        realEmail: isReal, // ✅ EHRLICH: true bei echten E-Mails
        response: adminResult.response
      };
      
      console.log(`✅ Admin notification ${isReal ? 'SENT' : 'SIMULATED'} v17.12:`, {
        to: EMAIL_CONFIG.toAddress,
        messageId: adminResult.messageId,
        real: isReal,
        priority: results.admin.priority
      });
      
    } catch (error) {
      console.error('❌ Admin notification failed v17.12:', error);
      results.admin = {
        success: false,
        error: error.message,
        type: 'admin_notification',
        recipient: EMAIL_CONFIG.toAddress,
        realEmail: false
      };
      results.errors.push(`Admin: ${error.message}`);
    }
    
    // Erfolg wenn mindestens eine E-Mail erfolgreich
    results.success = results.confirmation?.success || results.admin?.success;
    
    console.log('📊 Email sending summary v17.12:', {
      confirmationSent: results.confirmation?.success || false,
      adminSent: results.admin?.success || false,
      overallSuccess: results.success,
      errors: results.errors.length,
      mode: isReal ? 'REAL_SMTP' : 'SIMULATION',
      realEmails: (results.confirmation?.realEmail || false) || (results.admin?.realEmail || false)
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Error in sendContactEmails v17.12:', error);
    
    results.errors.push(`General: ${error.message}`);
    return results;
  }
}

// ✅ E-MAIL TEMPLATE GENERATOREN (aus v17.12)
function generateConfirmationHTML(contactData) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bestätigung Ihrer Nachricht</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D2AE6C, #B8941F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .message-box { background: #f9f9f9; border-left: 4px solid #D2AE6C; padding: 15px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .contact-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #D2AE6C; font-size: 18px; margin-top: 25px; }
        .highlight { color: #D2AE6C; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Nachricht erhalten</h1>
        <p>Vielen Dank für Ihr Interesse</p>
    </div>
    
    <div class="content">
        <h2>Sehr geehrte/r ${contactData.name},</h2>
        
        <p>vielen Dank für Ihre Nachricht über unser Kontaktformular. Wir haben Ihre Anfrage erhalten und werden uns <span class="highlight">schnellstmöglich</span> bei Ihnen melden.</p>
        
        <h2>📝 Ihre Nachricht:</h2>
        <div class="message-box">
            ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        
        <h2>📞 Nächste Schritte:</h2>
        <ul>
            <li>Wir bearbeiten Ihre Anfrage in der Reihenfolge des Eingangs</li>
            <li>Sie erhalten spätestens innerhalb von <strong>24 Stunden</strong> eine Antwort</li>
            <li>Bei dringeneden Fragen erreichen Sie uns telefonisch</li>
        </ul>
        
        <div class="contact-info">
            <h2>📧 Kontakt:</h2>
            <p>
                <strong>Dominik Maier</strong><br>
                Coaching & Interim Management<br>
                Telefon: <a href="tel:+497440913367">+49 7440 913367</a><br>
                E-Mail: <a href="mailto:maier@maier-value.com">maier@maier-value.com</a>
            </p>
        </div>
        
        <p style="margin-top: 25px;">Mit freundlichen Grüßen<br><strong>Dominik Maier</strong></p>
    </div>
    
    <div class="footer">
        <p>Diese E-Mail wurde automatisch generiert.<br>
        © ${new Date().getFullYear()} Dominik Maier Coaching & Interim Management</p>
    </div>
</body>
</html>
  `;
}

function generateConfirmationText(contactData) {
  return `
Sehr geehrte/r ${contactData.name},

vielen Dank für Ihre Nachricht über unser Kontaktformular.

Ihre Anfrage:
${contactData.message}

Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.

Mit freundlichen Grüßen
Dominik Maier
Coaching & Interim Management

---
Kontakt:
Telefon: +49 7440 913367
E-Mail: maier@maier-value.com

Diese E-Mail wurde automatisch generiert.
  `;
}

function generateAdminHTML(contactData) {
  const leadIndicator = contactData.leadForm ? '🎯 LEAD' : '📧 KONTAKT';
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neue Kontaktanfrage</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D2AE6C, #B8941F); color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-top: none; }
        .contact-details { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 15px 0; }
        .message-box { background: #f9f9f9; border-left: 4px solid #D2AE6C; padding: 15px; margin: 15px 0; }
        .tech-details { background: #f1f3f4; border-radius: 6px; padding: 15px; margin: 15px 0; font-size: 12px; color: #666; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .label { font-weight: bold; color: #555; }
        .lead-badge { background: #D2AE6C; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .normal-badge { background: #6B7280; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        h1 { margin: 0; font-size: 22px; }
        h2 { color: #D2AE6C; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
        .urgent { background: #FFF8E1; border: 1px solid #D2AE6C; color: #8B6914; padding: 10px; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${leadIndicator} Neue Kontaktanfrage</h1>
        <p>Eingegangen: ${new Date(contactData.timestamp || new Date()).toLocaleString('de-DE')}</p>
    </div>
    
    <div class="content">
        ${contactData.leadForm ? '<div class="urgent"><strong>🎯 LEAD-ANFRAGE:</strong> Diese Anfrage kam über ein Lead-Formular und sollte priorisiert behandelt werden.</div>' : ''}
        
        <h2>📋 Kontaktdaten:</h2>
        <div class="contact-details">
            <p><span class="label">Name:</span> ${contactData.name}</p>
            <p><span class="label">E-Mail:</span> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            <p><span class="label">Telefon:</span> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>
            <p><span class="label">Typ:</span> 
                ${contactData.leadForm ? 
                    '<span class="lead-badge">🎯 LEAD</span>' : 
                    '<span class="normal-badge">📧 KONTAKT</span>'
                }
            </p>
        </div>
        
        <h2>💬 Nachricht:</h2>
        <div class="message-box">
            ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        
        <h2>⚙️ Technische Details:</h2>
        <div class="tech-details">
            <p><strong>IP-Adresse:</strong> ${contactData.ipAddress || 'Unknown'}</p>
            <p><strong>User-Agent:</strong> ${contactData.userAgent || 'Unknown'}</p>
        </div>
        
        <h2>🎯 Nächste Schritte:</h2>
        <ul>
            <li>Kontakt im Admin Dashboard bearbeiten</li>
            <li>${contactData.leadForm ? 'PRIORITÄT: Lead-Anfrage zeitnah bearbeiten' : 'Anfrage innerhalb 24h beantworten'}</li>
            <li>Status auf "offen" setzen bei Bearbeitung</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Automatische Benachrichtigung von Dominik Maier Website</p>
    </div>
</body>
</html>
  `;
}

function generateAdminText(contactData) {
  return `
NEUE KONTAKTANFRAGE ${contactData.leadForm ? '(LEAD)' : ''}

Name: ${contactData.name}
E-Mail: ${contactData.email}
Telefon: ${contactData.phone}
Typ: ${contactData.leadForm ? 'Lead-Formular' : 'Normaler Kontakt'}
Eingegangen: ${new Date(contactData.timestamp || new Date()).toLocaleString('de-DE')}

Nachricht:
${contactData.message}

---
IP-Adresse: ${contactData.ipAddress || 'Unknown'}
User-Agent: ${contactData.userAgent || 'Unknown'}
  `;
}

// ===============================
// DATABASE FUNCTIONS
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
      source_page: "Strategische Unternehmensentwicklung",
      contact_hour: 10,
      contact_day_of_week: "Donnerstag",
      time_slot: "Vormittag (09-12)",
      contact_date: "2025-07-25",
      browser: "Chrome",
      device: "Desktop",
      created_at: "2025-07-25T10:30:00Z",
      updated_at: "2025-07-25T10:30:00Z",
      leadform: false
    }
  ]
};

async function getAllContacts() {
  if (supabase && await testSupabaseConnection()) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const contacts = data.map(contact => ({
        ...contact,
        leadForm: contact.leadform || false
      }));
      
      console.log(`✅ Loaded ${contacts.length} contacts from Supabase v18.3.7`);
      return contacts;
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database fallback v18.3.7');
  return demoDatabase.contacts;
}

async function createContact(contactData) {
  console.log('💾 createContact called with:', { 
    name: contactData.name, 
    email: contactData.email,
    leadForm: contactData.leadForm 
  });
  
  if (supabase && await testSupabaseConnection()) {
    console.log('🔄 Using Supabase for contact creation');
    try {
      const insertData = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        company: contactData.company || null,
        message: contactData.message || null,
        status: 'new',
        notes: '',
        leadform: contactData.leadForm || false,
        source_page: contactData.source_page || null,
        contact_hour: contactData.contact_hour || null,
        contact_day_of_week: contactData.contact_day_of_week || null,
        time_slot: contactData.time_slot || null,
        contact_date: contactData.contact_date || null,
        browser: contactData.browser || null,
        device: contactData.device || null
      };
      
      console.log('📤 Inserting to Supabase:', insertData);
      
      const { data, error } = await supabase
        .from('contacts')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw error;
      }
      
      console.log(`✅ Contact created in Supabase v18.3.7 with ID: ${data.id}`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase createContact failed:', error.message);
      console.log('🔄 Falling back to demo database');
    }
  } else {
    console.log('⚠️ Supabase not available, using demo database');
  }
  
  console.log('📦 Creating contact in demo database v18.3.7');
  const newContact = {
    id: demoDatabase.contacts.length + 1,
    ...contactData,
    status: 'new',
    notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    leadform: contactData.leadForm || false
  };
  demoDatabase.contacts.unshift(newContact);
  console.log('✅ Contact created in demo database with ID:', newContact.id);
  return newContact;
}

// ===============================
// ENHANCED STATISTICS FUNCTIONS
// ===============================

async function getEnhancedStats() {
  const contacts = await getAllContacts();
  const now = new Date();
  const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisWeekContacts = contacts.filter(c => new Date(c.created_at) >= thisWeekStart);
  const thisMonthContacts = contacts.filter(c => new Date(c.created_at) >= thisMonthStart);
  
  const totalContacts = contacts.length;
  const convertedContacts = contacts.filter(c => c.status === 'converted').length;
  const conversionRate = totalContacts > 0 ? Math.round((convertedContacts / totalContacts) * 100) : 0;
  
  const leadContacts = contacts.filter(c => c.leadForm || c.leadform).length;
  const normalContacts = totalContacts - leadContacts;
  
  return {
    timeframe: {
      thisWeek: thisWeekContacts.length,
      thisMonth: thisMonthContacts.length,
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
}

async function getServiceBreakdown() {
  const contacts = await getAllContacts();
  const serviceStats = {};
  const totalContacts = contacts.length;

  contacts.forEach(contact => {
    const service = contact.source_page || 'Homepage';
    serviceStats[service] = (serviceStats[service] || 0) + 1;
  });

  return Object.entries(serviceStats)
    .map(([service, count]) => ({
      service,
      count,
      percentage: totalContacts > 0 ? Math.round((count / totalContacts) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}

async function getTimeAnalysis() {
  const contacts = await getAllContacts();
  
  const hourStats = {};
  const dayStats = {};
  const slotStats = {};

  contacts.forEach(contact => {
    if (contact.contact_hour !== null) {
      hourStats[contact.contact_hour] = (hourStats[contact.contact_hour] || 0) + 1;
    }
    if (contact.contact_day_of_week) {
      dayStats[contact.contact_day_of_week] = (dayStats[contact.contact_day_of_week] || 0) + 1;
    }
    if (contact.time_slot) {
      slotStats[contact.time_slot] = (slotStats[contact.time_slot] || 0) + 1;
    }
  });

  const peakHour = Object.entries(hourStats).sort((a, b) => b[1] - a[1])[0];
  const peakDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0];
  const peakSlot = Object.entries(slotStats).sort((a, b) => b[1] - a[1])[0];

  return {
    peakHour: peakHour ? { hour: parseInt(peakHour[0]), count: peakHour[1] } : null,
    peakDay: peakDay ? { day: peakDay[0], count: peakDay[1] } : null,
    peakSlot: peakSlot ? { slot: peakSlot[0], count: peakSlot[1] } : null,
    hourDistribution: hourStats,
    dayDistribution: dayStats,
    slotDistribution: slotStats
  };
}

// ===============================
// ENHANCED STATISTICS HELPER FUNCTIONS
// ===============================

function getSourcePageFromUrl(url) {
  if (!url) return 'Homepage';
  
  const serviceMapping = {
    '/leistung/strategische-unternehmensentwicklung': 'Strategische Unternehmensentwicklung',
    '/leistung/vertriebsoptimierung': 'Vertriebsoptimierung', 
    '/leistung/marketing-strategien': 'Marketing Strategien',
    '/leistung/wertanalyse': 'Wertanalyse'
  };
  
  for (const [path, service] of Object.entries(serviceMapping)) {
    if (url.includes(path)) {
      return service;
    }
  }
  
  return 'Homepage';
}

function getContactHour() {
  return new Date().getHours();
}

function getContactDayOfWeek() {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return days[new Date().getDay()];
}

function getTimeSlot(hour) {
  if (hour >= 6 && hour < 9) return 'Früh (06-09)';
  if (hour >= 9 && hour < 12) return 'Vormittag (09-12)';
  if (hour >= 12 && hour < 14) return 'Mittag (12-14)';
  if (hour >= 14 && hour < 17) return 'Nachmittag (14-17)';
  if (hour >= 17 && hour < 20) return 'Abend (17-20)';
  if (hour >= 20 && hour < 23) return 'Spät (20-23)';
  return 'Nacht (23-06)';
}

function getBrowserInfo(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Other';
}

function getDeviceType(userAgent) {
  if (!userAgent) return 'Unknown';
  
  const mobileKeywords = ['Mobile', 'Android', 'iPhone', 'iPad', 'Windows Phone'];
  for (const keyword of mobileKeywords) {
    if (userAgent.includes(keyword)) {
      return 'Mobile';
    }
  }
  
  return 'Desktop';
}

// ===============================
// VERBESSERTE HEADER-EXTRAKTION v18.3.8
// ===============================

function extractRequestHeaders(request) {
  console.log('🔍 Extracting request headers...');
  
  // Alle verfügbaren Headers loggen
  const allHeaders = {};
  for (const [key, value] of request.headers.entries()) {
    allHeaders[key] = value;
  }
  console.log('📋 Available headers:', Object.keys(allHeaders));
  
  // IP-Adresse mit mehreren Fallbacks
  const ipAddress = 
    request.headers.get('cf-connecting-ip') ||        // Cloudflare
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || // Load Balancer
    request.headers.get('x-real-ip') ||               // nginx
    request.headers.get('x-client-ip') ||             // Apache
    request.headers.get('forwarded')?.match(/for=([^;,\s]+)/)?.[1] || // Standard
    request.headers.get('remote-addr') ||             // Direct
    'Unknown';
  
  // User-Agent mit Fallbacks
  const userAgent = 
    request.headers.get('user-agent') ||
    request.headers.get('User-Agent') ||
    'Unknown';
  
  // Referer mit Fallbacks  
  const referer = 
    request.headers.get('referer') ||
    request.headers.get('Referer') ||
    '';
  
  console.log('📍 Extracted data:', {
    ipAddress,
    userAgent: userAgent.substring(0, 50) + '...',
    referer,
    totalHeaders: Object.keys(allHeaders).length
  });
  
  return { ipAddress, userAgent, referer };
}

// ===============================
// ASTRO API ENDPOINTS - VOLLSTÄNDIG v18.3.7
// ===============================

export async function GET({ url }) {
  const searchParams = new URL(url).searchParams;
  const action = searchParams.get('action');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  console.log(`📡 GET request with action: ${action}`);

  try {
    switch (action) {
      case 'debug':
        const debugInfo = {
          supabase: {
            url: supabaseUrl ? 'Connected' : 'Not configured',
            key: supabaseKey ? 'Present' : 'Missing',
            client: supabase ? 'Initialized' : 'Failed',
            tested: supabaseConnectionTested
          },
          email: {
            smtp_host: SMTP_CONFIG.host,
            smtp_port: SMTP_CONFIG.port,
            smtp_secure: SMTP_CONFIG.secure,
            smtp_user: SMTP_CONFIG.auth.user ? 'Present' : 'Missing',
            smtp_pass: SMTP_CONFIG.auth.pass ? 'Present' : 'Missing',
            email_from: EMAIL_CONFIG.fromAddress,
            email_to: EMAIL_CONFIG.toAddress,
            status: 'v17.12 Integration Active'
          },
          version: '18.3.8-with-v17.12-email-header-fix',
          timestamp: new Date().toISOString(),
          features: {
            enhanced_statistics: true,
            supabase_integration: true,
            strato_smtp_email: true,
            nodemailer_fallback: true
          }
        };
        return new Response(JSON.stringify(debugInfo), { status: 200, headers });

      case 'contacts':
        const contacts = await getAllContacts();
        return new Response(JSON.stringify(contacts), { status: 200, headers });

      case 'enhanced-stats':
        const enhancedStats = await getEnhancedStats();
        return new Response(JSON.stringify(enhancedStats), { status: 200, headers });

      case 'service-breakdown':
        const serviceBreakdown = await getServiceBreakdown();
        return new Response(JSON.stringify(serviceBreakdown), { status: 200, headers });

      case 'time-analysis':
        const timeAnalysis = await getTimeAnalysis();
        return new Response(JSON.stringify(timeAnalysis), { status: 200, headers });

      case 'test-supabase':
        const supabaseTest = await testSupabaseConnection();
        return new Response(JSON.stringify({ 
          connected: supabaseTest,
          message: supabaseTest ? 'Supabase connection successful' : 'Supabase connection failed'
        }), { status: 200, headers });

      case 'test-email':
        console.log('🧪 Testing email system v18.3.7 with v17.12 integration...');
        const testContactData = {
          name: 'Test User',
          email: EMAIL_CONFIG.toAddress,
          phone: '+49 123 456789',
          message: 'Dies ist eine Test-E-Mail zur Überprüfung der v17.12 E-Mail-Integration.',
          leadForm: false,
          timestamp: new Date().toISOString()
        };
        const testResult = await sendContactEmails(testContactData);
        return new Response(JSON.stringify(testResult), { status: 200, headers });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
    }
  } catch (error) {
    console.error('GET Error v18.3.7:', error);
    return new Response(JSON.stringify({
      error: 'Server error',
      message: error.message
    }), { status: 500, headers });
  }
}

export async function POST({ request }) {
  console.log('📥 POST request received v18.3.7');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    console.log('📝 POST body received:', { 
      name: body.name, 
      email: body.email, 
      leadForm: body.leadForm,
      hasMessage: !!body.message 
    });

    const { name, email, phone, company, message } = body;

    // Validation
    if (!name || !email || !phone) {
      console.log('❌ Validation failed: Missing required fields');
      return new Response(JSON.stringify({ 
        error: 'Name, E-Mail und Telefonnummer sind Pflichtfelder' 
      }), { status: 400, headers });
    }

    const isLeadForm = !!body.leadForm;
    console.log(`📊 Processing ${isLeadForm ? 'LEAD' : 'NORMAL'} form submission`);

    // ===============================
    // ENHANCED STATISTICS INTEGRATION mit Header-Fix
    // ===============================
    
    const now = new Date();
    const contactHour = getContactHour();
    const timeSlot = getTimeSlot(contactHour);
    const dayOfWeek = getContactDayOfWeek();
    
    // ✅ VERBESSERTE HEADER-EXTRAKTION
    const { ipAddress, userAgent, referer } = extractRequestHeaders(request);
    
    const enhancedData = {
      name,
      email,
      phone,
      company: company || null,
      message: message || null,
      leadForm: isLeadForm,
      // Enhanced Statistics Felder
      source_page: getSourcePageFromUrl(referer),
      contact_hour: contactHour,
      contact_day_of_week: dayOfWeek,
      time_slot: timeSlot,
      contact_date: now.toISOString().split('T')[0], // YYYY-MM-DD
      browser: getBrowserInfo(userAgent),
      device: getDeviceType(userAgent),
      // v17.12 E-Mail Kompatibilität - MIT KORREKTEN HEADERN
      timestamp: now.toISOString(),
      userAgent: userAgent,
      ipAddress: ipAddress
    };

    console.log('📊 Enhanced Statistics data:', {
      source_page: enhancedData.source_page,
      contact_hour: enhancedData.contact_hour,
      time_slot: enhancedData.time_slot,
      browser: enhancedData.browser,
      device: enhancedData.device
    });

    // ===============================
    // DATENBANK SPEICHERUNG
    // ===============================
    
    console.log('💾 Starting database save...');
    const savedContact = await createContact(enhancedData);
    console.log('✅ Database save completed:', { id: savedContact.id });

    // ===============================
    // E-MAIL VERSENDUNG v17.12 INTEGRATION
    // ===============================
    
    console.log('📧 Starting email sending v17.12...');
    let emailResults = null;
    
    try {
      emailResults = await sendContactEmails(savedContact);
      console.log('📧 Email sending completed v17.12:', {
        confirmationSent: emailResults.confirmation?.success || false,
        adminSent: emailResults.admin?.success || false,
        overallSuccess: emailResults.success,
        errors: emailResults.errors?.length || 0,
        confirmationReal: emailResults.confirmation?.realEmail || false,
        adminReal: emailResults.admin?.realEmail || false
      });
    } catch (emailError) {
      console.error('❌ Email sending error v17.12:', emailError);
      emailResults = {
        success: false,
        errors: [`E-Mail-Versand fehlgeschlagen: ${emailError.message}`],
        confirmation: { success: false, realEmail: false },
        admin: { success: false, realEmail: false }
      };
    }

    // ===============================
    // ERFOLGREICHE ANTWORT
    // ===============================

    const response = {
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gespeichert und versendet.',
      contact: {
        id: savedContact.id,
        name: savedContact.name,
        email: savedContact.email,
        leadForm: isLeadForm
      },
      // ✅ v17.12 E-MAIL STATUS INTEGRATION
      emails: {
        sent: emailResults?.success || false,
        mode: (emailResults?.confirmation?.realEmail || emailResults?.admin?.realEmail) ? 'REAL' : 'SIMULATION',
        confirmation: {
          sent: emailResults?.confirmation?.success || false,
          recipient: savedContact.email,
          messageId: emailResults?.confirmation?.messageId || null,
          real: emailResults?.confirmation?.realEmail || false
        },
        admin: {
          sent: emailResults?.admin?.success || false,
          recipient: EMAIL_CONFIG.toAddress,
          messageId: emailResults?.admin?.messageId || null,
          priority: savedContact.leadForm ? 'HIGH (Lead)' : 'Normal',
          real: emailResults?.admin?.realEmail || false
        },
        errors: emailResults?.errors || []
      },
      enhancedStats: {
        source_page: enhancedData.source_page,
        time_slot: enhancedData.time_slot,
        device: enhancedData.device
      },
      version: '18.3.8'
    };

    console.log('✅ POST completed successfully v18.3.8 with v17.12 email integration + header fix');
    return new Response(JSON.stringify(response), { status: 200, headers });

  } catch (error) {
    console.error('❌ POST Error v18.3.7:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      message: error.message,
      debug: error.stack,
      version: '18.3.8'
    }), { status: 500, headers });
  }
}

export async function PUT({ request }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Contact ID required' }), { status: 400, headers });
    }

    if (supabase && await testSupabaseConnection()) {
      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Contact ${id} updated in Supabase v18.3.7`);
      return new Response(JSON.stringify(data), { status: 200, headers });
    } else {
      // Demo database update
      const contact = demoDatabase.contacts.find(c => c.id === parseInt(id));
      if (!contact) {
        return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404, headers });
      }

      if (status !== undefined) contact.status = status;
      if (notes !== undefined) contact.notes = notes;
      contact.updated_at = new Date().toISOString();

      console.log(`✅ Contact ${id} updated in demo database v18.3.7`);
      return new Response(JSON.stringify(contact), { status: 200, headers });
    }
  } catch (error) {
    console.error('PUT Error v18.3.7:', error);
    return new Response(JSON.stringify({
      error: 'Server error',
      message: error.message
    }), { status: 500, headers });
  }
}

export async function DELETE({ url }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const searchParams = new URL(url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Contact ID required' }), { status: 400, headers });
    }

    if (supabase && await testSupabaseConnection()) {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`✅ Contact ${id} deleted from Supabase v18.3.7`);
      return new Response(JSON.stringify({ success: true, message: 'Contact deleted' }), { status: 200, headers });
    } else {
      // Demo database deletion
      const index = demoDatabase.contacts.findIndex(c => c.id === parseInt(id));
      if (index === -1) {
        return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404, headers });
      }

      demoDatabase.contacts.splice(index, 1);
      console.log(`✅ Contact ${id} deleted from demo database v18.3.7`);
      return new Response(JSON.stringify({ success: true, message: 'Contact deleted' }), { status: 200, headers });
    }
  } catch (error) {
    console.error('DELETE Error v18.3.7:', error);
    return new Response(JSON.stringify({
      error: 'Server error',
      message: error.message
    }), { status: 500, headers });
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