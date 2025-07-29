/**
 * Contact API v18.1 - Supabase Integration (Production)
 * 
 * CHANGELOG v18.1:
 * - Supabase PostgreSQL statt Demo Database
 * - ALLE anderen Funktionen bleiben UNVERÄNDERT
 * - E-Mail System identisch zu v17.13
 * - Admin Dashboard kompatibel
 * - ContactForm.astro funktioniert weiterhin
 * - Intelligentes Fallback-System
 */

import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// ===============================
// SUPABASE SETUP (PRODUCTION)
// ===============================

const supabaseUrl = process.env.SUPABASE_URL || 'https://bqcwyfzspdbcanondyyz.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3d5ZnpzcGRiY2Fub25keXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODI0NjQsImV4cCI6MjA2OTM1ODQ2NH0.d5QxZWZGDiMyigiEHctL9jImTQyqqxBhBE6YUmdBhrI';

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
// DEMO DATABASE (FALLBACK - UNVERÄNDERT)
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
// SUPABASE CONNECTION TEST
// ===============================

async function testSupabaseConnection() {
  if (!supabase || supabaseConnectionTested) {
    return supabase !== null;
  }

  try {
    // Einfacher Test mit COUNT query
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

// ===============================
// DATABASE ABSTRACTION (ERWEITERT)
// ===============================

async function getAllContacts() {
  // Supabase versuchen
  if (supabase && await testSupabaseConnection()) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`✅ Loaded ${data.length} contacts from Supabase`);
      return data || [];
    } catch (error) {
      console.warn('❌ Supabase getAllContacts failed:', error.message);
    }
  }
  
  // Fallback zu Demo Database
  console.log('📦 Using demo database fallback');
  return demoDatabase.contacts;
}

