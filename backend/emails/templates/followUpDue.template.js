const followUpDueTemplate = (userName, leadName) => `
  <h2>Follow-up Reminder</h2>
  <p>Hi ${userName},</p>
  <p>Your follow-up is due for the lead:</p>
  <p><strong>${leadName}</strong></p>
  <p>Please take action as soon as possible.</p>
  <br />
  <p>— CRM Team</p>
`;

module.exports = { followUpDueTemplate };
