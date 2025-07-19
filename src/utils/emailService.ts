// src/utils/emailService.ts
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  gdprConsent: boolean;
  leadForm: boolean;
  honeypot: string;
}

// E-Mail-Transporter konfigurieren
function createTransporter() {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.strato.de',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true für 465, false für andere Ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Zusätzliche Optionen für bessere Kompatibilität
    tls: {
      rejectUnauthorized: false, // Für Entwicklung, in Produktion auf true setzen
    },
  });

  return transporter;
}

// E-Mail-Template für Kontaktformular
function createEmailTemplate(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neue Kontaktanfrage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f4f4f4;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 15px;
      padding: 10px;
      background-color: #f9f9f9;
      border-left: 4px solid #007bff;
    }
    .field strong {
      color: #007bff;
    }
    .message {
      background-color: #fff;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📧 Neue Kontaktanfrage</h1>
    <p>Sie haben eine neue Nachricht über das Kontaktformular erhalten.</p>
  </div>

  <div class="field">
    <strong>Name:</strong><br>
    ${data.name}
  </div>

  <div class="field">
    <strong>E-Mail:</strong><br>
    <a href="mailto:${data.email}">${data.email}</a>
  </div>

  <div class="field">
    <strong>Telefon:</strong><br>
    <a href="tel:${data.phone}">${data.phone}</a>
  </div>

  <div class="field">
    <strong>Nachricht:</strong><br>
    <div class="message">${data.message}</div>
  </div>

  <div class="field">
    <strong>DSGVO-Zustimmung:</strong><br>
    ${data.gdprConsent ? '✅ Erteilt' : '❌ Nicht erteilt'}
  </div>

  <div class="footer">
    <p>Diese E-Mail wurde automatisch über das Kontaktformular von maier-value.com gesendet.</p>
    <p>Empfangen am: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>
  </div>
</body>
</html>
  `.trim();
}

// Hauptfunktion zum Versenden der E-Mail
export async function sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log('=== STARTING EMAIL SEND ===');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.SMTP_USER,
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO
    });

    // Transporter erstellen
    const transporter = createTransporter();

    // Verbindung testen
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // E-Mail-Optionen
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM}" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Neue Kontaktanfrage von ${formData.name}`,
      html: createEmailTemplate(formData),
      // Zusätzlich Text-Version für bessere Kompatibilität
      text: `
Neue Kontaktanfrage

Name: ${formData.name}
E-Mail: ${formData.email}
Telefon: ${formData.phone}

Nachricht:
${formData.message}

DSGVO-Zustimmung: ${formData.gdprConsent ? 'Erteilt' : 'Nicht erteilt'}

Empfangen am: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}
      `.trim()
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // E-Mail senden
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    console.log('Email info:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    return {
      success: true,
      message: 'E-Mail erfolgreich gesendet',
    };

  } catch (error) {
    console.error('=== EMAIL SEND ERROR ===');
    console.error('Error details:', error);
    
    let errorMessage = 'Unbekannter E-Mail-Fehler';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return {
      success: false,
      message: 'E-Mail konnte nicht gesendet werden',
      error: errorMessage
    };
  }
}

// Bestätigungs-E-Mail an den Kunden (optional)
export async function sendConfirmationEmail(formData: ContactFormData): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log('=== SENDING CONFIRMATION EMAIL ===');
    
    const transporter = createTransporter();

    const confirmationTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bestätigung Ihrer Kontaktanfrage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #007bff;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Vielen Dank für Ihre Kontaktanfrage!</h1>
  </div>

  <div class="content">
    <p>Hallo ${formData.name},</p>
    
    <p>vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
    
    <p><strong>Ihre Anfrage:</strong></p>
    <blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0;">
      ${formData.message}
    </blockquote>
    
    <p>Bei Rückfragen können Sie uns jederzeit unter <a href="mailto:${process.env.EMAIL_TO}">${process.env.EMAIL_TO}</a> erreichen.</p>
    
    <p>Mit freundlichen Grüßen<br>
    ${process.env.EMAIL_FROM}<br>
    Maier Value</p>
  </div>

  <div class="footer">
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
    `.trim();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM}" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: 'Bestätigung Ihrer Kontaktanfrage - Maier Value',
      html: confirmationTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);

    return {
      success: true,
      message: 'Bestätigungs-E-Mail gesendet'
    };

  } catch (error) {
    console.error('Confirmation email error:', error);
    
    return {
      success: false,
      message: 'Bestätigungs-E-Mail konnte nicht gesendet werden',
      error: error instanceof Error ? error.message : 'Unbekannter Fehler'
    };
  }
}