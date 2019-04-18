var process = require("process");

module.exports = {
  production: {
    port: process.env.PORT || 8080
  },
  development: {
    port: process.env.PORT || 8080
  },
  test: {
    port: process.env.PORT || 8080
  }
}
