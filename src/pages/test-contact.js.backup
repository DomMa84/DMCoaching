// src/pages/test-contact.js v1.0 (Server-Mode API optimiert)
// Test-Contact API - Dynamic endpoint für Debugging

// ✅ WICHTIG: Für Server-Mode - diese API muss dynamisch sein
export const prerender = false;

console.log('🧪 Test-Contact API v1.0 loaded - Dynamic endpoint for debugging');

/**
 * GET Handler - API Status und Debugging
 * Test-URL: /test-contact
 */
export async function GET({ request, url, clientAddress, locals }) {
  const startTime = Date.now();
  
  try {
    // Enhanced debugging information
    const debugInfo = {
      message: '✅ Test-Contact API funktioniert!',
      version: 'v1.0',
      timestamp: new Date().toISOString(),
      url: request.url,
      method: 'GET',
      userAgent: request.headers.get('user-agent'),
      clientIP: clientAddress || 'unknown',
      referer: request.headers.get('referer') || 'direct',
      host: request.headers.get('host'),
      protocol: url.protocol,
      searchParams: Object.fromEntries(url.searchParams),
      responseTime: `${Date.now() - startTime}ms`,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        netlify: !!process.env.NETLIFY,
        platform: process.platform
      },
      headers: {
        'accept': request.headers.get('accept'),
        'accept-language': request.headers.get('accept-language'),
        'accept-encoding': request.headers.get('accept-encoding')
      }
    };

    console.log('📊 Test-Contact GET request:', {
      url: request.url,
      userAgent: debugInfo.userAgent,
      clientIP: debugInfo.clientIP,
      timestamp: debugInfo.timestamp
    });

    return new Response(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ Test-Contact GET Error:', error);
    
    return new Response(JSON.stringify({
      message: '❌ Test-Contact API Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      version: 'v1.0'
    }, null, 2), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

/**
 * POST Handler - Form submission testing
 * Test mit: fetch('/test-contact', { method: 'POST', body: JSON.stringify({test: 'data'}) })
 */
export async function POST({ request, clientAddress }) {
  const startTime = Date.now();
  
  try {
    let requestData;
    const contentType = request.headers.get('content-type') || '';
    
    // Handle different content types
    if (contentType.includes('application/json')) {
      requestData = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      requestData = Object.fromEntries(formData);
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      requestData = Object.fromEntries(formData);
    } else {
      const text = await request.text();
      requestData = { rawData: text, contentType };
    }

    const response = {
      message: '✅ POST funktioniert perfekt!',
      version: 'v1.0',
      timestamp: new Date().toISOString(),
      received: requestData,
      meta: {
        contentType: contentType,
        contentLength: request.headers.get('content-length'),
        userAgent: request.headers.get('user-agent'),
        clientIP: clientAddress || 'unknown',
        responseTime: `${Date.now() - startTime}ms`,
        dataSize: JSON.stringify(requestData).length + ' bytes'
      },
      validation: {
        hasData: !!requestData && Object.keys(requestData).length > 0,
        dataType: typeof requestData,
        fieldsCount: typeof requestData === 'object' ? Object.keys(requestData).length : 0
      }
    };

    console.log('📝 Test-Contact POST request:', {
      contentType,
      dataReceived: !!requestData,
      fieldsCount: response.validation.fieldsCount,
      clientIP: clientAddress,
      timestamp: response.timestamp
    });

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ Test-Contact POST Error:', error);
    
    return new Response(JSON.stringify({
      message: '❌ POST Error - Daten konnten nicht verarbeitet werden',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      version: 'v1.0',
      debug: {
        contentType: request.headers.get('content-type'),
        contentLength: request.headers.get('content-length'),
        userAgent: request.headers.get('user-agent')
      }
    }, null, 2), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

/**
 * OPTIONS Handler - CORS preflight
 */
export async function OPTIONS({ request }) {
  console.log('🔄 Test-Contact OPTIONS request for CORS preflight');
  
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400' // 24 hours
    }
  });
}

/**
 * Fallback für andere HTTP Methods
 */
export async function ALL({ request }) {
  console.log(`🚫 Test-Contact unsupported method: ${request.method}`);
  
  return new Response(JSON.stringify({
    message: `❌ Method ${request.method} not allowed`,
    allowedMethods: ['GET', 'POST', 'OPTIONS'],
    timestamp: new Date().toISOString(),
    version: 'v1.0'
  }, null, 2), {
    status: 405,
    headers: { 
      'Content-Type': 'application/json',
      'Allow': 'GET, POST, OPTIONS'
    }
  });
}