require('dotenv').config();
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const htmlTemplate = fs.readFileSync(
    path.join(__dirname, "../templates/welcome.html"),
    "utf-8"
);

const renderTemplate = (template, data) => {
    return Object.entries(data).reduce(
        (html, [key, value]) => html.replace(new RegExp(`{{${key}}}`, "g"), value),
        template
    );
};

const html = renderTemplate(htmlTemplate, {
    APP_NAME: process.env.APP_NAME,
    FRONT_SIDE_URL: process.env.FRONT_SIDE_URL,
});

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const sendMail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Welcome to Our Service!",
            html: html,
        });
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

module.exports = { sendMail };
