const nodemailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newLink = (data) => {

    let htmlString = nodemailer.renderTemplate({ data: data }, '/newUserAuth.ejs');
    nodemailer.transporter.sendMail({
        from: 'codeialdeveloper@gmail.com',
        to: data.email,
        subject: 'Email Verification Link!',
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