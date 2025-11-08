import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"EchoSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your EchoSpace Verification Code',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify your EchoSpace account</h2>
        <p>Your 6-digit verification code is:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>This code will expire in 15 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
