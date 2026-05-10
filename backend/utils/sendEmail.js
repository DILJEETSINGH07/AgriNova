const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Check if SMTP configuration is provided, otherwise skip sending email silently in dev
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log('Skipping email notification: SMTP credentials are not configured.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = {
      from: `"${process.env.FROM_NAME || 'AgriNova'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || `<p>${options.message}</p>`,
    };

    const info = await transporter.sendMail(message);
    console.log(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

module.exports = sendEmail;
