const express = require('express');
const router = express.Router();
const { addTopic, getTopics, deleteTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addTopic);
router.get('/', protect, getTopics);
router.delete('/:id', protect, deleteTopic);

module.exports = router;
