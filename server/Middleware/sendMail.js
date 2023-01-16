import nodeMailer from "nodemailer";

const html = `
    <h1>Hey this is test</h1>
    <p>Okay this seems to work</p>
`;

const FROM_EMAIL = `edak.messenger@gmail.com`
const EMAIL_PASS = `9723edak`

const sendMail = (async (to_mail, fileName, filePath) => {
    const transporter = nodeMailer.createTransport({
        host: 'edak.messenger@gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: FROM_EMAIL,
            pass: EMAIL_PASS
        }
    });

    const result = await transporter.sendMail({
        from: "test <edak.messenger@gmail.com>",
        to: to_mail,
        subject: 'This is a Test',
        html: html,
        attachments: [{
            filename: fileName,
            path: filePath
        }]
    });

    console.log(`Message Sent: ${result.messageId}`);
    console.log(result.accepted);
    console.log(result.rejected);
});

export default sendMail;