// backend/config/database.js

export default ({ env }) => {
  // Extraemos la URL de la base de datos
  const connectionString = env('DATABASE_URL');

  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString,
        // Configuración de SSL optimizada para Railway
        ssl: {
          rejectUnauthorized: false,
        },
      },
      // Configuración de Pool para evitar cierres inesperados por latencia
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
        acquireTimeoutMillis: 60000, // 60 segundos para esperar conexión
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
      },
    },
  };
};