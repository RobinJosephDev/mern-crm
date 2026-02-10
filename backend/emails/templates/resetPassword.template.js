const resetPasswordTemplate = (resetUrl) => `
  <h2>Password Reset Request</h2>
  <p>You requested to reset your password.</p>
  <p>Click the link below to continue:</p>
  <p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
  </p>
  <p>This link will expire in 15 minutes.</p>
  <br />
  <p>If you didn’t request this, you can safely ignore this email.</p>
`;

module.exports = { resetPasswordTemplate };
