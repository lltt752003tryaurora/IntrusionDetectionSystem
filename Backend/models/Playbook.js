const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playbookSchema = new Schema({
    attackType: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    subsribers: {
        type: [mongoose.Types.ObjectId],
    }
});

module.exports = mongoose.Model('Playbook', playbookSchema);