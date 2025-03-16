import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost', // MailHog runs on localhost
  port: 1025, // MailHog SMTP port
  secure: false, // MailHog does not use TLS/SSL
});

type SendEmailProps = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const sendEmail = async ({ to, subject, text, html }: SendEmailProps) => {
  try {
    const info = await transporter.sendMail({
      from: '"Test Sender" <test@example.com>', // Can be anything for MailHog
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export { sendEmail };
