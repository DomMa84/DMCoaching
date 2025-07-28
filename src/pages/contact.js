// src/pages/api/contact.js v17.9 (Demo Database Integration)
// Contact API - Demo Database Integration für Preview Server
// ✅ ÄNDERUNGEN v17.9:
// - Demo-Datenbank Integration implementiert
// - Echte Kontakt-Speicherung (in-memory)
// - Admin Dashboard kompatible Daten
// - Preview Server ready - keine externen Abhängigkeiten

import demoDb from '../../lib/demoDatabase.js';

// ✅ WICHTIG: Server-Rendering für Build aktivieren
export const prerender = false;

console.log('📧 Contact API v17.9 loaded - Demo Database Integration');

export async function POST({ request }) {
  console.log('=== CONTACT API v17.9 CALLED - DEMO DB INTEGRATION ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  
  try {
    // ✅ Sicheres JSON-Parsing
    let data;
    try {
      const rawBody = await request.text();
      console.log('📥 Raw body received v17.9 (length):', rawBody.length);
      
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body');
      }
      
      data = JSON.parse(rawBody);
      console.log('📥 Parsed data successfully v17.9:', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        messageLength: data.message?.length || 0,
        gdprConsent: data.gdprConsent,
        leadForm: data.leadForm,
        honeypot: data.honeypot || 'empty'
      });
    } catch (parseError) {
      console.error('❌ JSON Parse Error v17.9:', parseError.message);
      return new Response(JSON.stringify({
        success: false,
        message: 'Ungültige Anfrage: Daten konnten nicht verarbeitet werden.',
        version: 'Contact API v17.9 - Demo DB',
        error: 'JSON_PARSE_ERROR'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ Enhanced Honeypot-Schutz
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('🚫 Honeypot-Schutz aktiviert v17.9 - Bot erkannt');
      console.log('🤖 Honeypot content:', data.honeypot);
      
      // Fake success response für Bots
      return new Response(JSON.stringify({
        success: true,
        message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
        version: 'Contact API v17.9 - Honeypot Block',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ Server-seitige Validierung
    const errors = [];
    
    // Name validation
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
    const existingContact = demoDb.getContactByEmail(data.email.trim());
    if (existingContact) {
      console.log('⚠️ Duplicate email detected v17.9:', data.email);
      // Note: We'll still process it but add a note
    }
    
    // Phone validation
    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 6) {
      errors.push('Telefonnummer muss mindestens 6 Zeichen lang sein');
    }
    if (data.phone && data.phone.trim().length > 25) {
      errors.push('Telefonnummer darf maximal 25 Zeichen lang sein');
    }
    
    // Message validation (optional)
    if (data.message && typeof data.message === 'string' && data.message.trim().length > 2000) {
      errors.push('Nachricht darf maximal 2000 Zeichen lang sein');
    }
    
    // GDPR validation
    if (!data.gdprConsent || data.gdprConsent !== true) {
      errors.push('Zustimmung zur Datenschutzerklärung ist erforderlich');
    }

    if (errors.length > 0) {
      console.log('❌ Validierungsfehler v17.9:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Bitte korrigieren Sie die folgenden Fehler:',
        errors: errors,
        version: 'Contact API v17.9 - Demo DB'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ DEMO DATABASE INTEGRATION - Kontakt speichern
    console.log('💾 Saving contact to Demo Database v17.9');
    
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

    // Kontakt in Demo-Datenbank speichern
    const savedContact = demoDb.createContact(contactData);
    
    if (!savedContact) {
      throw new Error('Failed to save contact to demo database');
    }

    console.log('✅ Kontakt erfolgreich in Demo DB gespeichert v17.9:', {
      id: savedContact.id,
      name: savedContact.name,
      email: savedContact.email,
      phone: savedContact.phone,
      status: savedContact.status
    });
    
    // ✅ Statistiken nach Speicherung
    const stats = demoDb.getContactStats();
    console.log('📊 Demo DB Statistiken nach Speicherung v17.9:', stats);
    
    // TODO: E-Mail-Benachrichtigung (später implementieren)
    console.log('📧 TODO: E-Mail-Benachrichtigung implementieren');
    
    console.log('🎉 Kontaktanfrage erfolgreich verarbeitet v17.9');
    
    // ✅ SUCCESS RESPONSE mit Kontakt-Details
    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v17.9 - Demo DB',
      timestamp: new Date().toISOString(),
      contactId: savedContact.id,
      receivedData: {
        name: savedContact.name,
        email: savedContact.email,
        phone: savedContact.phone,
        leadForm: savedContact.leadForm,
        status: savedContact.status
      },
      stats: {
        totalContacts: stats.total,
        newContacts: stats.neu
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Contact-ID': savedContact.id.toString(),
        'X-Database-Type': 'Demo'
      }
    });

  } catch (error) {
    console.error('❌ CONTACT API ERROR v17.9:', error);
    console.error('❌ Error stack v17.9:', error.stack);
    
    // ✅ Enhanced Error Response
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
      version: 'Contact API v17.9 - Demo DB',
      error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_SERVER_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      contactInfo: {
        phone: '+49 7440 913367',
        email: 'webmaster@maier-maier-value.com'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ✅ GET Handler für API-Dokumentation & Demo DB Status
export async function GET({ request }) {
  console.log('📖 Contact API Documentation & Demo DB Status requested v17.9');
  
  try {
    // Demo Database Status abrufen
    const dbStatus = demoDb.getDemoDbStatus();
    const stats = demoDb.getContactStats();
    
    return new Response(JSON.stringify({
      api: 'Contact API',
      version: 'v17.9',
      description: 'Dominik Maier Contact Form API with Demo Database',
      database: {
        ...dbStatus,
        currentStats: stats
      },
      endpoints: {
        POST: {
          description: 'Submit contact form',
          url: '/api/contact',
          required: ['name', 'email', 'phone', 'gdprConsent'],
          optional: ['message', 'leadForm', 'honeypot'],
          validation: {
            name: 'min: 2 chars, max: 100 chars',
            email: 'valid email format, max: 255 chars, duplicate check',
            phone: 'min: 6 chars, max: 25 chars',
            message: 'max: 2000 chars (optional)',
            gdprConsent: 'must be true'
          },
          response: {
            success: 'Contact saved to demo database',
            error: 'Validation errors or server error'
          }
        },
        GET: {
          description: 'API documentation and demo database status',
          url: '/api/contact',
          response: 'This documentation'
        }
      },
      features: [
        'Demo Database Integration (In-Memory)',
        'Real contact storage and retrieval',
        'Honeypot spam protection',
        'Server-side validation',
        'GDPR compliance',
        'Duplicate email detection',
        'Contact statistics',
        'Admin dashboard compatible',
        'Preview server ready'
      ],
      demoDatabase: {
        note: 'Using in-memory demo database for preview server',
        migration: 'Easy migration to MySQL database later',
        persistence: 'Data persists during server session only'
      },
      contact: {
        phone: '+49 7440 913367',
        email: 'webmaster@maier-maier-value.com'
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Version': 'v17.9',
        'X-Database-Type': 'Demo'
      }
    });
    
  } catch (error) {
    console.error('❌ GET API Error v17.9:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error retrieving API documentation',
      version: 'Contact API v17.9',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}