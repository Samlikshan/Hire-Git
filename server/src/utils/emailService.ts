import nodemailer from "nodemailer";
import config from "../config";
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // service: "gmail",
    auth: {
      user: config.thirdParty.nodeMailer.emailUser,
      pass: config.thirdParty.nodeMailer.emailPass,
    },
  });

  async sendVerificationEmail(email: string, subject: string, body: string) {
    const mailOptions = {
      from: config.thirdParty.nodeMailer.emailUser,
      to: email,
      subject: subject,
      html: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
