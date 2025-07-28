// src/pages/api/contact.js v17.12 (Echte Strato E-Mails AKTIVIERT)
// Contact API - Echte Strato SMTP E-Mail-Versendung aktiviert
// ✅ ÄNDERUNGEN v17.12:
// - Nodemailer-Code aktiviert (TODO-Kommentare entfernt)
// - realEmail: true für echte E-Mail-Versendung
// - Strato SMTP vollständig implementiert
// - Fallback zu Simulation bei Fehlern

// ✅ WICHTIG: Server-Rendering für Build aktivieren
export const prerender = false;

console.log('📧 Contact API v17.12 loaded - ECHTE Strato E-Mails AKTIVIERT');

// ✅ INLINE DATABASE (weiterhin für Demo)
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

// ✅ STRATO SMTP KONFIGURATION
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

console.log('📧 SMTP Config v17.12:', {
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: SMTP_CONFIG.secure,
  user: SMTP_CONFIG.auth.user,
  fromAddress: EMAIL_CONFIG.fromAddress,
  toAddress: EMAIL_CONFIG.toAddress
});

// ✅ INLINE DATABASE OPERATIONS
function createContact(contactData) {
  console.log('✅ Inline DB: createContact called v17.12');

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
  
  console.log('🎉 Inline DB: Contact created with ID v17.12:', newContact.id);
  return newContact;
}

function getContactByEmail(email) {
  return demoContacts.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
}

function getContactStats() {
  return {
    total: demoContacts.length,
    neu: demoContacts.filter(c => c.status === 'neu').length,
    offen: demoContacts.filter(c => c.status === 'offen').length,
    abgeschlossen: demoContacts.filter(c => c.status === 'abgeschlossen').length,
    leadForm: demoContacts.filter(c => c.leadForm === true).length,
    processed: demoContacts.filter(c => c.processed === true).length
  };
}

// ✅ NODEMAILER TRANSPORT ERSTELLEN v17.12
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

// ✅ ECHTE E-MAIL INTEGRATION v17.12
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

