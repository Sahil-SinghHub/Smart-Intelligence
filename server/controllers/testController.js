const Topic = require('../models/Topic');
const TestResult = require('../models/TestResult');
const { analyzePerformance } = require('../ai-engine/performanceAnalyzer');
const { calculate_smart_schedule } = require('../ai-engine/scheduler');

const submitTest = async (req, res) => {
    const { topicId, totalQuestions, attempted, correct, wrong } = req.body;

    try {
        const { accuracy, classification } = analyzePerformance(correct, attempted);

        // Fetch Topic for complexity and priority
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Calculate Smart Schedule
        const schedule = calculate_smart_schedule(
            topic.difficulty, // complexity
            topic.priority,
            accuracy, // last_score
            topic.interval,
            topic.easeFactor
        );

        // Update Topic
        topic.interval = schedule.days_until_next;
        // topic.easeFactor = schedule.new_ease_factor; // The new algorithm doesn't explicitly return a new ease factor, but we could add logic if needed. 
        // For now, let's keep easeFactor constant or add logic if user wants dynamic ease. 
        // The previous algo did update it. The new one uses it but doesn't return it in the object. 
        // Let's assume standard SM-2 behavior: if correct, ease factor might increase. 
        // But complying STRICTLY with user's code: user's code returns mapped structure. 
        // User's code: does NOT return new ease factor. It only returns next date.

        topic.nextReviewDate = schedule.next_revision_date;
        await topic.save();

        const testResult = await TestResult.create({
            userId: req.user.id,
            topicId,
            totalQuestions,
            attempted,
            correct,
            wrong,
            accuracy,
            timeTaken: req.body.timeTaken || 0, // Default to 0 if not sent
        });

        res.status(201).json({ testResult, classification, accuracy });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { submitTest };
