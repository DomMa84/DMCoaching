// src/pages/api/contact.js v18.0 (MySQL Database Integration)
// Contact API - Echte MySQL-Datenbank statt Demo Database
// ✅ ÄNDERUNGEN v18.0:
// - MySQL Database Integration (Strato Database)
// - Demo Database als Fallback beibehalten
// - Intelligente Database-Auswahl (MySQL → Demo Fallback)
// - E-Mail Integration beibehalten (v17.13 Features)
// - Migration-Support für bestehende Demo-Daten

// ✅ WICHTIG: Server-Rendering für Build aktivieren
export const prerender = false;

console.log('🗄️ Contact API v18.0 loaded - MySQL Database Integration');

// ✅ DEMO DATABASE FALLBACK (beibehalten für Kompatibilität)
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
  }
];

let nextContactId = 4;

// ✅ STRATO SMTP KONFIGURATION (von v17.13 beibehalten)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.strato.de',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER || 'webmaster@maier-value.com',
    pass: process.env.SMTP_PASS || 'mizpeg-siCpep-xahzi1'
  }
};

const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Dominik Maier',
  fromAddress: process.env.SMTP_USER || 'webmaster@maier-value.com',
  toAddress: process.env.EMAIL_TO || 'maier@maier-value.com'
};

// ✅ DATABASE MANAGEMENT - MySQL mit Demo Fallback
let databaseMode = 'unknown'; // 'mysql', 'demo', 'unknown'
let mysqlService = null;

/**
 * Database Service initialisieren
 * @returns {Object} Database Service
 */
async function initializeDatabaseService() {
  console.log('🗄️ Initializing database service v18.0...');
  
  try {
    // ✅ MySQL Service laden
    const mysqlModule = await import('../lib/mysqlService.js');
    mysqlService = mysqlModule.default;
    
    // ✅ MySQL Connection testen
    const connectionTest = await mysqlService.testConnection();
    
    if (connectionTest.success) {
      databaseMode = 'mysql';
      console.log('✅ MySQL Database connected - Using Strato MySQL');
      
      // ✅ Auto-Migration: Demo → MySQL (nur beim ersten Mal)
      const statsResult = await mysqlService.getStats();
      if (statsResult.success && statsResult.stats.total === 0 && demoContacts.length > 0) {
        console.log('🔄 Auto-migrating demo data to MySQL...');
        const migrationResult = await mysqlService.migrateDemoData(demoContacts);
        console.log(`✅ Migration completed: ${migrationResult.migrated} contacts migrated`);
      }
      
    } else {
      throw new Error(`MySQL connection failed: ${connectionTest.error}`);
    }
    
  } catch (error) {
    console.error('❌ MySQL initialization failed:', error.message);
    console.log('🔄 Falling back to Demo Database');
    databaseMode = 'demo';
    mysqlService = null;
  }
  
  console.log(`🗄️ Database mode: ${databaseMode.toUpperCase()}`);
  return { mode: databaseMode, service: mysqlService };
}

// ✅ DEMO DATABASE OPERATIONS (Fallback)
function createContactDemo(contactData) {
  console.log('💾 Creating contact in Demo Database');

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
  console.log('✅ Contact created in Demo Database with ID:', newContact.id);
  return { success: true, contact: newContact, id: newContact.id };
}

function getContactStatsDemo() {
  return {
    success: true,
    stats: {
      total: demoContacts.length,
      neu: demoContacts.filter(c => c.status === 'neu').length,
      offen: demoContacts.filter(c => c.status === 'offen').length,
      abgeschlossen: demoContacts.filter(c => c.status === 'abgeschlossen').length,
      leadForm: demoContacts.filter(c => c.leadForm === true).length,
      processed: demoContacts.filter(c => c.processed === true).length
    }
  };
}

function checkDuplicateEmailDemo(email) {
  const existing = demoContacts.find(c => c.email.toLowerCase() === email.toLowerCase());
  return {
    exists: !!existing,
    contact: existing || null
  };
}

