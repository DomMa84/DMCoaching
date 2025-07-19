// src/pages/api/admin/contacts/update.js v2.0 (TypeScript database integration)
import { updateContactStatus } from '../../../../lib/database.ts';

console.log('🔄 Admin Update API v2.0 loaded');

function isAuthenticated(cookies) {
  const sessionToken = cookies.get('admin_session')?.value;
  return !!sessionToken;
}

export async function POST({ request, cookies }) {
  console.log('=== ADMIN UPDATE API v2.0 CALLED ===');
  
  try {
    if (!isAuthenticated(cookies)) {
      console.log('❌ Nicht authentifiziert');
      return new Response(JSON.stringify({
        success: false,
        message: 'Nicht authentifiziert',
        version: 'Admin Update API v2.0'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id, status } = await request.json();
    
    console.log('📝 Update-Anfrage:', { id, status });

    if (!id || !status) {
      console.log('❌ Fehlende Parameter');
      return new Response(JSON.stringify({
        success: false,
        message: 'ID und Status sind erforderlich',
        version: 'Admin Update API v2.0'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validiere Status
    const validStatuses = ['neu', 'offen', 'abgeschlossen'];
    if (!validStatuses.includes(status)) {
      console.log('❌ Ungültiger Status:', status);
      return new Response(JSON.stringify({
        success: false,
        message: 'Ungültiger Status',
        version: 'Admin Update API v2.0'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await updateContactStatus(id, status);
    
    console.log('✅ Status erfolgreich aktualisiert');

    return new Response(JSON.stringify({
      success: true,
      message: 'Status erfolgreich aktualisiert',
      version: 'Admin Update API v2.0'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren des Status (v2.0):', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Fehler beim Aktualisieren des Status',
      version: 'Admin Update API v2.0',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}