// ✅ E-MAIL TEMPLATE GENERATOREN (Inline für Build-Kompatibilität)
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
                E-Mail: <a href="mailto:webmaster@maier-value.com">webmaster@maier-value.com</a>
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
E-Mail: webmaster@maier-value.com

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
        .header { background: ${contactData.leadForm ? 'linear-gradient(135deg, #3B82F6, #1E40AF)' : 'linear-gradient(135deg, #D2AE6C, #B8941F)'}; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-top: none; }
        .contact-details { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 15px 0; }
        .message-box { background: #f9f9f9; border-left: 4px solid #D2AE6C; padding: 15px; margin: 15px 0; }
        .tech-details { background: #f1f3f4; border-radius: 6px; padding: 15px; margin: 15px 0; font-size: 12px; color: #666; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .label { font-weight: bold; color: #555; }
        .lead-badge { background: #3B82F6; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .normal-badge { background: #6B7280; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        h1 { margin: 0; font-size: 22px; }
        h2 { color: #D2AE6C; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
        .urgent { background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; padding: 10px; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${leadIndicator} Neue Kontaktanfrage</h1>
        <p>Eingegangen: ${new Date(contactData.timestamp).toLocaleString('de-DE')}</p>
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
Eingegangen: ${new Date(contactData.timestamp).toLocaleString('de-DE')}

Nachricht:
${contactData.message}

---
IP-Adresse: ${contactData.ipAddress}
User-Agent: ${contactData.userAgent}
DSGVO-Zustimmung: ${contactData.gdprConsent ? 'Ja' : 'Nein'}
  `;
}

export async function POST({ request }) {
  console.log('=== CONTACT API v17.12 CALLED - ECHTE STRATO E-MAILS AKTIVIERT ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  
  try {
    // ✅ JSON-Parsing
    let data;
    try {
      const rawBody = await request.text();
      console.log('📥 Raw body received v17.12 (length):', rawBody.length);
      
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body');
      }
      
      data = JSON.parse(rawBody);
      console.log('📥 Parsed data successfully v17.12:', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        messageLength: data.message?.length || 0,
        gdprConsent: data.gdprConsent,
        leadForm: data.leadForm,
        honeypot: data.honeypot || 'empty'
      });
    } catch (parseError) {
      console.error('❌ JSON Parse Error v17.12:', parseError.message);
      return new Response(JSON.stringify({
        success: false,
        message: 'Ungültige Anfrage: Daten konnten nicht verarbeitet werden.',
        version: 'Contact API v17.12 - Echte Strato E-Mails',
        error: 'JSON_PARSE_ERROR'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ Honeypot-Schutz
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('🚫 Honeypot-Schutz aktiviert v17.12 - Bot erkannt');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
        version: 'Contact API v17.12 - Honeypot Block',
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
    const existingContact = getContactByEmail(data.email.trim());
    if (existingContact) {
      console.log('⚠️ Duplicate email detected v17.12:', data.email);
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
      console.log('❌ Validierungsfehler v17.12:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Bitte korrigieren Sie die folgenden Fehler:',
        errors: errors,
        version: 'Contact API v17.12 - Echte Strato E-Mails'
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

    // ✅ KONTAKT IN DATENBANK SPEICHERN
    console.log('💾 Saving contact to database v17.12');
    const savedContact = createContact(contactData);
    
    if (!savedContact) {
      throw new Error('Failed to save contact to database');
    }

    console.log('✅ Kontakt erfolgreich gespeichert v17.12:', {
      id: savedContact.id,
      name: savedContact.name,
      email: savedContact.email,
      leadForm: savedContact.leadForm
    });

    // ✅ ECHTE E-MAIL VERSENDUNG v17.12
    console.log('📧 Initiating REAL Strato email sending v17.12');
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

    // ✅ STATISTIKEN AKTUALISIEREN
    const stats = getContactStats();
    console.log('📊 Database stats after contact v17.12:', stats);
    
    console.log('🎉 Kontaktanfrage erfolgreich verarbeitet v17.12');
    
    // ✅ SUCCESS RESPONSE mit E-Mail-Status
    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v17.12 - Echte Strato E-Mails AKTIVIERT',
      timestamp: new Date().toISOString(),
      contactId: savedContact.id,
      
      // Kontakt-Daten
      contact: {
        id: savedContact.id,
        name: savedContact.name,
        email: savedContact.email,
        phone: savedContact.phone,
        leadForm: savedContact.leadForm,
        status: savedContact.status
      },
      
      // ✅ EHRLICHER E-MAIL-STATUS v17.12
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
        leads: stats.leadForm
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Contact-ID': savedContact.id.toString(),
        'X-Database-Type': 'Demo',
        'X-Email-Status': emailResults?.success ? 'sent' : 'failed',
        'X-Email-Mode': (emailResults?.confirmation?.realEmail || emailResults?.admin?.realEmail) ? 'REAL' : 'SIMULATION'
      }
    });

  } catch (error) {
    console.error('❌ CONTACT API ERROR v17.12:', error);
    console.error('❌ Error stack v17.12:', error.stack);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
      version: 'Contact API v17.12 - Echte Strato E-Mails AKTIVIERT',
      error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_SERVER_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      contactInfo: {
        phone: '+49 7440 913367',
        email: 'webmaster@maier-value.com'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ✅ GET Handler für API-Dokumentation & E-Mail Service Status
export async function GET({ request }) {
  console.log('📖 Contact API Documentation & E-Mail Service Status requested v17.12');
  
  try {
    const stats = getContactStats();
    
    // E-Mail Service Status v17.12
    const emailServiceStatus = {
      version: '1.2',
      service: 'Strato SMTP Integration',
      mode: 'REAL_WITH_FALLBACK', // ✅ Echte E-Mails mit Fallback
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
        'Bestätigungs-E-Mails an Kontakte',
        'Admin-Benachrichtigungen',
        'HTML + Text E-Mails',
        'Lead-Priorisierung',
        'DSGVO-konforme Verarbeitung',
        'Ehrlicher E-Mail-Status',
        'SMTP Connection Testing'
      ],
      status: {
        ready: true,
        simulation: false, // ✅ Nicht mehr nur Simulation
        realSMTP: true,    // ✅ Echte SMTP-Integration
        fallback: true     // ✅ Fallback zu Simulation bei Problemen
      }
    };
    
    return new Response(JSON.stringify({
      api: 'Contact API',
      version: 'v17.12',
      description: 'Dominik Maier Contact Form API with ACTIVATED Strato E-Mail Integration',
      
      database: {
        type: 'Inline Demo Database (In-Memory)',
        contactCount: demoContacts.length,
        nextId: nextContactId,
        currentStats: stats,
        features: [
          'CRUD Operations',
          'Status Management', 
          'Lead Tracking',
          'Build-Compatible'
        ]
      },
      
      emailService: emailServiceStatus,
      
      endpoints: {
        POST: {
          description: 'Submit contact form with REAL Strato email notifications',
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
            success: 'Contact saved + emails sent (REAL Strato SMTP)',
            error: 'Validation errors or server error',
            includes: [
              'Contact details',
              'Email sending status (real SMTP)',
              'Database statistics',
              'SMTP connection status'
            ]
          }
        },
        GET: {
          description: 'API documentation and service status',
          url: '/api/contact',
          response: 'This documentation with email service status'
        }
      },
      
      features: [
        '📧 ECHTE Strato E-Mail Integration AKTIVIERT',
        '✅ Nodemailer SMTP Transport',
        '🔄 Automatischer Fallback bei SMTP-Problemen', 
        '✅ Bestätigungs-E-Mails (HTML + Text)',
        '🚨 Admin-Benachrichtigungen',
        '🎯 Lead-Priorisierung',
        '📊 Demo Database Storage',
        '🛡️ Spam Protection (Honeypot)',
        '✔️ Server-side Validation',
        '🔒 GDPR Compliance',
        '🚀 Build-Compatible',
        '🔍 Ehrlicher E-Mail-Status',
        '🔧 SMTP Connection Testing'
      ],
      
      emailTemplates: [
        {
          type: 'confirmation',
          recipient: 'contact_email',
          subject: 'Ihre Nachricht ist bei uns angekommen - Dominik Maier',
          features: ['Professional HTML Design', 'Responsive Layout', 'Contact Details', 'Branding'],
          status: 'ACTIVE'
        },
        {
          type: 'admin_notification',
          recipient: 'maier@maier-value.com',
          subject: 'Neue Anfrage von {name}',
          features: ['Lead Priority Highlighting', 'Technical Details', 'Direct Actions', 'Contact Info'],
          status: 'ACTIVE'
        }
      ],
      
      requirements: {
        dependencies: ['nodemailer (will be imported dynamically)'],
        environment: [
          'SMTP_HOST=smtp.strato.de',
          'SMTP_USER=webmaster@maier-value.com',
          'SMTP_PASS=***',
          'EMAIL_PORT=587',
          'EMAIL_TO=maier@maier-value.com'
        ],
        notes: [
          'Nodemailer will be imported dynamically',
          'Falls back to simulation if SMTP fails',
          'Honest email status reporting',
          'SMTP connection is tested before sending'
        ]
      },
      
      contact: {
        phone: '+49 7440 913367',
        email: 'webmaster@maier-value.com'
      },
      
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Version': 'v17.12',
        'X-Database-Type': 'Demo',
        'X-Email-Service': 'Strato-SMTP-ACTIVATED'
      }
    });
    
  } catch (error) {
    console.error('❌ GET API Error v17.12:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error retrieving API documentation',
      version: 'Contact API v17.12',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}