const { URL } = require("url");

let redisConnection;

if (process.env.REDIS_URL) {
  const redisUrl = new URL(process.env.REDIS_URL);

  redisConnection = {
    host: redisUrl.hostname,
    port: redisUrl.port,
    password: redisUrl.password,
    tls: {
      rejectUnauthorized: false,
    },
  };
} else {
  redisConnection = {
    host: "127.0.0.1",
    port: 6379,
  };
}

module.exports = { redisConnection };
