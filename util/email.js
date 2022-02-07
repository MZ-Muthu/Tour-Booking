let nodemailer = require('nodemailer');
let pug = require('pug');
let htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `sample testing mail<${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_DEV === 'production') {
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                name: this.firstName,
                url: this.url,
                subject
            }
        );

        const mailOption = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        await this.newTransport().sendMail(mailOption);
    }

    async sendWelcom() {
        await this.send('welcome', 'Welcome to testing mail');
    }

    async passwordResetEmail() {
        await this.send(
            'passwordReset',
            'Your password reset Email(Valid only 10 mins)'
        );
    }
};
