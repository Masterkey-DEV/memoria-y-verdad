export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: env.bool('DATABASE_SSL', true) && {
        rejectUnauthorized: false,
      },
    },
    // Añadir este bloque ayuda a manejar reintentos en redes inestables de despliegue
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
  },
});