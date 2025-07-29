// src/lib/mysqlService.js v1.0 - Strato MySQL Integration
// MySQL Database Service - Echte Datenbank-Integration
// ✅ ZWECK: MySQL-Verbindung zu Strato Database
// ✅ FEATURES: Connection Pooling, CRUD Operations, Migration Support
// ✅ KONFIGURATION: Strato MySQL Credentials

console.log('🗄️ MySQL Service v1.0 loaded - Strato Database Integration');

// ✅ MYSQL KONFIGURATION (aus .env)
const MYSQL_CONFIG = {
  host: process.env.DB_HOST || 'database-5017670143.webspace-host.com',
  user: process.env.DB_USER || 'dbu5377946',
  password: process.env.DB_PASSWORD || 'MaierValue#2025',
  database: process.env.DB_NAME || 'dbs14130950',
  port: parseInt(process.env.DB_PORT) || 3306,
  
  // Connection Pool Settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  
  // SSL Settings (für Strato)
  ssl: false // Strato verwendet meist kein SSL für interne Verbindungen
};

console.log('🗄️ MySQL Config loaded:', {
  host: MYSQL_CONFIG.host,
  user: MYSQL_CONFIG.user,
  database: MYSQL_CONFIG.database,
  port: MYSQL_CONFIG.port
});

let mysqlPool = null;

/**
 * Erstellt MySQL Connection Pool
 * @returns {Object} MySQL Pool oder null
 */
async function createMySQLPool() {
  try {
    console.log('🔗 Creating MySQL connection pool for Strato...');
    
    // ✅ MySQL2 dynamisch importieren (Build-kompatibel)
    const mysql = await import('mysql2/promise');
    
    mysqlPool = mysql.createPool(MYSQL_CONFIG);
    
    // Connection Test
    const connection = await mysqlPool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('✅ MySQL Pool created successfully - Strato Database connected');
    return mysqlPool;
    
  } catch (error) {
    console.error('❌ MySQL Pool creation failed:', error.message);
    mysqlPool = null;
    return null;
  }
}

/**
 * MySQL Connection Pool abrufen (mit Lazy Loading)
 * @returns {Object} MySQL Pool
 */
async function getMySQLPool() {
  if (!mysqlPool) {
    await createMySQLPool();
  }
  return mysqlPool;
}

/**
 * Test MySQL-Verbindung
 * @returns {Object} Connection Status
 */
export async function testMySQLConnection() {
  console.log('🔍 Testing MySQL connection to Strato...');
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL Pool could not be created');
    }
    
    const connection = await pool.getConnection();
    
    // Database Info abrufen
    const [rows] = await connection.execute(`
      SELECT 
        DATABASE() as current_database,
        VERSION() as mysql_version,
        NOW() as server_time,
        CONNECTION_ID() as connection_id
    `);
    
    // Tabellen prüfen
    const [tables] = await connection.execute(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [MYSQL_CONFIG.database]);
    
    connection.release();
    
    console.log('✅ MySQL connection test successful:', {
      database: rows[0].current_database,
      version: rows[0].mysql_version,
      tables: tables[0].table_count
    });
    
    return {
      success: true,
      database: rows[0].current_database,
      version: rows[0].mysql_version,
      serverTime: rows[0].server_time,
      connectionId: rows[0].connection_id,
      tableCount: tables[0].table_count,
      config: {
        host: MYSQL_CONFIG.host,
        database: MYSQL_CONFIG.database,
        user: MYSQL_CONFIG.user
      }
    };
    
  } catch (error) {
    console.error('❌ MySQL connection test failed:', error);
    
    return {
      success: false,
      error: error.message,
      config: {
        host: MYSQL_CONFIG.host,
        database: MYSQL_CONFIG.database,
        user: MYSQL_CONFIG.user
      }
    };
  }
}

/**
 * Kontakt in MySQL erstellen
 * @param {Object} contactData - Kontaktdaten
 * @returns {Object} Ersteller Kontakt mit ID
 */
