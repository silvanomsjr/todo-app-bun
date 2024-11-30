import nodemailer from "nodemailer";

export default async function (email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
    return { error: false, message: "Email enviado com sucesso" };
  } catch (_) {
    return { error: true, message: "Ocorreu um erro ao enviar o email" };
  }
}
