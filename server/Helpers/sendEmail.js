import nodeMailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({
    path: "./config/.env",
});

const OAuth2 = google.auth.OAuth2;

const html = `
    <h1>Hey this is test</h1>
    <p>Okay this seems to work</p>
`;

const FROM_EMAIL = process.env.FROM_EMAIL;
const CLIENT_ID = process.env.OAUTH2_API_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH2_API_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const OAuth2_client = new OAuth2(CLIENT_ID, CLIENT_SECRET);

OAuth2_client.setCredentials({refresh_token: REFRESH_TOKEN});

const sendEmail = (async (to_mail, fileName, filePath) => {
    const accessToken = OAuth2_client.getAccessToken();

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: FROM_EMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
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