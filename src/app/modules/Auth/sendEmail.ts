import nodemailer from "nodemailer";
import config from "../../../config";

const sendEmail = async (email:string, html:any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Md Nasirul Islam👻" <nasirchy252@gmail.com>', 
    to: `${email}`,
    subject: "Health Care Password Reset Link", 
    html, 
  });

  console.log("Message sent: %s", info.messageId);

};

export default sendEmail;
