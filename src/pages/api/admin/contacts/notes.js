// src/pages/api/admin/contacts/notes.js v2.0 (TypeScript database integration)
import { updateContactNotes } from '../../../../lib/database.ts';

console.log('📝 Admin Notes API v2.0 loaded');

function isAuthenticated(cookies) {
  const sessionToken = cookies.get('admin_session')?.value;
  return !!sessionToken;
}

export async function POST({ request, cookies }) {
  console.log('=== ADMIN NOTES API v2.0 CALLED ===');
  
  try {
    if (!isAuthenticated(cookies)) {
      console.log('❌ Nicht authentifiziert');
      return new Response(JSON.stringify({
        success: false,
        message: 'Nicht authentifiziert',
        version: 'Admin Notes API v2.0'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id, notes } = await request.json();
    
    console.log('📝 Notes-Update-Anfrage:', { id, notesLength: notes?.length || 0 });

    if (!id) {
      console.log('❌ Fehlende ID');
      return new Response(JSON.stringify({
        success: false,
        message: 'ID ist erforderlich',
        version: 'Admin Notes API v2.0'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await updateContactNotes(id, notes || '');
    
    console.log('✅ Notizen erfolgreich aktualisiert');

    return new Response(JSON.stringify({
      success: true,
      message: 'Notizen erfolgreich aktualisiert',
      version: 'Admin Notes API v2.0'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Notizen (v2.0):', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Fehler beim Aktualisieren der Notizen',
      version: 'Admin Notes API v2.0',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}