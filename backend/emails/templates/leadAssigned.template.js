const leadAssignedTemplate = (userName, leadName) => `
  <h2>Hello ${userName},</h2>
  <p>You have been assigned a new lead:</p>
  <p><strong>${leadName}</strong></p>
  <p>Please log in to the CRM to follow up.</p>
  <br />
  <p>— CRM Team</p>
`;

module.exports = { leadAssignedTemplate };
