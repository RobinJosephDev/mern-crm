const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis");

const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

module.exports = { emailQueue };
