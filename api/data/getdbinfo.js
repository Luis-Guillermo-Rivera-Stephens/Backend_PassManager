const getdbinfo = async () => {
    // Obtener todas las variables de entorno de la base de datos
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbName = process.env.DB_NAME;
    const dbSSL = process.env.DB_SSL;
    
    // Construir y retornar solo la URL de conexión
    const dbUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?sslmode=require`;
    
    return dbUrl;
}

module.exports = getdbinfo;