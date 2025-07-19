// src/pages/api/admin/contacts.js v2.0 (TypeScript database integration)
import { getContacts } from '../../../lib/database.ts';

console.log('📋 Admin Contacts API v2.0 loaded');

// Session-Validierung
function isAuthenticated(cookies) {
  const sessionToken = cookies.get('admin_session')?.value;
  return !!sessionToken; // Erweiterte Validierung später
}

export async function GET({ cookies }) {
  console.log('=== ADMIN CONTACTS API v2.0 CALLED ===');
  
  try {
    // Authentifizierung prüfen
    if (!isAuthenticated(cookies)) {
      console.log('❌ Nicht authentifiziert');
      return new Response(JSON.stringify({
        success: false,
        message: 'Nicht authentifiziert',
        version: 'Admin Contacts API v2.0'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Authentifiziert - lade Kontakte aus Datenbank');

    // Kontakte aus der Datenbank laden
    const contacts = await getContacts();
    
    console.log('📊 Kontakte geladen:', contacts.length);

    return new Response(JSON.stringify({
      success: true,
      contacts: contacts,
      version: 'Admin Contacts API v2.0',
      count: contacts.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Fehler beim Laden der Kontakte (v2.0):', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Fehler beim Laden der Kontakte',
      version: 'Admin Contacts API v2.0',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}