const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Subscriber', subscriberSchema);