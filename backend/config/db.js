module.exports = {
  development: {
    username: "postgres",
    password: "gabella31415",
    database: "medical_system_development",
    host: "localhost",
    dialect: "postgres",
    logging: false
  },
  test: {
    username: "postgres",
    password: "gabella31415",
    database: "medical_system_test",
    host: "localhost",
    dialect: "postgres",
    logging: false
  },
  production: {
    username:  "postgres",
    password: "gabella31415",
    database: "medical_system",
    host: "localhost",
    dialect: "postgres",
    logging: false
  }
}