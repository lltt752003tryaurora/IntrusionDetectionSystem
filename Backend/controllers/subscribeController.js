const Subscriber = require('../models/Subscriber');

const controller = {
    registerSubscriber: async (req, res, next) => {
        const { email } = req.body;
        try {
            const newSubscriber = new Subscriber({
                email
            });
            await newSubscriber.save();
            res.status(201).send({
                message: 'Subscriber registered successfully.'
            });
        } catch (error) {
            console.error(error.message);
            res.status(400).send({
                message: 'Error subscribing email.'
            });
        }
    }
}

module.exports = controller;