// src/pages/api/admin/check-session.js

export async function GET({ cookies }) {
  try {
    const sessionToken = cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return new Response(JSON.stringify({
        authenticated: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In einer echten Anwendung würden wir hier das Token validieren
    // Für jetzt akzeptieren wir jedes vorhandene Token
    
    return new Response(JSON.stringify({
      authenticated: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return new Response(JSON.stringify({
      authenticated: false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Logout-Funktion wird in separater Datei erstellt