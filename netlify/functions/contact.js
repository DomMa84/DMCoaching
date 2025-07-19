// netlify/functions/contact.js - Netlify Function for contact form
exports.handler = async (event, context) => {
  console.log('=== NETLIFY CONTACT FUNCTION v1.0 ===');
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('📥 Received data:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      hasMessage: !!data.message,
      gdprConsent: data.gdprConsent,
      leadForm: data.leadForm,
      honeypot: data.honeypot
    });

    // Honeypot protection
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('🚫 Honeypot protection activated - Bot detected');
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Spam detected'
        })
      };
    }

    // Server-side validation
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
      console.log('❌ Validation errors:', errors);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Validierungsfehler: ' + errors.join(', '),
          errors: errors
        })
      };
    }

    // Clean form data
    const contactData = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message?.trim() || '',
      gdprConsent: data.gdprConsent,
      leadForm: data.leadForm || false,
      honeypot: data.honeypot || ''
    };

    // For now, we'll just log the data and return success
    // In a real implementation, you would:
    // 1. Send email using a service like SendGrid, Mailgun, or Nodemailer
    // 2. Save to a database
    // 3. Send to a CRM system
    
    console.log('✅ Contact form submission processed:', contactData);

    // TODO: Implement email sending
    // TODO: Implement database storage
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.',
        version: 'Netlify Contact Function v1.0'
      })
    };

  } catch (error) {
    console.error('❌ CONTACT FUNCTION ERROR:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
      })
    };
  }
};