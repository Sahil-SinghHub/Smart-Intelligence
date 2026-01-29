/**
 * Generates a rule-based test using topic key points.
 * @param {string} topicName
 * @param {string} subject
 * @param {string[]} keyPoints
 * @param {string} difficulty
 * @returns {Object} test structure
 */
const generateTest = (topicName, subject, keyPoints, difficulty) => {
    const questions = [];

    // If no key points, return generic fallback
    const points = keyPoints && keyPoints.length > 0
        ? keyPoints
        : [topicName, `${topicName} Concepts`, `${topicName} Principles`];

    // 1. Multiple Choice (Simulated True/False style or Definition matching)
    // Since we can't generate distractors easily without LLM, we'll use "Which of these relates to..." logic or True/False
    points.slice(0, 2).forEach((point, index) => {
        questions.push({
            id: `mcq_${index}`,
            type: 'MCQ',
            question: `Which concept is primarily associated with "${point}" in the context of ${subject}?`,
            options: [
                point,
                `Not ${point}`,
                'Unrelated Concept',
                'None of the above'
            ],
            correctAnswer: point,
            explanation: `${point} is a core key point of ${topicName}.`
        });
    });

    // 2. Short Answer Questions (Definition/Explanation)
    points.forEach((point, index) => {
        questions.push({
            id: `sa_${index}`,
            type: 'Short Answer',
            question: `Define and explain the significance of "${point}".`,
            answerKey: `Key elements: Definition of ${point}, its role in ${subject}, and examples.`,
            explanation: `Understanding ${point} is crucial for mastering ${topicName}.`
        });
    });

    // 3. Conceptual Questions (Relational)
    if (points.length >= 2) {
        questions.push({
            id: 'concept_1',
            type: 'Conceptual',
            question: `Compare and contrast "${points[0]}" and "${points[1]}". How are they connected?`,
            answerKey: 'Look for: Similarities, differences, and interaction between the two concepts.',
            explanation: 'Conceptual mastery requires understanding relationships between key points.'
        });
    } else {
        questions.push({
            id: 'concept_1',
            type: 'Conceptual',
            question: `Explain the core concept of ${topicName} in your own words.`,
            answerKey: 'Student should summarize the main idea.',
            explanation: 'Self-explanation is a powerful revision technique.'
        });
    }

    // 4. Application Question
    const appPoint = points[points.length - 1];
    questions.push({
        id: 'app_1',
        type: 'Application',
        question: `Describe a real-world scenario or a practical problem where "${appPoint}" is applied.`,
        answerKey: `Example: Using ${appPoint} to solve X or in situation Y.`,
        explanation: `Application proves understanding of how ${appPoint} works in practice.`
    });

    // Difficulty adjustment (Simulated by just tagging, but logic could remove hints for Hard)
    const meta = {
        topic: topicName,
        subject,
        difficulty,
        totalQuestions: questions.length,
        generatedAt: new Date()
    };

    return { meta, questions };
};

module.exports = { generateTest };
