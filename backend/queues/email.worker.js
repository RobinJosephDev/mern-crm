const { Worker } = require("bullmq");
const { redisConnection } = require("../config/redis");
const User = require("../models/User");

const { sendEmail } = require("../emails/email.service");

const { leadAssignedTemplate } = require("../emails/templates/leadAssigned.template");
const { followUpDueTemplate } = require("../emails/templates/followUpDue.template");
const { welcomeTemplate } = require("../emails/templates/welcome.template");
const { resetPasswordTemplate } = require("../emails/templates/resetPassword.template");

const { EMAIL_JOB_TYPES } = require("../emails/email.types");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { name, data } = job;

    switch (name) {
      case EMAIL_JOB_TYPES.LEAD_ASSIGNED: {
        const user = await User.findById(data.userId);
        if (!user) return;

        await sendEmail({
          to: user.email,
          subject: "New Lead Assigned",
          html: leadAssignedTemplate(user.name, data.leadName),
        });
        break;
      }

      case EMAIL_JOB_TYPES.FOLLOW_UP_DUE: {
        const user = await User.findById(data.userId);
        if (!user) return;

        await sendEmail({
          to: user.email,
          subject: "Follow-up Due Reminder",
          html: followUpDueTemplate(user.name, data.leadName),
        });
        break;
      }

      case EMAIL_JOB_TYPES.WELCOME_EMAIL: {
        await sendEmail({
          to: data.email,
          subject: "Welcome to the CRM 🎉",
          html: welcomeTemplate(data.name),
        });
        break;
      }

      case EMAIL_JOB_TYPES.RESET_PASSWORD: {
        await sendEmail({
          to: data.email,
          subject: "Reset Your Password",
          html: resetPasswordTemplate(data.resetUrl),
        });
        break;
      }

      default:
        throw new Error(`Unhandled email job type: ${name}`);
    }
  },
  {
    connection: redisConnection,
  },
);

module.exports = { emailWorker };
