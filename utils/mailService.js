// Import nodemailer
const nodemailer = require('nodemailer');

// Import nodemailer configuration
const configurations = require('../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: configurations.nodemailerConfig.USER,
    pass: configurations.nodemailerConfig.PASS,
    clientId: configurations.nodemailerConfig.CLIENT_ID,
    clientSecret: configurations.nodemailerConfig.CLIENT_SECRET,
    refreshToken: configurations.nodemailerConfig.REFRESH_TOKEN,
  },
});

module.exports = {
  sendMail: (to, subject, text) => {
    let mailOptions = {
      from: configurations.nodemailerConfig.USER,
      to,
      subject,
      text,
    };
    return transporter.sendMail(mailOptions);
  },
};
