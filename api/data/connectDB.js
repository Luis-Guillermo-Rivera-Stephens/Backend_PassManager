const { Pool } = require('pg');
const getdbinfo = require('./getdbinfo');

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
            
            // Configuración del pool de conexiones
            const config = {
                connectionString: dbUrl,
                max: 20, // máximo 20 conexiones en el pool
                idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
                connectionTimeoutMillis: 10000, // timeout de conexión de 10 segundos
                ssl: {
                    rejectUnauthorized: false // Para Supabase
                }
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

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts
        };
    }
}

// Patrón Singleton
let dbInstance = null;

const connectDB = async () => {
    if (!dbInstance) {
        dbInstance = new DatabaseConnection();
    }
    return await dbInstance.connect();
};

const getDB = async () => {
    if (!dbInstance) {
        console.log('🔄 No hay instancia de DB, intentando conectar...');
        try {
            await connectDB();
        } catch (error) {
            throw new Error(`No se pudo conectar a la base de datos: ${error.message}`);
        }
    }
    return dbInstance.pool; // Retorna directamente el Pool para usar con ORMs
};

module.exports = {
    connectDB,
    getDB
};
