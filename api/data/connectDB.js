const { Pool } = require('pg');
const getdbinfo = require('./getdbinfo');
const fs = require('fs');
const path = require('path');

class DatabaseConnection {
    constructor() {
        this.pool = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000; // 5 segundos
        this.connectionCheckInterval = 30000; // 30 segundos
    }

    async connect() {
        try {
            if (this.pool && this.isConnected) {
                console.log('✅ Conexión a la base de datos ya existe');
                return this.pool;
            }

            console.log('🔄 Iniciando conexión a la base de datos...');
            
            // Obtener la URL de conexión
            const dbUrl = await getdbinfo();
            
            // Configuración SSL con certificado
            const sslConfig = this.getSSLConfig();
            
            // Configuración del pool de conexiones
            const config = {
                connectionString: dbUrl,
                max: 20, // máximo 20 conexiones en el pool
                idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
                connectionTimeoutMillis: 10000, // timeout de conexión de 10 segundos
                ssl: sslConfig,
                // Forzar el uso de nuestra configuración SSL
                application_name: 'PassManager'
            };

            // Crear el pool de conexiones
            this.pool = new Pool(config);

            // Configurar eventos del pool
            this.pool.on('connect', () => {
                console.log('✅ Nueva conexión establecida a la base de datos');
                this.isConnected = true;
                this.reconnectAttempts = 0;
            });

            this.pool.on('error', (err) => {
                console.error('❌ Error en el pool de conexiones:', err.message);
                this.isConnected = false;
                this.handleReconnection();
            });

            // Probar la conexión
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();

            console.log('✅ Conexión a la base de datos establecida correctamente');
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Iniciar verificación periódica de conexión
            this.startConnectionCheck();

            return this.pool;

        } catch (error) {
            console.error('❌ Error al conectar a la base de datos:', error.message);
            this.isConnected = false;
            this.handleReconnection();
            throw error;
        }
    }

    async handleReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('❌ Máximo número de intentos de reconexión alcanzado');
            return;
        }

        this.reconnectAttempts++;
        console.log(`🔄 Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(async () => {
            try {
                await this.connect();
            } catch (error) {
                console.error('❌ Error en reconexión:', error.message);
            }
        }, this.reconnectDelay);
    }

    startConnectionCheck() {
        setInterval(async () => {
            if (!this.pool || !this.isConnected) return;

            try {
                const client = await this.pool.connect();
                await client.query('SELECT 1');
                client.release();
            } catch (error) {
                console.error('❌ Verificación de conexión falló:', error.message);
                this.isConnected = false;
                this.handleReconnection();
            }
        }, this.connectionCheckInterval);
    }

    async query(text, params) {
        if (!this.pool || !this.isConnected) {
            throw new Error('No hay conexión activa a la base de datos');
        }

        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('❌ Error en query:', error.message);
            this.isConnected = false;
            this.handleReconnection();
            throw error;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            this.isConnected = false;
            console.log('🔌 Conexión a la base de datos cerrada');
        }
    }

    getSSLConfig() {
        const certsDir = path.join(__dirname, '../certificates');
        
        // Buscar cualquier archivo .crt en la carpeta certificates
        let certPath = null;
        if (fs.existsSync(certsDir)) {
            const files = fs.readdirSync(certsDir);
            const certFile = files.find(file => file.endsWith('.crt'));
            if (certFile) {
                certPath = path.join(certsDir, certFile);
            }
        }
        
        // Verificar si el certificado existe
        if (certPath && fs.existsSync(certPath)) {
            try {
                const certContent = fs.readFileSync(certPath, 'utf8');
                console.log('🔐 Usando certificado SSL de Supabase:', path.basename(certPath));
                console.log('📄 Tamaño del certificado:', certContent.length, 'caracteres');
                
                return {
                    rejectUnauthorized: false,
                    ca: certContent,
                    checkServerIdentity: () => undefined,
                    secureProtocol: 'TLSv1_2_method',
                    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384'
                };
            } catch (error) {
                console.error('❌ Error al leer el certificado:', error.message);
                return this.getDefaultSSLConfig();
            }
        } else {
            console.log('⚠️  Certificado SSL no encontrado, usando configuración por defecto');
            return this.getDefaultSSLConfig();
        }
    }

    getDefaultSSLConfig() {
        return process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: true
        } : {
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined // Ignora verificación de identidad del servidor
        };
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts
        };
    }
}

// Pool de conexiones global
let globalPool = null;

const connectDB = async () => {
    if (!globalPool) {
        console.log('🔄 Iniciando pool de conexiones...');
        
        // Obtener la URL de conexión
        const dbUrl = await getdbinfo();
        
        // Configuración SSL con certificado
        const sslConfig = getSSLConfig();
        
        // Configuración del pool de conexiones
        const config = {
            connectionString: dbUrl,
            max: 20, // máximo 20 conexiones en el pool
            idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
            connectionTimeoutMillis: 10000, // timeout de conexión de 10 segundos
            ssl: sslConfig,
            application_name: 'PassManager'
        };

        // Crear el pool de conexiones
        globalPool = new Pool(config);

        // Configurar eventos del pool
        globalPool.on('connect', () => {
            console.log('✅ Nueva conexión establecida a la base de datos');
        });

        globalPool.on('error', (err) => {
            console.error('❌ Error en el pool de conexiones:', err.message);
        });

        // Probar la conexión
        const client = await globalPool.connect();
        await client.query('SELECT NOW()');
        client.release();

        console.log('✅ Pool de conexiones establecido correctamente');
    }
    
    return globalPool;
};

const getDB = async () => {
    if (!globalPool) {
        console.log('🔄 No hay pool de conexiones, intentando conectar...');
        try {
            await connectDB();
        } catch (error) {
            throw new Error(`No se pudo conectar a la base de datos: ${error.message}`);
        }
    }
    return globalPool;
};

// Función para obtener configuración SSL (extraída de la clase)
const getSSLConfig = () => {
    const certsDir = path.join(__dirname, '../certificates');
    
    // Buscar cualquier archivo .crt en la carpeta certificates
    let certPath = null;
    if (fs.existsSync(certsDir)) {
        const files = fs.readdirSync(certsDir);
        const certFile = files.find(file => file.endsWith('.crt'));
        if (certFile) {
            certPath = path.join(certsDir, certFile);
        }
    }
    
    // Verificar si el certificado existe
    if (certPath && fs.existsSync(certPath)) {
        try {
            const certContent = fs.readFileSync(certPath, 'utf8');
            console.log('🔐 Usando certificado SSL de Supabase:', path.basename(certPath));
            console.log('📄 Tamaño del certificado:', certContent.length, 'caracteres');
            
            return {
                rejectUnauthorized: false,
                ca: certContent,
                checkServerIdentity: () => undefined,
                secureProtocol: 'TLSv1_2_method',
                ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384'
            };
        } catch (error) {
            console.error('❌ Error al leer el certificado:', error.message);
            return getDefaultSSLConfig();
        }
    } else {
        console.log('⚠️  Certificado SSL no encontrado, usando configuración por defecto');
        return getDefaultSSLConfig();
    }
};

const getDefaultSSLConfig = () => {
    return process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
    } : {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined // Ignora verificación de identidad del servidor
    };
};

module.exports = {
    connectDB,
    getDB
};
