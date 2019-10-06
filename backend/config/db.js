module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "gabella31415",
    database: "medical_system_development",
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: "postgres",
    logging: false
  },
  test: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "gabella31415",
    database: "medical_system_test",
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: "postgres",
    logging: false
  },
  production: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "gabella31415",
    database: "medical_system",
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: "postgres",
    logging: false
  }
}