export async function createContactMySQL(contactData) {
  console.log('💾 Creating contact in MySQL:', contactData.name);
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL connection not available');
    }
    
    const connection = await pool.getConnection();
    
    try {
      // ✅ INSERT Contact
      const [result] = await connection.execute(`
        INSERT INTO contacts (
          name, email, phone, message, status, notes, lead_form, processed,
          source, gdpr_consent, gdpr_consent_timestamp, 
          user_agent, ip_address, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        contactData.name,
        contactData.email,
        contactData.phone,
        contactData.message || '',
        'neu',
        '',
        contactData.leadForm || false,
        false,
        contactData.source || 'Website-Kontaktformular',
        contactData.gdprConsent || false,
        new Date(),
        contactData.userAgent || 'Unknown',
        contactData.ipAddress || 'Unknown'
      ]);
      
      const contactId = result.insertId;
      
      // ✅ Kontakt mit ID zurück abrufen
      const [contacts] = await connection.execute(`
        SELECT * FROM contacts WHERE id = ?
      `, [contactId]);
      
      console.log('✅ Contact created in MySQL with ID:', contactId);
      
      return {
        success: true,
        contact: contacts[0],
        id: contactId
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error creating contact in MySQL:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Alle Kontakte aus MySQL abrufen
 * @param {Object} options - Query Optionen
 * @returns {Array} Kontakte-Array
 */
export async function getContactsMySQL(options = {}) {
  console.log('📋 Fetching contacts from MySQL');
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL connection not available');
    }
    
    const connection = await pool.getConnection();
    
    try {
      let query = `
        SELECT * FROM contacts 
        WHERE deleted_at IS NULL
      `;
      let params = [];
      
      // ✅ Filter Optionen
      if (options.status) {
        query += ` AND status = ?`;
        params.push(options.status);
      }
      
      if (options.leadForm !== undefined) {
        query += ` AND lead_form = ?`;
        params.push(options.leadForm);
      }
      
      // ✅ Sortierung
      query += ` ORDER BY created_at DESC`;
      
      // ✅ Limit
      if (options.limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(options.limit));
      }
      
      const [contacts] = await connection.execute(query, params);
      
      console.log(`✅ Fetched ${contacts.length} contacts from MySQL`);
      
      return {
        success: true,
        contacts: contacts,
        count: contacts.length
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error fetching contacts from MySQL:', error);
    
    return {
      success: false,
      error: error.message,
      contacts: []
    };
  }
}

/**
 * Kontakt in MySQL aktualisieren
 * @param {number} contactId - Kontakt ID
 * @param {Object} updateData - Update-Daten
 * @returns {Object} Update-Ergebnis
 */
export async function updateContactMySQL(contactId, updateData) {
  console.log('📝 Updating contact in MySQL:', contactId);
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL connection not available');
    }
    
    const connection = await pool.getConnection();
    
    try {
      // ✅ Dynamic UPDATE Query erstellen
      const updateFields = [];
      const params = [];
      
      if (updateData.status) {
        updateFields.push('status = ?');
        params.push(updateData.status);
      }
      
      if (updateData.notes !== undefined) {
        updateFields.push('notes = ?');
        params.push(updateData.notes);
      }
      
      if (updateData.processed !== undefined) {
        updateFields.push('processed = ?');
        params.push(updateData.processed);
      }
      
      if (updateFields.length === 0) {
        throw new Error('No update fields provided');
      }
      
      updateFields.push('updated_at = NOW()');
      params.push(contactId);
      
      const query = `
        UPDATE contacts 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      
      const [result] = await connection.execute(query, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Contact not found or no changes made');
      }
      
      // ✅ Aktualisierten Kontakt abrufen
      const [contacts] = await connection.execute(`
        SELECT * FROM contacts WHERE id = ?
      `, [contactId]);
      
      console.log('✅ Contact updated in MySQL:', contactId);
      
      return {
        success: true,
        contact: contacts[0],
        affectedRows: result.affectedRows
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error updating contact in MySQL:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Kontakt-Statistiken aus MySQL abrufen
 * @returns {Object} Statistiken
 */
export async function getContactStatsMySQL() {
  console.log('📊 Fetching contact statistics from MySQL');
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL connection not available');
    }
    
    const connection = await pool.getConnection();
    
    try {
      // ✅ Verwende die Statistics View
      const [stats] = await connection.execute(`
        SELECT * FROM contact_statistics
      `);
      
      // ✅ Zusätzliche Statistiken
      const [recent] = await connection.execute(`
        SELECT COUNT(*) as recent_count
        FROM contacts 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND deleted_at IS NULL
      `);
      
      console.log('✅ Contact statistics fetched from MySQL');
      
      const statistics = stats[0] || {
        total_contacts: 0,
        neu: 0,
        offen: 0,
        abgeschlossen: 0,
        leads: 0,
        processed: 0,
        active: 0
      };
      
      return {
        success: true,
        stats: {
          total: statistics.total_contacts,
          neu: statistics.neu,
          offen: statistics.offen,
          abgeschlossen: statistics.abgeschlossen,
          leadForm: statistics.leads,
          processed: statistics.processed,
          active: statistics.active,
          recentWeek: recent[0].recent_count
        }
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error fetching statistics from MySQL:', error);
    
    return {
      success: false,
      error: error.message,
      stats: {
        total: 0,
        neu: 0,
        offen: 0,
        abgeschlossen: 0,
        leadForm: 0,
        processed: 0
      }
    };
  }
}

/**
 * E-Mail-Status in MySQL aktualisieren
 * @param {number} contactId - Kontakt ID
 * @param {string} emailType - 'confirmation' oder 'admin'
 * @param {boolean} success - E-Mail erfolgreich gesendet
 * @returns {Object} Update-Ergebnis
 */
export async function updateEmailStatusMySQL(contactId, emailType, success) {
  console.log(`📧 Updating email status in MySQL: ${emailType} for contact ${contactId}`);
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL connection not available');
    }
    
    const connection = await pool.getConnection();
    
    try {
      let query, params;
      
      if (emailType === 'confirmation') {
        query = `
          UPDATE contacts 
          SET confirmation_email_sent = ?, 
              confirmation_email_timestamp = IF(? = TRUE, NOW(), NULL),
              updated_at = NOW()
          WHERE id = ?
        `;
        params = [success, success, contactId];
      } else if (emailType === 'admin') {
        query = `
          UPDATE contacts 
          SET admin_email_sent = ?, 
              admin_email_timestamp = IF(? = TRUE, NOW(), NULL),
              updated_at = NOW()
          WHERE id = ?
        `;
        params = [success, success, contactId];
      } else {
        throw new Error('Invalid email type');
      }
      
      const [result] = await connection.execute(query, params);
      
      console.log(`✅ Email status updated in MySQL: ${emailType} = ${success}`);
      
      return {
        success: true,
        affectedRows: result.affectedRows
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error updating email status in MySQL:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Duplicate E-Mail Check
 * @param {string} email - E-Mail-Adresse
 * @returns {Object} Duplicate-Check-Ergebnis
 */
export async function checkDuplicateEmailMySQL(email) {
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      return { exists: false, contact: null };
    }
    
    const connection = await pool.getConnection();
    
    try {
      const [contacts] = await connection.execute(`
        SELECT * FROM contacts 
        WHERE email = ? 
        AND deleted_at IS NULL 
        ORDER BY created_at DESC 
        LIMIT 1
      `, [email.toLowerCase()]);
      
      return {
        exists: contacts.length > 0,
        contact: contacts[0] || null
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error checking duplicate email:', error);
    return { exists: false, contact: null };
  }
}

/**
 * MySQL Service Status
 * @returns {Object} Service-Status
 */
export async function getMySQLServiceStatus() {
  const connectionTest = await testMySQLConnection();
  
  return {
    version: '1.0',
    service: 'Strato MySQL Integration',
    connection: connectionTest,
    config: {
      host: MYSQL_CONFIG.host,
      database: MYSQL_CONFIG.database,
      user: MYSQL_CONFIG.user,
      port: MYSQL_CONFIG.port
    },
    features: [
      'Connection Pooling',
      'CRUD Operations',
      'Statistics Views',
      'Email Status Tracking',
      'GDPR Compliance',
      'Activity Logging',
      'Duplicate Detection',
      'Build Compatible'
    ],
    tables: [
      'contacts',
      'admin_users', 
      'contact_activities',
      'email_templates',
      'system_settings'
    ]
  };
}

// ✅ MIGRATION HELPER - Demo Database zu MySQL
export async function migrateDemoDataToMySQL(demoContacts) {
  console.log('🔄 Migrating demo data to MySQL...');
  
  const results = {
    migrated: 0,
    errors: 0,
    details: []
  };
  
  try {
    for (const demoContact of demoContacts) {
      try {
        const result = await createContactMySQL({
          name: demoContact.name,
          email: demoContact.email,
          phone: demoContact.phone,
          message: demoContact.message,
          leadForm: demoContact.leadForm,
          source: demoContact.source,
          gdprConsent: demoContact.gdprConsent,
          userAgent: demoContact.userAgent,
          ipAddress: demoContact.ipAddress
        });
        
        if (result.success) {
          results.migrated++;
          results.details.push(`✅ Migrated: ${demoContact.name}`);
        } else {
          results.errors++;
          results.details.push(`❌ Failed: ${demoContact.name} - ${result.error}`);
        }
      } catch (error) {
        results.errors++;
        results.details.push(`❌ Error: ${demoContact.name} - ${error.message}`);
      }
    }
    
    console.log(`✅ Migration completed: ${results.migrated} migrated, ${results.errors} errors`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    return {
      migrated: 0,
      errors: demoContacts.length,
      details: [`❌ Migration failed: ${error.message}`],
      error: error.message
    };
  }
}

// ✅ DATABASE HEALTH CHECK
export async function checkDatabaseHealth() {
  console.log('🏥 Checking database health...');
  
  try {
    const pool = await getMySQLPool();
    
    if (!pool) {
      throw new Error('MySQL Pool not available');
    }
    
    const connection = await pool.getConnection();
    
    try {
      // ✅ Tabellen-Status prüfen
      const [tables] = await connection.execute(`
        SELECT 
          table_name,
          table_rows,
          data_length,
          index_length
        FROM information_schema.tables 
        WHERE table_schema = ?
        AND table_name IN ('contacts', 'admin_users', 'contact_activities', 'email_templates', 'system_settings')
      `, [MYSQL_CONFIG.database]);
      
      // ✅ Connection Pool Status
      const poolStatus = {
        totalConnections: pool.pool.config.connectionLimit,
        activeConnections: pool.pool._allConnections.length,
        freeConnections: pool.pool._freeConnections.length,
        queuedConnections: pool.pool._connectionQueue.length
      };
      
      console.log('✅ Database health check completed');
      
      return {
        success: true,
        tables: tables,
        poolStatus: poolStatus,
        timestamp: new Date().toISOString()
      };
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// ✅ GRACEFUL SHUTDOWN
export async function closeMySQLPool() {
  if (mysqlPool) {
    console.log('🔌 Closing MySQL connection pool...');
    try {
      await mysqlPool.end();
      mysqlPool = null;
      console.log('✅ MySQL pool closed successfully');
    } catch (error) {
      console.error('❌ Error closing MySQL pool:', error);
    }
  }
}

// ✅ EXPORT DEFAULT für einfache Verwendung
export default {
  testConnection: testMySQLConnection,
  createContact: createContactMySQL,
  getContacts: getContactsMySQL,
  updateContact: updateContactMySQL,
  getStats: getContactStatsMySQL,
  updateEmailStatus: updateEmailStatusMySQL,
  checkDuplicateEmail: checkDuplicateEmailMySQL,
  getServiceStatus: getMySQLServiceStatus,
  migrateDemoData: migrateDemoDataToMySQL,
  checkHealth: checkDatabaseHealth,
  close: closeMySQLPool
};