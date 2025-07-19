// src/pages/contact.js v17.4 (FormData approach - Dev-Server fix)

console.log('📧 Contact API v17.4 loaded (FormData approach)');

export async function POST({ request }) {
  console.log('=== CONTACT API v17.4 CALLED ===');
  
  try {
    console.log('🔍 Request details:');
    console.log('- Content-Type:', request.headers.get('Content-Type'));
    console.log('- Method:', request.method);
    console.log('- URL:', request.url);

    let data;
    const contentType = request.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      // JSON-Ansatz
      try {
        const rawBody = await request.text();
        console.log('📥 Raw JSON body:', rawBody);
        
        if (!rawBody || rawBody.trim() === '') {
          throw new Error('Empty JSON body');
        }
        
        data = JSON.parse(rawBody);
        console.log('✅ JSON parsed successfully');
      } catch (jsonError) {
        console.error('❌ JSON approach failed:', jsonError.message);
        return new Response(JSON.stringify({
          success: false,
          message: 'JSON-Parsing fehlgeschlagen. Versuchen Sie es erneut.',
          version: 'Contact API v17.4',
          error: 'JSON Parse Error',
          debug: jsonError.message
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // FormData-Ansatz als Fallback
      try {
        const formData = await request.formData();
        console.log('📥 FormData received');
        
        data = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message') || '',
          gdprConsent: formData.get('gdprConsent') === 'true' || formData.get('gdprConsent') === 'on',
          leadForm: false,
          honeypot: formData.get('honeypot') || ''
        };
        console.log('✅ FormData parsed successfully');
      } catch (formError) {
        console.error('❌ FormData approach failed:', formError.message);
        return new Response(JSON.stringify({
          success: false,
          message: 'Datenübertragung fehlgeschlagen.',
          version: 'Contact API v17.4',
          error: 'Request Parse Error'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('📥 Final parsed data:', {
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
      console.log('🚫 Honeypot-Schutz aktiviert - Bot erkannt');
      return new Response(JSON.stringify({
        success: false,
        message: 'Spam erkannt',
        version: 'Contact API v17.4'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Server-seitige Validierung
    const errors = [];
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Name muss mindestens 2 Zeichen lang sein');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
      errors.push('Gültige E-Mail-Adresse erforderlich');
    }
    
    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 6) {
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
        version: 'Contact API v17.4'
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
      timestamp: new Date().toISOString()
    };

    console.log('✅ Kontakt-Daten final verarbeitet:', contactData);
    
    // Erfolgreiche Antwort
    const successResponse = {
      success: true,
      message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
      version: 'Contact API v17.4',
      timestamp: new Date().toISOString(),
      receivedData: {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        hasMessage: !!contactData.message
      }
    };

    console.log('🎉 Sending success response:', successResponse);
    
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ CONTACT API CRITICAL ERROR:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      version: 'Contact API v17.4',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}