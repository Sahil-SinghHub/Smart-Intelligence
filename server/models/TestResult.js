const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    attempted: {
        type: Number,
        required: true,
    },
    correct: {
        type: Number,
        required: true,
    },
    wrong: {
        type: Number,
        required: true,
    },
    accuracy: {
        type: Number, // Percentage
        required: true,
    },
    timeTaken: {
        type: Number, // Seconds
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('TestResult', testResultSchema);
