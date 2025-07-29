// src/pages/api/mysql-debug.js - MySQL Connection Debug
// ✅ ZWECK: MySQL-Verbindung testen und detaillierte Fehlermeldungen
// ✅ SICHERHEIT: Nur für Development/Testing

export const prerender = false;

console.log('🔍 MySQL Debug API loaded');

export async function GET({ request }) {
  console.log('=== MYSQL DEBUG TEST STARTED ===');
  
  const debugResults = {
    timestamp: new Date().toISOString(),
    environment: {},
    connectionAttempts: [],
    finalResult: null
  };
  
  try {
    // ✅ 1. ENVIRONMENT VARIABLES PRÜFEN
    console.log('📋 Step 1: Checking Environment Variables');
    
    debugResults.environment = {
      DB_HOST: process.env.DB_HOST ? '✅ Set' : '❌ Missing',
      DB_HOST_VALUE: process.env.DB_HOST ? process.env.DB_HOST.substring(0, 20) + '...' : 'undefined',
      DB_USER: process.env.DB_USER ? '✅ Set' : '❌ Missing',
      DB_USER_VALUE: process.env.DB_USER || 'undefined',
      DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Set (length: ' + process.env.DB_PASSWORD.length + ')' : '❌ Missing',
      DB_NAME: process.env.DB_NAME ? '✅ Set' : '❌ Missing',
      DB_NAME_VALUE: process.env.DB_NAME || 'undefined',
      DB_PORT: process.env.DB_PORT || '3306 (default)'
    };
    
    console.log('📋 Environment Variables:', debugResults.environment);
    
    // ✅ 2. MYSQL2 IMPORT TEST
    console.log('📦 Step 2: Testing MySQL2 Import');
    
    let mysql;
    try {
      mysql = await import('mysql2/promise');
      debugResults.connectionAttempts.push({
        step: 'mysql2_import',
        status: '✅ Success',
        message: 'mysql2 library imported successfully'
      });
      console.log('✅ MySQL2 import successful');
    } catch (importError) {
      debugResults.connectionAttempts.push({
        step: 'mysql2_import',
        status: '❌ Failed',
        error: importError.message
      });
      throw new Error(`MySQL2 import failed: ${importError.message}`);
    }
    
    // ✅ 3. CONNECTION CONFIG TEST
    console.log('⚙️ Step 3: Testing Connection Config');
    
    const connectionConfig = {
      host: process.env.DB_HOST || 'database-5017670143.webspace-host.com',
      user: process.env.DB_USER || 'dbu5377946',
      password: process.env.DB_PASSWORD || 'MaierValue#2025',
      database: process.env.DB_NAME || 'dbs14130950',
      port: parseInt(process.env.DB_PORT) || 3306,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      timeout: 10000,
      ssl: false,
      charset: 'utf8mb4'
    };
    
    debugResults.connectionAttempts.push({
      step: 'config_prepared',
      status: '✅ Success',
      config: {
        host: connectionConfig.host,
        user: connectionConfig.user,
        database: connectionConfig.database,
        port: connectionConfig.port,
        passwordLength: connectionConfig.password?.length || 0
      }
    });
    
    // ✅ 4. BASIC CONNECTION TEST
    console.log('🔗 Step 4: Testing Basic Connection');
    
    try {
      const connection = await mysql.createConnection(connectionConfig);
      
      debugResults.connectionAttempts.push({
        step: 'basic_connection',
        status: '✅ Success',
        message: 'Basic connection established'
      });
      
      console.log('✅ Basic connection successful');
      
      // ✅ 5. PING TEST
      console.log('🏓 Step 5: Testing Ping');
      
      try {
        await connection.ping();
        debugResults.connectionAttempts.push({
          step: 'ping_test',
          status: '✅ Success',
          message: 'Database ping successful'
        });
        console.log('✅ Ping successful');
      } catch (pingError) {
        debugResults.connectionAttempts.push({
          step: 'ping_test',
          status: '❌ Failed',
          error: pingError.message,
          code: pingError.code,
          errno: pingError.errno
        });
        throw pingError;
      }
      
      // ✅ 6. DATABASE INFO TEST
      console.log('📊 Step 6: Testing Database Info');
      
      try {
        const [rows] = await connection.execute(`
          SELECT 
            DATABASE() as current_database,
            VERSION() as mysql_version,
            USER() as current_user,
            NOW() as server_time
        `);
        
        debugResults.connectionAttempts.push({
          step: 'database_info',
          status: '✅ Success',
          data: rows[0]
        });
        
        console.log('✅ Database info retrieved:', rows[0]);
      } catch (infoError) {
        debugResults.connectionAttempts.push({
          step: 'database_info',
          status: '❌ Failed',
          error: infoError.message,
          code: infoError.code,
          errno: infoError.errno
        });
        throw infoError;
      }
      
      // ✅ 7. TABLES CHECK
      console.log('🗂️ Step 7: Checking Tables');
      
      try {
        const [tables] = await connection.execute(`
          SELECT table_name, table_rows 
          FROM information_schema.tables 
          WHERE table_schema = ?
          ORDER BY table_name
        `, [connectionConfig.database]);
        
        debugResults.connectionAttempts.push({
          step: 'tables_check',
          status: '✅ Success',
          tables: tables.map(t => ({ name: t.table_name, rows: t.table_rows }))
        });
        
        console.log('✅ Tables found:', tables.length);
      } catch (tablesError) {
        debugResults.connectionAttempts.push({
          step: 'tables_check',
          status: '❌ Failed',
          error: tablesError.message,
          code: tablesError.code,
          errno: tablesError.errno
        });
        throw tablesError;
      }
      
      // ✅ 8. CONNECTION POOL TEST
      console.log('🏊 Step 8: Testing Connection Pool');
      
      try {
        const pool = mysql.createPool({
          ...connectionConfig,
          connectionLimit: 2,
          acquireTimeout: 5000,
          timeout: 5000
        });
        
        const poolConnection = await pool.getConnection();
        await poolConnection.ping();
        poolConnection.release();
        await pool.end();
        
        debugResults.connectionAttempts.push({
          step: 'connection_pool',
          status: '✅ Success',
          message: 'Connection pool test successful'
        });
        
        console.log('✅ Connection pool test successful');
      } catch (poolError) {
        debugResults.connectionAttempts.push({
          step: 'connection_pool',
          status: '❌ Failed',
          error: poolError.message,
          code: poolError.code,
          errno: poolError.errno
        });
        throw poolError;
      }
      
      // ✅ CONNECTION CLEANUP
      await connection.end();
      
      debugResults.finalResult = {
        status: '✅ ALL TESTS PASSED',
        message: 'MySQL connection is working perfectly',
        recommendation: 'MySQL should work in production'
      };
      
    } catch (connectionError) {
      debugResults.connectionAttempts.push({
        step: 'basic_connection',
        status: '❌ Failed',
        error: connectionError.message,
        code: connectionError.code,
        errno: connectionError.errno,
        sqlState: connectionError.sqlState,
        sqlMessage: connectionError.sqlMessage
      });
      
      // ✅ SPECIFIC ERROR ANALYSIS
      let errorAnalysis = 'Unknown connection error';
      let recommendation = 'Check configuration';
      
      if (connectionError.code === 'ER_ACCESS_DENIED_ERROR') {
        errorAnalysis = 'Username or password incorrect';
        recommendation = 'Verify DB_USER and DB_PASSWORD in environment variables';
      } else if (connectionError.code === 'ENOTFOUND' || connectionError.code === 'ECONNREFUSED') {
        errorAnalysis = 'Database server not reachable';
        recommendation = 'Verify DB_HOST is correct and server is running';
      } else if (connectionError.code === 'ER_BAD_DB_ERROR') {
        errorAnalysis = 'Database name does not exist';
        recommendation = 'Verify DB_NAME is correct';
      } else if (connectionError.code === 'ETIMEDOUT') {
        errorAnalysis = 'Connection timeout - server too slow or unreachable';
        recommendation = 'Check network or increase timeout values';
      }
      
      debugResults.finalResult = {
        status: '❌ CONNECTION FAILED',
        error: connectionError.message,
        code: connectionError.code,
        analysis: errorAnalysis,
        recommendation: recommendation
      };
      
      throw connectionError;
    }
    
  } catch (error) {
    console.error('❌ MySQL Debug Test Failed:', error);
    
    if (!debugResults.finalResult) {
      debugResults.finalResult = {
        status: '❌ GENERAL ERROR',
        error: error.message,
        recommendation: 'Check logs for detailed error information'
      };
    }
  }
  
  // ✅ RETURN COMPREHENSIVE DEBUG INFO
  return new Response(JSON.stringify({
    debug: 'MySQL Connection Debug Report',
    version: '1.0',
    timestamp: debugResults.timestamp,
    
    // Environment Info
    environment: debugResults.environment,
    
    // Step by Step Results
    connectionAttempts: debugResults.connectionAttempts,
    
    // Final Result
    result: debugResults.finalResult,
    
    // Next Steps
    nextSteps: debugResults.finalResult?.status?.includes('✅') ? [
      'MySQL connection is working',
      'Check why contact.js is not connecting',
      'Verify timeout settings in production'
    ] : [
      'Fix the identified connection issue',
      'Verify environment variables in Netlify',
      'Check Strato database configuration',
      'Test connection again'
    ]
    
  }, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'X-Debug-Test': 'MySQL-Connection'
    }
  });
}