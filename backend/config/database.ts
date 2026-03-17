export default ({ env }) => {
  const databaseUrl = env("DATABASE_URL");

  const connection = databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "ventana_social"),
        user: env("DATABASE_USERNAME", "ventana_user"),
        password: env("DATABASE_PASSWORD", "ventana_password"),
        ssl: env.bool("DATABASE_SSL", false),
      };

  return {
    connection: {
      client: "postgres",
      connection,
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
  };
};