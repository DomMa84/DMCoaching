// src/pages/contact.js v17.5 (Server-rendered)

// ✅ Server-Rendering aktivieren
export const prerender = false;

console.log('📧 Contact API v17.5 loaded (Server-rendered)');

export async function POST({ request }) {
  console.log('=== CONTACT API v17.5 CALLED (Server-rendered) ===');
  
  try {
    // ✅ Direktes JSON-Parsing (sollte jetzt funktionieren)
    const data = await request.json();
    console.log('📥 Data received:', data);

    // Validierung
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name muss mindestens 2 Zeichen lang sein');
    }
    
    // ✅ Verbesserte E-Mail-Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
      console.log('❌ Validierungsfehler:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Validierungsfehler: ' + errors.join(', '),
        errors: errors,
        version: 'Contact API v17.5 (Server-rendered)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Honeypot-Schutz
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('🚫 Bot erkannt');
      return new Response(JSON.stringify({
        success: false,
        message: 'Spam erkannt'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Kontakt-Daten verarbeiten
    const contactData = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message?.trim() || '',
      gdprConsent: data.gdprConsent,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Kontakt erfolgreich verarbeitet:', contactData);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v17.5 (Server-rendered)',
      timestamp: contactData.timestamp
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Contact API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      version: 'Contact API v17.5 (Server-rendered)',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}