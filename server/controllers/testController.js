const TestResult = require('../models/TestResult');
const { analyzePerformance } = require('../ai-engine/performanceAnalyzer');

const submitTest = async (req, res) => {
    const { topicId, totalQuestions, attempted, correct, wrong } = req.body;

    try {
        const { accuracy, classification } = analyzePerformance(correct, attempted);

        const testResult = await TestResult.create({
            userId: req.user.id,
            topicId,
            totalQuestions,
            attempted,
            correct,
            wrong,
            accuracy,
            // We could store classification if we updated the model, but it's calculated on demand or we can just send it back.
            // The requirement didn't strictly ask to store classification in DB, but we can compute it.
        });

        res.status(201).json({ testResult, classification, accuracy });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { submitTest };
