const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await sgMail.send({
    to,
    from: {
      email: process.env.EMAIL_FROM,
      name: "CRM Notifications",
    },
    subject,
    html,
  });
};

module.exports = { sendEmail };
