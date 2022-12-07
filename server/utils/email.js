const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1. Create transporter: A service that will send the mail e.g gmail
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2. Define email options
  const mailOptions = {
    from: "Adedayo Ayoola <pleasantvik@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3.Nodemailer send the mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
// const sendEmail = (options) => {
//   //1. Create a transporter
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASWORD,
//     },
//   });
// };
