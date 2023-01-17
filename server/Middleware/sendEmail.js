import nodeMailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

const html = `
    <h1>Hey this is test</h1>
    <p>Okay this seems to work</p>
`;

const FROM_EMAIL = `edak.messenger@gmail.com`
const EMAIL_PASS = `yaffypsjpgxrpuih`

const refresh = "1//043XTbWZlSgDACgYIARAAGAQSNwF-L9Ir6-j-Ay9OBE6FQ3uc65F25M8235FzfG8mBcQddZPtBXjF3fSq0iLswZzsKoqEkh19ho8"
const OAuth2_client = new OAuth2("444760745272-bqs6nemhg9eh6jv96ujjn8aj5s2uft4s.apps.googleusercontent.com", "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");
OAuth2_client.setCredentials({refresh_token: refresh});

const sendEmail = (async (to_mail, fileName, filePath) => {
    const accessToken = OAuth2_client.getAccessToken();

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: FROM_EMAIL,
            clientId: "444760745272-bqs6nemhg9eh6jv96ujjn8aj5s2uft4s.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: refresh,
            accessToken: accessToken
        },
        port: 465,
        secure: true,
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

export default sendEmail;