async function createContact(contactData) {
  // Supabase versuchen
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
          notes: ''
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
  
  // Fallback zu Demo Database
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
  // Supabase versuchen
  if (supabase && await testSupabaseConnection()) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
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
  
  // Fallback zu Demo Database
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
  // Supabase versuchen
  if (supabase && await testSupabaseConnection()) {
    try {
      // Total Count
      const { count: total } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      // Status Counts
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
  
  // Fallback zu Demo Database
  console.log('📦 Using demo database stats');
  const stats = { total: 0, new: 0, contacted: 0, converted: 0, archived: 0 };
  demoDatabase.contacts.forEach(contact => {
    stats.total++;
    stats[contact.status] = (stats[contact.status] || 0) + 1;
  });
  return stats;
}

// ===============================
// SMTP KONFIGURATION (UNVERÄNDERT)
// ===============================

const SMTP_CONFIG = {
  host: 'smtp.strato.de',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'kontakt@dominik-maier.com',
    pass: process.env.SMTP_PASS || 'dein-smtp-passwort'
  }
};

// ===============================
// E-MAIL FUNKTIONEN (UNVERÄNDERT aus v17.13)
// ===============================

async function sendEmail(to, subject, htmlContent, textContent) {
  try {
    const transporter = nodemailer.createTransporter(SMTP_CONFIG);
    await transporter.verify();

    const result = await transporter.sendMail({
      from: `"Dominik Maier" <${SMTP_CONFIG.auth.user}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('SMTP Error:', error);
    return { success: false, error: error.message, simulation: true };
  }
}

function generateEmailTemplates(contactData) {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kontaktbestätigung - Dominik Maier</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #D2AE6C 0%, #B8935A 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Vielen Dank für Ihre Nachricht!</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Liebe/r ${contactData.name},
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            vielen Dank für Ihr Interesse an meinen Beratungsleistungen. Ihre Nachricht ist bei mir eingegangen und ich werde mich zeitnah bei Ihnen melden.
          </p>
          
          <div style="background-color: #f9fafb; border-left: 4px solid #D2AE6C; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #D2AE6C; margin: 0 0 10px 0; font-size: 18px;">Ihre Anfrage:</h3>
            <p style="color: #6b7280; margin: 0; font-style: italic;">"${contactData.message}"</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Ich freue mich auf unser Gespräch und darauf, Sie bei Ihren unternehmerischen Herausforderungen zu unterstützen.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #D2AE6C 0%, #B8935A 100%); color: white; padding: 15px 25px; border-radius: 6px; display: inline-block;">
              <strong>Dominik Maier</strong><br>
              <span style="font-size: 14px;">Strategische Unternehmensberatung & Interimsmanagement</span>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            <strong>Dominik Maier</strong> | kontakt@dominik-maier.com | +49 (0) 123 456789
          </p>
        </div>
      </div>
    </body>
    </html>`;

  const textTemplate = `
Vielen Dank für Ihre Nachricht!

Liebe/r ${contactData.name},

vielen Dank für Ihr Interesse an meinen Beratungsleistungen. Ihre Nachricht ist bei mir eingegangen und ich werde mich zeitnah bei Ihnen melden.

Ihre Anfrage:
"${contactData.message}"

Ich freue mich auf unser Gespräch und darauf, Sie bei Ihren unternehmerischen Herausforderungen zu unterstützen.

Mit freundlichen Grüßen
Dominik Maier

---
Dominik Maier
Strategische Unternehmensberatung & Interimsmanagement
kontakt@dominik-maier.com | +49 (0) 123 456789`;

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Neue Kontaktanfrage - Dominik Maier</title>
    </head>
    <body style="font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #D2AE6C 0%, #B8935A 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Neue Kontaktanfrage</h1>
        </div>
        
        <div style="padding: 30px;">
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #D2AE6C; margin: 0 0 15px 0;">Kontaktdaten:</h2>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>E-Mail:</strong> ${contactData.email}</p>
            <p><strong>Telefon:</strong> ${contactData.phone || 'Nicht angegeben'}</p>
            <p><strong>Unternehmen:</strong> ${contactData.company || 'Nicht angegeben'}</p>
          </div>
          
          <div style="background-color: #fef7e7; border: 1px solid #D2AE6C; border-radius: 6px; padding: 20px;">
            <h3 style="color: #D2AE6C; margin: 0 0 10px 0;">Nachricht:</h3>
            <p style="margin: 0; line-height: 1.6;">"${contactData.message}"</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Eingegangen am ${new Date().toLocaleString('de-DE', { 
                timeZone: 'Europe/Berlin',
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  const adminText = `
🎯 Neue Kontaktanfrage

Kontaktdaten:
Name: ${contactData.name}
E-Mail: ${contactData.email}
Telefon: ${contactData.phone || 'Nicht angegeben'}
Unternehmen: ${contactData.company || 'Nicht angegeben'}

Nachricht:
"${contactData.message}"

Eingegangen am ${new Date().toLocaleString('de-DE', { 
  timeZone: 'Europe/Berlin',
  dateStyle: 'full',
  timeStyle: 'short'
})}`;

  return {
    confirmation: { html: htmlTemplate, text: textTemplate },
    admin: { html: adminHtml, text: adminText }
  };
}

// ===============================
// API ENDPOINTS (UNVERÄNDERT aus v17.13)
// ===============================

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query, body } = req;

    switch (method) {
      case 'GET':
        if (query.action === 'list') {
          const contacts = await getAllContacts();
          return res.status(200).json({ contacts });
        }
        
        if (query.action === 'stats') {
          const stats = await getContactStats();
          return res.status(200).json({ stats });
        }
        
        // Debug-Info für Entwicklung
        if (query.action === 'debug') {
          return res.status(200).json({
            supabase: {
              url: supabaseUrl ? 'Connected' : 'Not configured',
              key: supabaseKey ? 'Present' : 'Missing',
              client: supabase ? 'Initialized' : 'Failed',
              tested: supabaseConnectionTested
            },
            version: '18.1',
            timestamp: new Date().toISOString()
          });
        }
        
        return res.status(400).json({ error: 'Invalid action parameter' });

      case 'POST':
        // Validierung (UNVERÄNDERT)
        const { name, email, message, phone, company } = body;
        
        if (!name || !email || !message) {
          return res.status(400).json({ 
            error: 'Name, E-Mail und Nachricht sind Pflichtfelder' 
          });
        }

        // E-Mail Format validieren
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            error: 'Ungültiges E-Mail-Format' 
          });
        }

        // Honeypot Spam-Schutz
        if (body.website) {
          return res.status(400).json({ 
            error: 'Spam erkannt' 
          });
        }

        const contactData = { name, email, message, phone, company };
        
        try {
          // Kontakt in Datenbank speichern (jetzt mit Supabase + Fallback)
          const newContact = await createContact(contactData);
          
          // E-Mail Templates generieren (UNVERÄNDERT)
          const templates = generateEmailTemplates(contactData);
          
          // E-Mails versenden (UNVERÄNDERT)
          const confirmationResult = await sendEmail(
            email,
            'Bestätigung Ihrer Kontaktanfrage - Dominik Maier',
            templates.confirmation.html,
            templates.confirmation.text
          );
          
          const adminResult = await sendEmail(
            'kontakt@dominik-maier.com',
            `🎯 Neue Kontaktanfrage von ${name}`,
            templates.admin.html,
            templates.admin.text
          );

          // Response basierend auf E-Mail-Erfolg (UNVERÄNDERT)
          const emailsSent = confirmationResult.success && adminResult.success;
          const isSimulation = confirmationResult.simulation || adminResult.simulation;

          return res.status(200).json({
            success: true,
            message: emailsSent 
              ? 'Vielen Dank! Ihre Nachricht wurde versendet und Sie erhalten eine Bestätigung per E-Mail.'
              : 'Ihre Nachricht wurde gespeichert. E-Mail-Versendung derzeit nicht verfügbar.',
            contact: newContact,
            emailStatus: {
              sent: emailsSent,
              simulation: isSimulation,
              confirmation: confirmationResult.success,
              admin: adminResult.success
            },
            database: supabase ? 'supabase' : 'demo'
          });

        } catch (error) {
          console.error('Contact creation error:', error);
          return res.status(500).json({
            error: 'Fehler beim Speichern der Kontaktdaten',
            debug: error.message
          });
        }

      case 'PUT':
        const { id } = query;
        const updateData = body;
        
        if (!id) {
          return res.status(400).json({ error: 'Contact ID required' });
        }

        try {
          const updatedContact = await updateContact(id, updateData);
          
          if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
          }

          return res.status(200).json({
            success: true,
            message: 'Kontakt erfolgreich aktualisiert',
            contact: updatedContact,
            database: supabase ? 'supabase' : 'demo'
          });

        } catch (error) {
          console.error('Contact update error:', error);
          return res.status(500).json({
            error: 'Fehler beim Aktualisieren des Kontakts',
            debug: error.message
          });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Interner Server-Fehler',
      debug: error.message
    });
  }
}