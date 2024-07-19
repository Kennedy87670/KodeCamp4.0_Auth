const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

async function sendEmail(to, subject, body) {
  await transporter.sendMail({
    from: process.env.NODE_MAILER_EMAIL,
    to,
    subject,
    html: body,
  });
}

module.exports = { sendEmail };
