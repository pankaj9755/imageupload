var nodemailer = require('nodemailer');
const { sequelize } = require('sequelize');

const mailerFun = function (ctx) {
    return new Promise(async (resolve, reject) => {
        try {

            var transporter = nodemailer.createTransport(({
                service: 'gmail',
                auth: {
                    user: 'santoshpatidar.idealittechno@gmail.com',
                    pass: 'santoshideal'
                }
            }));
            var mailOptions = {
                from: 'santoshpatidar.idealittechno@gmail.com',
                to: ctx.email,
                subject: 'Sending Email Registration..',
                html: "<h2>  Hello, " + ctx.user_name + " Your Email is , " + ctx.email + "</h2><p>Register successfully....</p>",
                text: " Email Register succesfully....,"
            };

            await transporter.sendMail(mailOptions, function (err, info) {
                if (err) {

                    console.log(err);
                    resolve({
                        status: false,
                        statuscode: 400,
                        msg: "Email not send plz enter valide Email"
                    })
                } else {
                    console.log('Email sent: ' + info.response + " " + ctx.email);
                    resolve({
                        status: true,
                        statuscode: 200,
                        msg: "Email send " + ctx.email
                    })
                }
            });

        }
        catch (err) {
            console.log(err);
        }
    });
}
module.exports = {
    mailerFun
}