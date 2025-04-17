const generateResetPasswordHTML = ({ userName = "User", resetLink }) => {
  return `
  <div style="font-family: Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; max-width: 520px; margin: 0 auto; box-shadow: 0 0 8px rgba(0,0,0,0.05);">
      <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 16px;">Hello ${userName},</p>
      <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 16px;">
        We received a request to reset your <strong>ipl-scorekeeper</strong> password. Click the button below to set a new password:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 16px;">
        This link will expire in 15 minutes. If you didn’t request this, please ignore this email or let us know.
      </p>
      <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">— The ipl-scorekeeper Team</p>
    </div>
  </div>
`};

module.exports = { generateResetPasswordHTML };