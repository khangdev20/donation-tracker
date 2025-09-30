import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

class EmailHelper {
    static async sendInvoiceEmail(to, invoiceLink) {
        const subject = "Your Invoice";
        const text = `You can download your invoice from the following link: ${invoiceLink}`;
        await this.sendEmail(to, subject, text);
    }

    static async sendEmail(to, subject, text) {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
        });
    }
}

export default EmailHelper;
