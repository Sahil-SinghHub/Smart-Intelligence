const mongoose = require('mongoose');
const { calculate_smart_schedule } = require('./ai-engine/scheduler');

// Mock Data
const topic = {
    difficulty: 'Hard',
    priority: 'High',
    interval: 0,
    easeFactor: 2.5
};

const testResult = {
    accuracy: 85 // Passed
};

console.log("--- Test Case 1: First Revision (Hard, High Priority) ---");
let schedule = calculate_smart_schedule(topic.difficulty, topic.priority, null, topic.interval, topic.easeFactor);
console.log("Initial Schedule:", schedule);

// Update topic
topic.interval = schedule.days_until_next;

console.log("\n--- Test Case 2: Second Revision (Success) ---");
schedule = calculate_smart_schedule(topic.difficulty, topic.priority, testResult.accuracy, topic.interval, topic.easeFactor);
console.log("Success Schedule:", schedule);

console.log("\n--- Test Case 3: Failure (Reset) ---");
schedule = calculate_smart_schedule(topic.difficulty, topic.priority, 30, topic.interval, topic.easeFactor); // Fail
console.log("Failure Schedule:", schedule);
