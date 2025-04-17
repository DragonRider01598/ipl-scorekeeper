const { Resend } = require("resend");
const { generateResetPasswordHTML } = require("./emailTeamplate.js");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async ({ to, userName, resetLink }) => {
   const html = generateResetPasswordHTML({ userName, resetLink });

   await resend.emails.send({
      from: "support <onboarding@resend.dev>",
      to,
      subject: "Reset your ipl-scorekeeper password",
      html,
   });
};

module.exports = sendPasswordResetEmail;