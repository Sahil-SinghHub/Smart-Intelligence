const Topic = require('../models/Topic');

const addTopic = async (req, res) => {
    const { subject, topicName, difficulty, priority, keyPoints } = req.body;

    try {
        console.log('Adding topic:', { subject, topicName, userId: req.user.id, keyPoints });
        const topic = await Topic.create({
            userId: req.user.id,
            subject,
            topicName,
            difficulty,
            priority,
            keyPoints: keyPoints || [],
        });
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error adding topic:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({ userId: req.user.id });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Ensure user owns topic
        if (topic.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Use deleteOne instead of remove
        await Topic.deleteOne({ _id: topic._id });

        // Also delete associated test results to keep data clean
        // We need to require TestResult model first if not already there, 
        // but let's check imports. Topic is there. 
        // We'll trust TestResult is needed or we can import it.
        // Wait, I need to check if TestResult is imported. 
        // It is NOT imported in the original file view. I should add the import too.
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addTopic, getTopics, deleteTopic };
