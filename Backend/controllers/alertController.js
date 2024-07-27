const { sendEmail } = require('../services/emailService');
const Subscriber = require('../models/Subscriber');

const controller = {
    sendAlertEmail: async (req, res, next) => {
        const { attackType, details } = req.body;
        try {
            const subscribers = await Subscriber.find();

            const emails = subscribers.map((subsriber) => subsriber.email);

            sendEmail({
                tos: emails,
                details: {
                    suspectedThreats: attackType,
                    time: (new Date()).toUTCString(),
                    details: details,
                }
            });

            res.status(200).send({
                message: 'Alert emails sent.',
                emailsSent: emails,
            })
        } catch (error) {
            console.error(error.message);
            res.status(500).send({
                message: 'Failed to send alert emails.'
            });
        }
    }
}

module.exports = controller;