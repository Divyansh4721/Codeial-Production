const nodemailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newLink = (data) => {

    let htmlString = nodemailer.renderTemplate({ data: data }, '/resetpassword.ejs');
    nodemailer.transporter.sendMail({
        from: 'codeialdeveloper@gmail.com',
        to: data.email,
        subject: 'Password Reset Link!',
        html: htmlString,
    },
        (err, info) => {
            if (err) {
                console.log('Error in sending mail', err);
                return;
            }
            return;
        });
};