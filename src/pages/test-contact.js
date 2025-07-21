// src/pages/test-contact.js - Simple test endpoint

export const prerender = false;

export async function GET({ request }) {
  return new Response(JSON.stringify({
    message: 'Test-Contact API funktioniert!',
    timestamp: new Date().toISOString(),
    url: request.url
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    return new Response(JSON.stringify({
      message: 'POST funktioniert!',
      received: data,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      message: 'POST Error',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}