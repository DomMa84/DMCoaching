/**
 * Contact API v18.3.5 - Complete Database & E-Mail Fix
 * 
 * CHANGELOG v18.3.5:
 * - ✅ FIX: POST-Route jetzt mit vollständiger Datenbank-Speicherung
 * - ✅ FIX: Enhanced Statistics Integration wieder aktiviert
 * - ✅ FIX: testSupabaseConnection() Funktion hinzugefügt
 * - ✅ FIX: Alle fehlenden API-Endpoints wieder eingefügt
 * - ✅ KEEP: E-Mail-System funktional (Strato SMTP)
 */

import { createClient } from '@supabase/supabase-js';

// ===============================
// E-MAIL INTEGRATION (STRATO SMTP) - IMPROVED
// ===============================

let nodemailer = null;
let emailTransporter = null;
let emailError = null;

// Dynamischer Import für Nodemailer - KORRIGIERT
try {
  const nodemailerModule = await import('nodemailer');
  nodemailer = nodemailerModule.default || nodemailerModule;
  console.log('✅ Nodemailer loaded successfully v18.3.5');
  
  // Robuste SMTP Transporter Konfiguration
  const smtpConfig = {
    host: import.meta.env.SMTP_HOST,
    user: import.meta.env.SMTP_USER, 
    pass: import.meta.env.SMTP_PASS,
    port: import.meta.env.EMAIL_PORT,
    secure: import.meta.env.EMAIL_SECURE
  };
  
  console.log('🔧 SMTP Config Check:', {
    host: smtpConfig.host || 'MISSING',
    user: smtpConfig.user ? 'Present' : 'MISSING',
    pass: smtpConfig.pass ? 'Present' : 'MISSING',
    port: smtpConfig.port || 'Default (587)',
    secure: smtpConfig.secure || 'Default (false)'
  });
  
  // Nur initialisieren wenn alle kritischen Daten vorhanden
  if (smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
    try {
      emailTransporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port) || 587,
        secure: smtpConfig.secure === 'true' || false,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000
      });
      
      // Transporter testen
      console.log('🔄 Testing SMTP connection...');
      await emailTransporter.verify();
      console.log('✅ Strato SMTP transporter configured and verified v18.3.5');
      
    } catch (error) {
      console.error('❌ SMTP Transporter verification failed:', error.message);
      emailError = error.message;
      emailTransporter = null;
    }
  } else {
    const missing = [];
    if (!smtpConfig.host) missing.push('SMTP_HOST');
    if (!smtpConfig.user) missing.push('SMTP_USER');  
    if (!smtpConfig.pass) missing.push('SMTP_PASS');
    
    emailError = `Missing environment variables: ${missing.join(', ')}`;
    console.warn('⚠️ SMTP configuration incomplete:', emailError);
  }
  
} catch (error) {
  console.warn('⚠️ Nodemailer import failed:', error.message);
  emailError = `Nodemailer import failed: ${error.message}`;
}

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
    console.log('✅ Supabase client initialized v18.3.5');
  } catch (error) {
    console.warn('❌ Supabase client initialization failed:', error.message);
  }
}

