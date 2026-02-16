const Topic = require('../models/Topic');
const TestResult = require('../models/TestResult');
const { analyzePerformance } = require('../ai-engine/performanceAnalyzer');
const { generateRevisionPlan } = require('../ai-engine/revisionPlanner');
const { suggestNextTest } = require('../ai-engine/testScheduler');
const { generateTest } = require('../ai-engine/testGenerator');

const getGeneratedTest = async (req, res) => {
    try {
        const { topicId } = req.query;
        if (!topicId) {
            return res.status(400).json({ message: 'Topic ID required' });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Ensure user owns topic
        if (topic.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const testData = await generateTest(
            topic.topicName,
            topic.subject,
            topic.keyPoints,
            topic.difficulty,
            topic.priority
        );

        res.json(testData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const suggestConcepts = async (req, res) => {
    const { subject, topic } = req.query;
    // Simulated AI Logic (Rule-based)
    // In a real app, this would call OpenAI/Gemini
    const suggestions = [
        `${topic} Fundamentals`,
        `Applications of ${topic}`,
        `History of ${topic}`,
        `${topic} vs Related Concepts`,
        `Advanced ${topic} Theories`,
        `Common Misconceptions in ${topic}`
    ];

    // Custom logic for common subjects
    if (subject && subject.toLowerCase().includes('physics')) {
        suggestions.push('Conservation Laws', 'Forces & Motion', 'Energy Transfer');
    }
    if (subject && subject.toLowerCase().includes('math')) {
        suggestions.push('Formulas & Theorems', 'Problem Solving Techniques', 'Real-world Examples');
    }

    res.json({ suggestions });
};

const getRevisionPlan = async (req, res) => {
    try {
        const tests = await TestResult.find({ userId: req.user.id });
        const topics = await Topic.find({ userId: req.user.id });

        const detailedPlan = topics.map(topic => {
            // Get tests for this specific topic
            const topicTests = tests.filter(t => t.topicId.toString() === topic._id.toString());

            let correct = 0;
            let attempted = 0;

            topicTests.forEach(t => {
                correct += t.correct;
                attempted += t.attempted;
            });

            // Analyze performance for this specific topic
            const analysis = analyzePerformance(correct, attempted);

            // Generate plan based on this topic's performance
            const plan = generateRevisionPlan(analysis.classification, topic.topicName);
            const nextTestDays = suggestNextTest(analysis.classification);

            // Calculate next test date
            // FIX: Use the stored nextReviewDate if available, otherwise calculate default
            const nextTestDate = topic.nextReviewDate ? new Date(topic.nextReviewDate) : new Date();
            if (!topic.nextReviewDate) {
                nextTestDate.setDate(nextTestDate.getDate() + nextTestDays);
            }

            return {
                _id: topic._id,
                topic: topic.topicName,
                subject: topic.subject,
                classification: analysis.classification, // Weak, Medium, Strong
                strategy: plan.strategy,
                nextTestDate: nextTestDate
            };
        });

        res.json(detailedPlan);
    } catch (error) {
        console.error('Error in getRevisionPlan:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const getDailyDirection = async (req, res) => {
    try {
        const tests = await TestResult.find({ userId: req.user.id });
        const topics = await Topic.find({ userId: req.user.id });

        let weakCount = 0;
        let mediumCount = 0;
        let strongCount = 0;
        let recommendedTopic = null;

        // Calculate stats for all topics
        for (const topic of topics) {
            const topicTests = tests.filter(t => t.topicId.toString() === topic._id.toString());
            let correct = 0;
            let attempted = 0;

            topicTests.forEach(t => {
                correct += t.correct;
                attempted += t.attempted;
            });

            const { classification } = analyzePerformance(correct, attempted);

            if (classification === 'Weak') {
                weakCount++;
                if (!recommendedTopic) recommendedTopic = topic.topicName;
            } else if (classification === 'Medium') {
                mediumCount++;
            } else {
                strongCount++;
            }
        }

        let message = "Focus on adding more topics to build your revision plan.";

        if (topics.length === 0) {
            message = "Welcome! specific Start by adding a new topic to generate your personal AI revision plan.";
        } else if (weakCount > 0) {
            message = `Priority Focus: Review ${recommendedTopic} today to strengthen your weak areas.`;
        } else if (mediumCount > 0) {
            const medTopic = topics.find(t => {
                // re-calc to find a medium one
                const topicTests = tests.filter(test => test.topicId.toString() === t._id.toString());
                const stats = topicTests.reduce((acc, curr) => ({ c: acc.c + curr.correct, a: acc.a + curr.attempted }), { c: 0, a: 0 });
                return analyzePerformance(stats.c, stats.a).classification === 'Medium';
            });
            message = `Steady Progress: Continue practicing ${medTopic ? medTopic.topicName : 'your topics'} to reach mastery.`;
        } else if (strongCount > 0) {
            message = `You're doing great! Maintain your streak with a quick review of ${topics[0].topicName}.`;
        } else {
            // Default for new topics with no tests yet (defaults to Weak in analyzer usually, but if 0 attempted...)
            message = `Start taking tests to calibrate your AI study plan.`;
        }

        res.json({ message });
    } catch (error) {
        console.error("Error getting daily direction:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getRevisionPlan, getDailyDirection, getGeneratedTest, suggestConcepts };
