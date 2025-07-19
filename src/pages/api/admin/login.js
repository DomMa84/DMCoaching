// src/pages/api/admin/login.js - Login API mit ENV credentials v2.0

// ✅ WICHTIG: Server-Rendering für Build aktivieren
export const prerender = false;

console.log('🔐 Admin Login API v2.0 loaded (Build-ready)');

export async function POST({ request }) {
  console.log('=== ADMIN LOGIN API CALLED ===');
  
  try {
    const data = await request.json();
    console.log('📥 Login attempt for username:', data.username);

    // Validierung
    if (!data.username || !data.password) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Benutzername und Passwort erforderlich'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ ENV-Variablen aus Umgebung lesen
    const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    console.log('🔍 ENV check:', {
      hasUsername: !!ADMIN_USERNAME,
      hasPassword: !!ADMIN_PASSWORD,
      providedUsername: data.username
    });

    // Login-Prüfung
    if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
      console.log('✅ Login successful');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Login erfolgreich',
        user: {
          username: data.username,
          role: 'admin'
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.log('❌ Login failed - invalid credentials');
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Ungültige Anmeldedaten'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('❌ Admin Login API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Serverfehler beim Login'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}