// src/pages/api/admin/logout.js

export async function POST({ cookies }) {
  try {
    // Clear the session cookie
    cookies.delete('admin_session', {
      path: '/'
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Erfolgreich abgemeldet'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Fehler beim Abmelden'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}