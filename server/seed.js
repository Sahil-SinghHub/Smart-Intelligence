const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Topic = require('./models/Topic');
const TestResult = require('./models/TestResult');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-revision-planner');
        console.log('MongoDB Connected');

        await User.deleteMany({});
        await Topic.deleteMany({});
        await TestResult.deleteMany({});

        // Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const user = await User.create({
            name: 'Test Student',
            email: 'student@example.com',
            password: hashedPassword,
        });

        console.log('User created: student@example.com / password123');

        // Create Topics
        const topics = await Topic.create([
            { userId: user._id, subject: 'Math', topicName: 'Calculus', difficulty: 'Hard', priority: 'High' },
            { userId: user._id, subject: 'Science', topicName: 'Physics - Kinematics', difficulty: 'Medium', priority: 'Medium' },
            { userId: user._id, subject: 'History', topicName: 'World War II', difficulty: 'Easy', priority: 'Low' },
        ]);

        console.log('Topics created');

        // Create Test Results (Simulate history)
        // 1. Calculus (Hard) - Weak result
        await TestResult.create({
            userId: user._id,
            topicId: topics[0]._id,
            totalQuestions: 10,
            attempted: 10,
            correct: 4,
            wrong: 6,
            accuracy: 40,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        });

        // 2. Physics (Medium) - Strong result
        await TestResult.create({
            userId: user._id,
            topicId: topics[1]._id,
            totalQuestions: 10,
            attempted: 10,
            correct: 9,
            wrong: 1,
            accuracy: 90,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        });

        console.log('Test results created');

        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
