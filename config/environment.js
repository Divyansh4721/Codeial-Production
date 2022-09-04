
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory,
});


const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'dummy',
    db: 'dummy',
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: "587",
        secure: "false",
        auth: {
            user: 'dummy',
            pass: 'dummy'
        }
    },
    google_clientID: 'dummy',
    google_clientSecret: 'dummy',
    google_callbackURL: 'http://localhost:8000/users/auth/google/callback',
    JWT_secret: 'dummy',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream },
    }
}


const production = {

    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: "587",
        secure: "false",
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD,
        }
    },
    google_clientID: process.env.GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.GOOGLE_CALLBACK_URL,
    JWT_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream },
    }
}


module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : production;
