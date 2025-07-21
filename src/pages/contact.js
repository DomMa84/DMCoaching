// src/pages/contact.js v17.7 (Konsistent versioniert)

// ✅ WICHTIG: Server-Rendering für Build aktivieren
export const prerender = false;

console.log('📧 Contact API v17.7 loaded (Konsistent versioniert)');

export async function POST({ request }) {
  console.log('=== CONTACT API v17.7 CALLED ===');
  
  try {
    // ✅ Sicheres JSON-Parsing
    let data;
    try {
      const rawBody = await request.text();
      console.log('📥 Raw body received v17.7:', rawBody);
      
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body');
      }
      
      data = JSON.parse(rawBody);
      console.log('📥 Parsed data successfully v17.7:', data);
    } catch (parseError) {
      console.error('❌ JSON Parse Error v17.7:', parseError.message);
      return new Response(JSON.stringify({
        success: false,
        message: 'Ungültige Anfrage: JSON-Parsing fehlgeschlagen',
        version: 'Contact API v17.7',
        error: parseError.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📥 Empfangene Daten v17.7:', {
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
      console.log('🚫 Honeypot-Schutz aktiviert v17.7 - Bot erkannt');
      return new Response(JSON.stringify({
        success: false,
        message: 'Spam erkannt',
        version: 'Contact API v17.7'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Server-seitige Validierung
    const errors = [];
    
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
      console.log('❌ Validierungsfehler v17.7:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Validierungsfehler: ' + errors.join(', '),
        errors: errors,
        version: 'Contact API v17.7'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Daten für Speicherung vorbereiten
    const contactData = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message?.trim() || '',
      gdprConsent: data.gdprConsent,
      leadForm: data.leadForm || false,
      honeypot: data.honeypot || '',
      timestamp: new Date().toISOString()
    };

    // Erstmal ohne Datenbank - einfach loggen
    console.log('✅ Kontakt-Daten verarbeitet v17.7:', contactData);
    
    // TODO: Hier später Datenbank-Speicherung hinzufügen
    // const contactId = await saveContact(contactData);
    
    // TODO: E-Mail versenden (falls gewünscht)
    // await sendConfirmationEmail(contactData);
    // await sendNotificationEmail(contactData);

    console.log('🎉 Kontaktanfrage erfolgreich verarbeitet v17.7');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v17.7',
      timestamp: new Date().toISOString(),
      receivedData: {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ CONTACT API ERROR v17.7:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      version: 'Contact API v17.7',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}