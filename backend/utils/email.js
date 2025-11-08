import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, code) => {
  try {
    await sgMail.send({
      to: email,
      from: "echospace.authentication@gmail.com", // must be verified or domain-authenticated
      subject: "EchoSpace Verification Code",
      text: `Your verification code is: ${code}`,
    });
    console.log("Email sent to:", email);
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
  }
};
