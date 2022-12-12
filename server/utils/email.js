const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.firstname;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    //   //send grid
    //   return 1;
    // }
    return nodemailer.createTransport({
      service: "Gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendWelcome(userDetail, urlDetail, req) {
    let mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Waves guitars",
        link: `${req}`,
      },
    });

    const email = {
      body: {
        name: userDetail.firstname,
        intro: "Welcome to Waves! We're very excited to have you on board.",
        action: {
          instructions:
            "Your account is created succesfully, Click on the link to continue on our main site",
          button: {
            color: "#1a73e8",
            text: "Welcome",
            link: `${urlDetail}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    let emailBody = mailGenerator.generate(email);

    let message = {
      from: process.env.EMAIL_FROM,
      to: userDetail.email,
      subject: "Welcome to waves",
      html: emailBody,
    };

    await this.newTransport().sendMail(message);
    return true;
  }

  async send(userDetail, urlDetail, req) {
    let mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Waves guitars",
        link: `${req}`,
      },
    });

    const email = {
      body: {
        name: userDetail.firstname,
        intro: "Welcome to Waves! We're very excited to have you on board.",
        action: {
          instructions: "To  validate your account, please click here:",
          button: {
            color: "#1a73e8",
            text: "Validate your account",
            link: `${urlDetail}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    let emailBody = mailGenerator.generate(email);

    let message = {
      from: process.env.EMAIL_FROM,
      to: userDetail.email,
      subject: "Welcome to waves",
      html: emailBody,
    };

    await this.newTransport().sendMail(message);
    return true;
  }
};

// const sendEmail = async (options) => {
//   //1. Create transporter: A service that will send the mail e.g gmail
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //2. Define email options
//   const mailOptions = {
//     from: "Adedayo Ayoola <pleasantvik@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   //3.Nodemailer send the mail
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
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
