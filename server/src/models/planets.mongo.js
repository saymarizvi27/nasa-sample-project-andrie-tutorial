const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({

    keplerName: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    target: {
        ref: 'Planet',
        type: mongoose.ObjectId,
        required:true
    },
    customer: [String],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default:true,
    },
});

module.exports = mongoose.model('Planet',planetsSchema);