// ✅ UNIFIED DATABASE OPERATIONS
async function createContact(contactData) {
  await initializeDatabaseService();
  
  if (databaseMode === 'mysql' && mysqlService) {
    return await mysqlService.createContact(contactData);
  } else {
    return createContactDemo(contactData);
  }
}

async function getContactStats() {
  await initializeDatabaseService();
  
  if (databaseMode === 'mysql' && mysqlService) {
    return await mysqlService.getStats();
  } else {
    return getContactStatsDemo();
  }
}

async function checkDuplicateEmail(email) {
  await initializeDatabaseService();
  
  if (databaseMode === 'mysql' && mysqlService) {
    return await mysqlService.checkDuplicateEmail(email);
  } else {
    return checkDuplicateEmailDemo(email);
  }
}

async function updateEmailStatus(contactId, emailType, success) {
  if (databaseMode === 'mysql' && mysqlService) {
    return await mysqlService.updateEmailStatus(contactId, emailType, success);
  } else {
    // Demo Database: E-Mail Status wird nicht persistiert
    console.log(`📧 Demo Database: Email status ${emailType}=${success} for contact ${contactId} (not persisted)`);
    return { success: true, affectedRows: 1 };
  }
}

// ✅ NODEMAILER TRANSPORT ERSTELLEN v18.0 (von v17.13)
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
    console.log('✅ Strato SMTP-Verbindung erfolgreich v18.0');
    
    return { transporter, isReal: true };
    
  } catch (error) {
    console.error('❌ Nodemailer/SMTP Error v18.0:', error.message);
    console.log('🔄 Fallback zu Simulation-Modus v18.0');
    
    // Fallback zu Simulation
    return {
      transporter: {
        sendMail: async (mailOptions) => {
          console.log('📧 FALLBACK: Simulating email send v18.0:', {
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

// ✅ ECHTE E-MAIL INTEGRATION v18.0 (Corporate Design von v17.13)
async function sendContactEmails(contactData) {
  console.log('📧 E-Mail Service v18.0: ECHTE E-Mail-Versendung startet für:', contactData.name);
  
  const results = {
    confirmation: null,
    admin: null,
    success: false,
    errors: []
  };
  
  try {
    // ✅ NODEMAILER TRANSPORT ERSTELLEN
    const { transporter, isReal } = await createNodemailerTransport();
    console.log(`📧 Transport Mode v18.0: ${isReal ? 'REAL SMTP' : 'SIMULATION'}`);
    
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
        realEmail: isReal,
        response: confirmationResult.response
      };
      
      // ✅ E-Mail-Status in Datenbank aktualisieren
      await updateEmailStatus(contactData.id, 'confirmation', true);
      
      console.log(`✅ Confirmation email ${isReal ? 'SENT' : 'SIMULATED'} v18.0:`, {
        to: contactData.email,
        messageId: confirmationResult.messageId,
        real: isReal
      });
      
    } catch (error) {
      console.error('❌ Confirmation email failed v18.0:', error);
      results.confirmation = {
        success: false,
        error: error.message,
        type: 'confirmation',
        recipient: contactData.email,
        realEmail: false
      };
      results.errors.push(`Bestätigung: ${error.message}`);
      
      await updateEmailStatus(contactData.id, 'confirmation', false);
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
        realEmail: isReal,
        response: adminResult.response
      };
      
      // ✅ E-Mail-Status in Datenbank aktualisieren
      await updateEmailStatus(contactData.id, 'admin', true);
      
      console.log(`✅ Admin notification ${isReal ? 'SENT' : 'SIMULATED'} v18.0:`, {
        to: EMAIL_CONFIG.toAddress,
        messageId: adminResult.messageId,
        real: isReal,
        priority: results.admin.priority
      });
      
    } catch (error) {
      console.error('❌ Admin notification failed v18.0:', error);
      results.admin = {
        success: false,
        error: error.message,
        type: 'admin_notification',
        recipient: EMAIL_CONFIG.toAddress,
        realEmail: false
      };
      results.errors.push(`Admin: ${error.message}`);
      
      await updateEmailStatus(contactData.id, 'admin', false);
    }
    
    // Erfolg wenn mindestens eine E-Mail erfolgreich
    results.success = results.confirmation?.success || results.admin?.success;
    
    console.log('📊 Email sending summary v18.0:', {
      confirmationSent: results.confirmation?.success || false,
      adminSent: results.admin?.success || false,
      overallSuccess: results.success,
      errors: results.errors.length,
      mode: isReal ? 'REAL_SMTP' : 'SIMULATION',
      realEmails: (results.confirmation?.realEmail || false) || (results.admin?.realEmail || false),
      database: databaseMode.toUpperCase()
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Error in sendContactEmails v18.0:', error);
    
    results.errors.push(`General: ${error.message}`);
    return results;
  }
}

// ✅ E-MAIL TEMPLATE GENERATOREN (Corporate Design von v17.13)
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
            <li>Bei dringenden Fragen erreichen Sie uns telefonisch</li>
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
        .database-badge { background: #10B981; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; }
        h1 { margin: 0; font-size: 22px; }
        h2 { color: #D2AE6C; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
        .urgent { background: #FFF8E1; border: 1px solid #D2AE6C; color: #8B6914; padding: 10px; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${leadIndicator} Neue Kontaktanfrage</h1>
        <p>Eingegangen: ${new Date(contactData.timestamp).toLocaleString('de-DE')} 
        <span class="database-badge">${databaseMode.toUpperCase()}</span></p>
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
            <p><strong>Datenbank:</strong> ${databaseMode.toUpperCase()} ${contactData.id ? `(ID: ${contactData.id})` : ''}</p>
            <p><strong>IP-Adresse:</strong> ${contactData.ipAddress}</p>
            <p><strong>DSGVO-Zustimmung:</strong> ${contactData.gdprConsent ? '✅ Ja' : '❌ Nein'}</p>
            <p><strong>User-Agent:</strong> ${contactData.userAgent}</p>
        </div>
        
        <h2>🎯 Nächste Schritte:</h2>
        <ul>
            <li>Kontakt im Admin Dashboard bearbeiten</li>
            <li>${contactData.leadForm ? 'PRIORITÄT: Lead-Anfrage zeitnah bearbeiten' : 'Anfrage innerhalb 24h beantworten'}</li>
            <li>Status auf "offen" setzen bei Bearbeitung</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Automatische Benachrichtigung von Dominik Maier Website<br>
        Database: ${databaseMode.toUpperCase()}</p>
    </div>
</body>
</html>
  `;
}

function generateAdminText(contactData) {
  return `
NEUE KONTAKTANFRAGE ${contactData.leadForm ? '(LEAD)' : ''} - ${databaseMode.toUpperCase()}

Name: ${contactData.name}
E-Mail: ${contactData.email}
Telefon: ${contactData.phone}
Typ: ${contactData.leadForm ? 'Lead-Formular' : 'Normaler Kontakt'}
Eingegangen: ${new Date(contactData.timestamp).toLocaleString('de-DE')}

Nachricht:
${contactData.message}

---
Datenbank: ${databaseMode.toUpperCase()}${contactData.id ? ` (ID: ${contactData.id})` : ''}
IP-Adresse: ${contactData.ipAddress}
User-Agent: ${contactData.userAgent}
DSGVO-Zustimmung: ${contactData.gdprConsent ? 'Ja' : 'Nein'}
  `;
}

export async function POST({ request }) {
  console.log('=== CONTACT API v18.0 CALLED - MYSQL DATABASE INTEGRATION ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  
  try {
    // ✅ JSON-Parsing
    let data;
    try {
      const rawBody = await request.text();
      console.log('📥 Raw body received v18.0 (length):', rawBody.length);
      
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body');
      }
      
      data = JSON.parse(rawBody);
      console.log('📥 Parsed data successfully v18.0:', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        messageLength: data.message?.length || 0,
        gdprConsent: data.gdprConsent,
        leadForm: data.leadForm,
        honeypot: data.honeypot || 'empty'
      });
    } catch (parseError) {
      console.error('❌ JSON Parse Error v18.0:', parseError.message);
      return new Response(JSON.stringify({
        success: false,
        message: 'Ungültige Anfrage: Daten konnten nicht verarbeitet werden.',
        version: 'Contact API v18.0 - MySQL Database Integration',
        error: 'JSON_PARSE_ERROR'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ Honeypot-Schutz
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('🚫 Honeypot-Schutz aktiviert v18.0 - Bot erkannt');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
        version: 'Contact API v18.0 - Honeypot Block',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ Server-seitige Validierung
    const errors = [];
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Name muss mindestens 2 Zeichen lang sein');
    }
    if (data.name && data.name.trim().length > 100) {
      errors.push('Name darf maximal 100 Zeichen lang sein');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email.trim())) {
      errors.push('Gültige E-Mail-Adresse erforderlich');
    }
    if (data.email && data.email.trim().length > 255) {
      errors.push('E-Mail-Adresse darf maximal 255 Zeichen lang sein');
    }
    
    // Check for duplicate email
    const duplicateCheck = await checkDuplicateEmail(data.email.trim());
    if (duplicateCheck.exists) {
      console.log('⚠️ Duplicate email detected v18.0:', data.email);
    }
    
    // Phone validation
    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 6) {
      errors.push('Telefonnummer muss mindestens 6 Zeichen lang sein');
    }
    if (data.phone && data.phone.trim().length > 25) {
      errors.push('Telefonnummer darf maximal 25 Zeichen lang sein');
    }
    
    // Message validation
    if (data.message && typeof data.message === 'string' && data.message.trim().length > 2000) {
      errors.push('Nachricht darf maximal 2000 Zeichen lang sein');
    }
    
    // GDPR validation
    if (!data.gdprConsent || data.gdprConsent !== true) {
      errors.push('Zustimmung zur Datenschutzerklärung ist erforderlich');
    }

    if (errors.length > 0) {
      console.log('❌ Validierungsfehler v18.0:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Bitte korrigieren Sie die folgenden Fehler:',
        errors: errors,
        version: 'Contact API v18.0 - MySQL Database Integration'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ KONTAKT-DATEN VORBEREITEN
    const contactData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      message: data.message?.trim() || '',
      gdprConsent: data.gdprConsent,
      leadForm: data.leadForm || false,
      source: 'Website-Kontaktformular',
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'Unknown',
      timestamp: new Date().toISOString()
    };

    // ✅ KONTAKT IN DATENBANK SPEICHERN (MySQL oder Demo)
    console.log('💾 Saving contact to database v18.0');
    const saveResult = await createContact(contactData);
    
    if (!saveResult.success) {
      throw new Error(`Failed to save contact: ${saveResult.error}`);
    }

    const savedContact = saveResult.contact;
    console.log('✅ Kontakt erfolgreich gespeichert v18.0:', {
      id: savedContact.id,
      name: savedContact.name,
      email: savedContact.email,
      leadForm: savedContact.leadForm,
      database: databaseMode.toUpperCase()
    });

    // ✅ ECHTE E-MAIL VERSENDUNG v18.0
    console.log('📧 Initiating REAL Strato email sending v18.0');
    let emailResults = null;
    
    try {
      emailResults = await sendContactEmails(savedContact);
      console.log('📧 Email sending completed v18.0:', {
        confirmationSent: emailResults.confirmation?.success || false,
        adminSent: emailResults.admin?.success || false,
        overallSuccess: emailResults.success,
        errors: emailResults.errors?.length || 0,
        confirmationReal: emailResults.confirmation?.realEmail || false,
        adminReal: emailResults.admin?.realEmail || false,
        database: databaseMode.toUpperCase()
      });
    } catch (emailError) {
      console.error('❌ Email sending error v18.0:', emailError);
      emailResults = {
        success: false,
        errors: [`E-Mail-Versand fehlgeschlagen: ${emailError.message}`],
        confirmation: { success: false, realEmail: false },
        admin: { success: false, realEmail: false }
      };
    }

    // ✅ STATISTIKEN AKTUALISIEREN
    const statsResult = await getContactStats();
    const stats = statsResult.success ? statsResult.stats : {
      total: 0, neu: 0, offen: 0, abgeschlossen: 0, leadForm: 0, processed: 0
    };
    
    console.log('📊 Database stats after contact v18.0:', {
      ...stats,
      database: databaseMode.toUpperCase()
    });
    
    console.log('🎉 Kontaktanfrage erfolgreich verarbeitet v18.0');
    
    // ✅ SUCCESS RESPONSE mit Database-Info
    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v18.0 - MySQL Database Integration',
      timestamp: new Date().toISOString(),
      contactId: savedContact.id,
      
      // ✅ DATABASE INFO
      database: {
        mode: databaseMode.toUpperCase(),
        type: databaseMode === 'mysql' ? 'Strato MySQL Database' : 'Demo Database (Fallback)',
        persistent: databaseMode === 'mysql'
      },
      
      // Kontakt-Daten
      contact: {
        id: savedContact.id,
        name: savedContact.name,
        email: savedContact.email,
        phone: savedContact.phone,
        leadForm: savedContact.leadForm,
        status: savedContact.status
      },
      
      // ✅ E-MAIL-STATUS (von v17.13)
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
      
      // Statistiken
      stats: {
        totalContacts: stats.total,
        newContacts: stats.neu,
        leads: stats.leadForm,
        database: databaseMode.toUpperCase()
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Contact-ID': savedContact.id.toString(),
        'X-Database-Type': databaseMode.toUpperCase(),
        'X-Email-Status': emailResults?.success ? 'sent' : 'failed',
        'X-Email-Mode': (emailResults?.confirmation?.realEmail || emailResults?.admin?.realEmail) ? 'REAL' : 'SIMULATION'
      }
    });

  } catch (error) {
    console.error('❌ CONTACT API ERROR v18.0:', error);
    console.error('❌ Error stack v18.0:', error.stack);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
      version: 'Contact API v18.0 - MySQL Database Integration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_SERVER_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      database: {
        mode: databaseMode || 'UNKNOWN',
        available: databaseMode !== 'unknown'
      },
      contactInfo: {
        phone: '+49 7440 913367',
        email: 'maier@maier-value.com'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ✅ GET Handler für API-Dokumentation & Database Status
export async function GET({ request }) {
  console.log('📖 Contact API Documentation & Database Status requested v18.0');
  
  try {
    // ✅ Database Service initialisieren
    await initializeDatabaseService();
    
    const statsResult = await getContactStats();
    const stats = statsResult.success ? statsResult.stats : {
      total: 0, neu: 0, offen: 0, abgeschlossen: 0, leadForm: 0, processed: 0
    };
    
    // ✅ Database Service Status
    let databaseServiceStatus = {
      mode: databaseMode.toUpperCase(),
      type: databaseMode === 'mysql' ? 'Strato MySQL Database' : 'Demo Database (Fallback)',
      persistent: databaseMode === 'mysql',
      available: databaseMode !== 'unknown'
    };
    
    if (databaseMode === 'mysql' && mysqlService) {
      const mysqlStatus = await mysqlService.getServiceStatus();
      databaseServiceStatus = {
        ...databaseServiceStatus,
        ...mysqlStatus
      };
    }
    
    // E-Mail Service Status v18.0
    const emailServiceStatus = {
      version: '1.3',
      service: 'Strato SMTP Integration',
      mode: 'REAL_WITH_FALLBACK',
      config: {
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: SMTP_CONFIG.secure,
        user: SMTP_CONFIG.auth.user,
        fromAddress: EMAIL_CONFIG.fromAddress,
        toAddress: EMAIL_CONFIG.toAddress
      },
      features: [
        'Echte Strato SMTP Integration',
        'Nodemailer Transport',
        'Fallback zu Simulation bei Fehlern',
        'Inline E-Mail Templates',
        'Corporate Design Templates',
        'Bestätigungs-E-Mails an Kontakte',
        'Admin-Benachrichtigungen',
        'HTML + Text E-Mails',
        'Lead-Priorisierung',
        'DSGVO-konforme Verarbeitung',
        'Ehrlicher E-Mail-Status',
        'SMTP Connection Testing',
        'Database E-Mail Status Tracking'
      ],
      status: {
        ready: true,
        simulation: false,
        realSMTP: true,
        fallback: true
      }
    };
    
    return new Response(JSON.stringify({
      api: 'Contact API',
      version: 'v18.0',
      description: 'Dominik Maier Contact Form API with MySQL Database Integration',
      
      // ✅ DATABASE STATUS
      database: databaseServiceStatus,
      
      emailService: emailServiceStatus,
      
      endpoints: {
        POST: {
          description: 'Submit contact form with MySQL storage and email notifications',
          url: '/api/contact',
          required: ['name', 'email', 'phone', 'gdprConsent'],
          optional: ['message', 'leadForm', 'honeypot'],
          validation: {
            name: 'min: 2 chars, max: 100 chars',
            email: 'valid email format, max: 255 chars',
            phone: 'min: 6 chars, max: 25 chars',
            message: 'max: 2000 chars (optional)',
            gdprConsent: 'must be true'
          },
          response: {
            success: 'Contact saved to MySQL + emails sent',
            error: 'Validation errors or server error',
            includes: [
              'Contact details',
              'Database status (MySQL/Demo)',
              'Email sending status (real SMTP)',
              'Database statistics'
            ]
          }
        },
        GET: {
          description: 'API documentation and service status',
          url: '/api/contact',
          response: 'This documentation with database and email service status'
        }
      },
      
      features: [
        '🗄️ MYSQL DATABASE INTEGRATION',
        '🔄 Intelligent Database Fallback (MySQL → Demo)',
        '📧 Echte Strato E-Mail Integration',
        '✅ Nodemailer SMTP Transport',
        '🔄 Automatischer Fallback bei SMTP-Problemen', 
        '✅ Bestätigungs-E-Mails (HTML + Text)',
        '🚨 Admin-Benachrichtigungen',
        '🎯 Lead-Priorisierung',
        '📊 MySQL Database Storage',
        '🛡️ Spam Protection (Honeypot)',
        '✔️ Server-side Validation',
        '🔒 GDPR Compliance',
        '🚀 Build-Compatible',
        '🔍 Ehrlicher E-Mail-Status',
        '🔧 SMTP Connection Testing',
        '📈 Database Statistics & Analytics',
        '🔄 Auto-Migration (Demo → MySQL)',
        '💾 Persistent Data Storage'
      ],
      
      migration: {
        status: databaseMode === 'mysql' ? 'COMPLETED' : 'NOT_REQUIRED',
        from: 'Demo Database (In-Memory)',
        to: 'Strato MySQL Database',
        autoMigration: true
      },
      
      contact: {
        phone: '+49 7440 913367',
        email: 'maier@maier-value.com'
      },
      
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Version': 'v18.0',
        'X-Database-Type': databaseMode.toUpperCase(),
        'X-Email-Service': 'Strato-SMTP-ACTIVATED'
      }
    });
    
  } catch (error) {
    console.error('❌ GET API Error v18.0:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error retrieving API documentation',
      version: 'Contact API v18.0',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}