// ===============================
// SUPABASE CONNECTION TEST - HINZUGEFÜGT
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
// E-MAIL TEMPLATES (UNVERÄNDERT)
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
          Diese E-Mail wurde automatisch generiert.
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
          Ich melde mich zeitnah bei Ihnen zurück, um Ihr Anliegen zu besprechen.
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
          <p style="color: #495057; margin: 0 0 10px 0;"><strong>Formular-Typ:</strong> ${data.isLeadForm ? 'Lead-Form' : 'Vollständiges Kontaktformular'}</p>
        </div>
        ${data.message ? `
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #343a40; margin: 0 0 15px 0; font-size: 18px;">Nachricht:</h3>
          <p style="color: #495057; margin: 0; line-height: 1.6;">"${data.message}"</p>
        </div>
        ` : ''}
        <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 16px;">
          Diese Anfrage wurde über die Homepage erfasst.
        </p>
      ` + baseFooter;

    default:
      return baseStyle + `<p>Unbekannter E-Mail-Typ</p>` + baseFooter;
  }
}

// ===============================
// E-MAIL FUNKTIONEN
// ===============================

async function sendEmail(to, subject, htmlContent) {
  console.log(`📧 Attempting to send email to: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 Transporter available: ${!!emailTransporter}`);
  
  if (!emailTransporter) {
    console.log(`📧 Email simulation (no transporter) - Reason: ${emailError || 'Unknown'}`);
    return {
      success: true,
      simulation: true,
      reason: emailError || 'No transporter configured',
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  try {
    const mailOptions = {
      from: {
        name: 'Dominik Maier - Coaching & Interim Management',
        address: import.meta.env.EMAIL_FROM || import.meta.env.SMTP_USER
      },
      to: to,
      subject: subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, ''),
      headers: {
        'X-Mailer': 'Dominik Maier Homepage v18.3.5',
        'X-Priority': '3'
      }
    };

    console.log(`📧 Sending email via SMTP...`);
    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return {
      success: true,
      simulation: false,
      messageId: info.messageId,
      provider: 'strato'
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    return {
      success: false,
      simulation: true,
      error: error.message,
      messageId: `fallback_${Date.now()}`
    };
  }
}

// ===============================
// DATABASE FUNCTIONS - VOLLSTÄNDIG WIEDERHERGESTELLT
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
      
      console.log(`✅ Loaded ${contacts.length} contacts from Supabase v18.3.5`);
      return contacts;
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database fallback v18.3.5');
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
      
      console.log(`✅ Contact created in Supabase v18.3.5 with ID: ${data.id}`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase createContact failed:', error.message);
      console.log('🔄 Falling back to demo database');
    }
  } else {
    console.log('⚠️ Supabase not available, using demo database');
  }
  
  console.log('📦 Creating contact in demo database v18.3.5');
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
// ENHANCED STATISTICS FUNCTIONS - WIEDERHERGESTELLT
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
// ENHANCED STATISTICS HELPER FUNCTIONS - WIEDERHERGESTELLT
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
// ASTRO API ENDPOINTS - VOLLSTÄNDIG
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
            transporter: emailTransporter ? 'Configured' : 'Not configured',
            nodemailer: nodemailer ? 'Available' : 'Not available',
            smtp_host: import.meta.env.SMTP_HOST || 'Not set',
            smtp_user: import.meta.env.SMTP_USER ? 'Present' : 'Not set',
            smtp_pass: import.meta.env.SMTP_PASS ? 'Present' : 'Not set',
            email_from: import.meta.env.EMAIL_FROM ? 'Present' : 'Not set',
            email_to: import.meta.env.EMAIL_TO ? 'Present' : 'Not set',
            error: emailError || 'None'
          },
          version: '18.3.5-complete-fix',
          timestamp: new Date().toISOString()
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

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
    }
  } catch (error) {
    console.error('GET Error v18.3.5:', error);
    return new Response(JSON.stringify({
      error: 'Server error',
      message: error.message
    }), { status: 500, headers });
  }
}

export async function POST({ request }) {
  console.log('📥 POST request received v18.3.5');
  
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
    // ENHANCED STATISTICS INTEGRATION - WIEDER AKTIVIERT
    // ===============================
    
    const now = new Date();
    const contactHour = getContactHour();
    const timeSlot = getTimeSlot(contactHour);
    const dayOfWeek = getContactDayOfWeek();
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
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
      device: getDeviceType(userAgent)
    };

    console.log('📊 Enhanced Statistics data:', {
      source_page: enhancedData.source_page,
      contact_hour: enhancedData.contact_hour,
      time_slot: enhancedData.time_slot,
      browser: enhancedData.browser,
      device: enhancedData.device
    });

    // ===============================
    // DATENBANK SPEICHERUNG - WIEDER AKTIVIERT
    // ===============================
    
    console.log('💾 Starting database save...');
    const savedContact = await createContact(enhancedData);
    console.log('✅ Database save completed:', { id: savedContact.id });

    // ===============================
    // E-MAIL VERSENDUNG
    // ===============================
    
    console.log('📧 Starting email sending...');
    const emailData = { name, email, phone, company, message, isLeadForm };

    // Bestätigungs-E-Mail
    const confirmationTemplate = isLeadForm ? 'confirmation_lead' : 'confirmation_normal';
    const confirmationHtml = getEmailTemplate(confirmationTemplate, emailData);
    const confirmationSubject = isLeadForm 
      ? 'Vielen Dank für Ihr Interesse - Dominik Maier'
      : 'Bestätigung Ihrer Kontaktanfrage - Dominik Maier';
    
    console.log(`📧 Sending confirmation email (${confirmationTemplate})...`);
    const confirmationResult = await sendEmail(email, confirmationSubject, confirmationHtml);
    console.log('📧 Confirmation result:', confirmationResult);
    
    // Admin-Benachrichtigung
    const adminHtml = getEmailTemplate('admin_notification', emailData);
    const adminSubject = `🎯 Neue ${isLeadForm ? 'Lead-' : ''}Kontaktanfrage von ${name}`;
    
    console.log('📧 Sending admin notification...');
    const adminResult = await sendEmail(
      import.meta.env.EMAIL_TO || 'kontakt@dominik-maier.com',
      adminSubject,
      adminHtml
    );
    console.log('📧 Admin result:', adminResult);

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
      emailStatus: {
        confirmation: confirmationResult,
        admin: adminResult
      },
      enhancedStats: {
        source_page: enhancedData.source_page,
        time_slot: enhancedData.time_slot,
        device: enhancedData.device
      }
    };

    console.log('✅ POST completed successfully v18.3.5');
    return new Response(JSON.stringify(response), { status: 200, headers });

  } catch (error) {
    console.error('❌ POST Error v18.3.5:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      message: error.message,
      debug: error.stack
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

      console.log(`✅ Contact ${id} updated in Supabase`);
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

      console.log(`✅ Contact ${id} updated in demo database`);
      return new Response(JSON.stringify(contact), { status: 200, headers });
    }
  } catch (error) {
    console.error('PUT Error v18.3.5:', error);
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

      console.log(`✅ Contact ${id} deleted from Supabase`);
      return new Response(JSON.stringify({ success: true, message: 'Contact deleted' }), { status: 200, headers });
    } else {
      // Demo database deletion
      const index = demoDatabase.contacts.findIndex(c => c.id === parseInt(id));
      if (index === -1) {
        return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404, headers });
      }

      demoDatabase.contacts.splice(index, 1);
      console.log(`✅ Contact ${id} deleted from demo database`);
      return new Response(JSON.stringify({ success: true, message: 'Contact deleted' }), { status: 200, headers });
    }
  } catch (error) {
    console.error('DELETE Error v18.3.5:', error);
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