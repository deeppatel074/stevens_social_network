const nodemailer = require("nodemailer");



async function fetchMailer() {
    let testAccount = await nodemailer.createTestAccount();

    return {
        email: "abcxox97@gmail.com",
        password: "PASS@123;xoxo",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        alias: 'Stevens Social Network'
    };
}


async function send(to, subject, data) {
    try {
        console.log('initiating sender');
        let sender = await fetchMailer();
        if (sender) {
            let transporter = await nodemailer.createTransport({
                //service: 'gmail',
                host: sender.host,
                port: sender.port,
                secure: sender.secure, // true for 465, false for other ports
                auth: {
                    user: sender.email,
                    pass: sender.password
                }
            });
            let html = `<p>Hey ${data.name}</p><p>You have an upcoming ${data.title} event scheduled at ${data.eventTime}.</p>
</p>We are here to remind you, so that you don't miss out on this exciting event where you get to connect with your peers and get some exciting perks.</p><p>Thank You,</p><p>Team SSN</p>`;
            let mailOptions = {
                from: `"${sender.alias}" ${sender.email}`, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: '', // plain text body
                html: html // html body
            };
            let info = await transporter.sendMail(mailOptions);
            await transporter.close();
            return console.log(`[${new Date().toUTCString()}]: Message sent: %s`, info.messageId);
        } else throw 'Cannot send email : No mailer found';
    } catch (e) {
        return console.log(e);
    }
}

module.exports = { send };
