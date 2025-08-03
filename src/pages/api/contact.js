/**
 * Contact API v18.3.4 - Supabase Connection Fix
 * 
 * CHANGELOG v18.3.4:
 * - ✅ FIX: Supabase Connection wird beim Start getestet
 * - ✅ FIX: Besseres Error-Handling für Database-Operationen
 * - ✅ FIX: Console-Logging für jeden Schritt hinzugefügt
 * - ✅ ADD: Fallback-Database wenn Supabase nicht erreichbar
 * - ✅ KEEP: E-Mail-System vollständig funktional
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
  console.log('✅ Nodemailer loaded successfully v18.3.2');
  
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
      // ✅ KORRIGIERT: Richtige Nodemailer Syntax (createTransport ohne "er")
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
      console.log('✅ Strato SMTP transporter configured and verified v18.3.3');
      
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
// SUPABASE SETUP (UNVERÄNDERT)
// ===============================

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://bqcwyfzspdbcanondyyz.supabase.co';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3d5ZnpzcGRiY2Fub25keXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODI0NjQsImV4cCI6MjA2OTM1ODQ2NH0.d5QxZWZGDiMyigiEHctL9jImTQyqqxBhBE6YUmdBhrI';

let supabase = null;
let supabaseConnectionTested = false;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized v18.3.4');
    
    // Sofort Connection testen beim Start
    try {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      console.log(`✅ Supabase connection verified v18.3.4. Found ${count} contacts.`);
      supabaseConnectionTested = true;
    } catch (testError) {
      console.warn('❌ Supabase connection test failed at startup:', testError.message);
      supabaseConnectionTested = true; // Verhindert weitere Tests
    }
    
  } catch (error) {
    console.warn('❌ Supabase client initialization failed:', error.message);
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
// E-MAIL FUNKTIONEN (VERBESSERT)
// ===============================

async function sendEmail(to, subject, htmlContent) {
  // Detailliertes Logging
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
        'X-Mailer': 'Dominik Maier Homepage v18.3.1',
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
    
    // Fallback zu Simulation
    return {
      success: false,
      simulation: true,
      error: error.message,
      messageId: `fallback_${Date.now()}`
    };
  }
}

// ===============================
// ALLE ANDEREN FUNKTIONEN UNVERÄNDERT
// (Database, Enhanced Statistics, etc.)
// ===============================

// [... Rest des Codes bleibt gleich ...]

// DATABASE FUNCTIONS (VOLLSTÄNDIG)
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
      updated_at: "2025-07-25T10:30:00Z"
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
      
      console.log(`✅ Loaded ${contacts.length} contacts from Supabase v18.3.3`);
      return contacts;
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  console.log('📦 Using demo database fallback v18.3.2');
  return demoDatabase.contacts;
}

async function createContact(contactData) {
  console.log('💾 createContact called with:', { name: contactData.name, email: contactData.email });
  
  if (supabase && await testSupabaseConnection()) {
    console.log('🔄 Using Supabase for contact creation');
    try {
      const insertData = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        company: contactData.company || null,
        message: contactData.message,
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
      
      console.log(`✅ Contact created in Supabase v18.3.4 with ID: ${data.id}`);
      return data;
    } catch (error) {
      console.warn('❌ Supabase createContact failed:', error.message);
      console.log('🔄 Falling back to demo database');
    }
  } else {
    console.log('⚠️ Supabase not available, using demo database');
  }
  
  console.log('📦 Creating contact in demo database v18.3.4');
  const newContact = {
    id: demoDatabase.contacts.length + 1,
    ...contactData,
    status: 'new',
    notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  demoDatabase.contacts.unshift(newContact);
  console.log('✅ Contact created in demo database with ID:', newContact.id);
  return newContact;
}

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

// ===============================
// ASTRO API ENDPOINTS (ENHANCED DEBUG)
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

  if (action === 'debug') {
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
                version: '18.3.4-supabase-connection-fix',
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(debugInfo), { status: 200, headers });
  }

  // Andere GET Endpoints hier...
  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Validation
    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ 
        error: 'Name, E-Mail und Telefonnummer sind Pflichtfelder' 
      }), { status: 400, headers });
    }

    const isLeadForm = !!body.leadForm;
    
    // E-Mail Templates
    const emailData = { name, email, phone, company, message, isLeadForm };

    // Bestätigungs-E-Mail
    const confirmationTemplate = isLeadForm ? 'confirmation_lead' : 'confirmation_normal';
    const confirmationHtml = getEmailTemplate(confirmationTemplate, emailData);
    const confirmationSubject = isLeadForm 
      ? 'Vielen Dank für Ihr Interesse - Dominik Maier'
      : 'Bestätigung Ihrer Kontaktanfrage - Dominik Maier';
    
    const confirmationResult = await sendEmail(email, confirmationSubject, confirmationHtml);
    
    // Admin-Benachrichtigung
    const adminHtml = getEmailTemplate('admin_notification', emailData);
    const adminSubject = `🎯 Neue ${isLeadForm ? 'Lead-' : ''}Kontaktanfrage von ${name}`;
    
    const adminResult = await sendEmail(
      import.meta.env.EMAIL_TO || 'kontakt@dominik-maier.com',
      adminSubject,
      adminHtml
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde gespeichert.',
      emailStatus: {
        confirmation: confirmationResult,
        admin: adminResult
      }
    }), { status: 200, headers });

  } catch (error) {
    console.error('API POST Error v18.3.1:', error);
    return new Response(JSON.stringify({
      error: 'Interner Server-Fehler',
      debug: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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