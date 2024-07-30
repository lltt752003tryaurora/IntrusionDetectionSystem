const bcrypt = require('bcrypt');
const User = require('../models/User');

const controller = {
    createUser: async (req, res, next) => {
        const { username, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                hashedPassword
            });
            await newUser.save();
            res.status(201).send({
                message: 'User created.',
            });
        } catch (error) {
            console.error(error.message);
            res.status(400).send({
                message: 'Error creating user.'
            });
        }
    },

    login: async (req, res, next) => {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send({
                    message: 'Invalid credentials.',
                });
            }
            if (!(await bcrypt.compare(password, user.hashedPassword))) {
                return res.status(401).send({
                    message: 'Invalid credentials.',
                });
            }
            req.session.user = { id: user._id, username: user.username };
            res.status(200).send({
                message: 'Login successfully.'
            });
        } catch (error) {
            console.error(error.message);
            res.status(400).send({
                message: 'Error logging user in.'
            });
        }
    },

    logout: async (req, res, next) => {
        if (req.session) {
            req.session.destroy(error => {
                if (error) {
                    console.error(error.message);
                    return res.status(500).send({
                        message: 'Error logging out.'
                    });
                } else {
                    res.status(200).send({
                        message: 'Logout successfully.'
                    });
                }
            });
        } else {
            res.status(200).send({
                message: 'No active session.'
            });
        }
    }
}

module.exports = controller;