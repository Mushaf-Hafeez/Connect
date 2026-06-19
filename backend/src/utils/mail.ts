import transporter from "../config/nodemailer.config.js";
import { emailVerification } from "../templates/emailVerification.template.js";
import logger from "./logger.js";

export const sendEmailVerificationLink = async (to: string, link: string) => {
  try {
    transporter.sendMail({
      from: "Connect",
      to,
      subject: "Email Verification.",
      html: emailVerification(link),
    });
  } catch (error) {
    logger.error(error);
  }
};
