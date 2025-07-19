// src/pages/contact.ts v17.1 (Moved to pages root)
import type { APIRoute } from 'astro';
import { saveContact, testConnection } from '../lib/database.ts';

console.log('📧 Contact API v17.1 loaded (pages root)');

interface ContactData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  gdprConsent: boolean;
  leadForm?: boolean;
  honeypot?: string;
}

export const POST: APIRoute = async ({ request }) => {
  console.log('=== CONTACT API v17.1 CALLED (pages root) ===');
  
  try {
    const data: ContactData = await request.json();
    console.log('📥 Empfangene Daten v17.1:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      hasMessage: !!data.message,
      gdprConsent: data.gdprConsent,
      leadForm: data.leadForm,
      honeypot: data.honeypot
    });

    // Honeypot-Schutz
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('🚫 Honeypot-Schutz aktiviert v17.1 - Bot erkannt');
      return new Response(JSON.stringify({
        success: false,
        message: 'Spam erkannt',
        version: 'Contact API v17.1 (pages root)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Server-seitige Validierung
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name muss mindestens 2 Zeichen lang sein');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push('Gültige E-Mail-Adresse erforderlich');
    }
    
    if (!data.phone || data.phone.trim().length < 6) {
      errors.push('Telefonnummer muss mindestens 6 Zeichen lang sein');
    }
    
    if (!data.gdprConsent) {
      errors.push('Zustimmung zur Datenschutzerklärung erforderlich');
    }

    if (errors.length > 0) {
      console.log('❌ Validierungsfehler v17.1:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Validierungsfehler: ' + errors.join(', '),
        errors: errors,
        version: 'Contact API v17.1 (pages root)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Daten für Datenbank vorbereiten
    const contactData = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message?.trim() || '',
      gdprConsent: data.gdprConsent,
      leadForm: data.leadForm || false,
      honeypot: data.honeypot || ''
    };

    // Datenbank-Verbindung testen
    const isDbConnected = await testConnection();
    let dbSaveSuccessful = false;
    let contactId: number | null = null;
    
    if (isDbConnected) {
      try {
        contactId = await saveContact(contactData);
        dbSaveSuccessful = true;
        console.log('✅ Kontakt in Datenbank gespeichert v17.1 mit ID:', contactId);
      } catch (dbError) {
        console.error('❌ Datenbankfehler v17.1:', dbError);
        // Trotzdem erfolgreich antworten, aber DB-Fehler loggen
      }
    } else {
      console.log('⚠️ Datenbank nicht verfügbar v17.1');
    }

    // TODO: E-Mail versenden (falls gewünscht)
    // await sendConfirmationEmail(contactData);
    // await sendNotificationEmail(contactData);

    console.log('🎉 Kontaktanfrage erfolgreich verarbeitet v17.1');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v17.1 (pages root)',
      dbSaved: dbSaveSuccessful,
      contactId: contactId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ CONTACT API ERROR v17.1:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      version: 'Contact API v17.1 (pages root)',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
};