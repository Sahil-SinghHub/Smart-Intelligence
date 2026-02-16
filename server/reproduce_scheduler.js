const { calculate_smart_schedule } = require('./ai-engine/scheduler');

console.log("--- Test Case 1: First Attempt (Interval 0), Score 100 (Excellent) ---");
console.log(calculate_smart_schedule('Medium', 'Medium', 100, 0, 2.5));

console.log("\n--- Test Case 2: Established Topic (Interval 10), Score 100 (Excellent) ---");
console.log(calculate_smart_schedule('Medium', 'Medium', 100, 10, 2.5));

console.log("\n--- Test Case 3: Establish Topic (Interval 10), Score 40 (Fail) ---");
console.log(calculate_smart_schedule('Medium', 'Medium', 40, 10, 2.5));

console.log("\n--- Test Case 4: No Score (Just accessing?) ---");
console.log(calculate_smart_schedule('Medium', 'Medium', null, 10, 2.5));
