const nodemailer = require('nodemailer');

const transpoter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'alert.nids.aplcrpt@gmail.com',
        pass: 'nswnvjinuvzwglno'
    }
});

const sendEmail = async ({ tos, details }) => {
    try {
        const resp = await transpoter.sendMail({
            to: tos,
            subject: 'Network Alert',
            html: `
                <h1>Network Alert</h1>
                <p>An abnormal traffic detected<p>
                <hr>
                <h2>Details</h2>
                <div>
                    <p>Time: ${details.time}</p>
                    <p>Suspected threats: ${details.suspectedThreats}</p>
                    <p>Details: ${details.details}</p>
                </div>
            `
        });
        console.log(resp);
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { sendEmail };