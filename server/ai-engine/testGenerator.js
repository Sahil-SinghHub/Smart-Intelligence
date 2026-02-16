const axios = require('axios');

/**
 * Generates a test using local Ollama LLM with a robust fallback.
 * @param {string} topicName
 * @param {string} subject
 * @param {string[]} keyPoints
 * @param {string} difficulty
 * @param {string} priority
 * @returns {Promise<Object>} test structure
 */
const generateTest = async (topicName, subject, keyPoints, difficulty, priority = 'Medium') => {
    // Helper to create smart fallback questions based on input
    const createFallbackQuestions = () => {
        const points = keyPoints && keyPoints.length > 0 ? keyPoints : [topicName, `${topicName} Concepts`, `${topicName} Applications`];

        return points.slice(0, 5).map((point, i) => ({
            id: `fallback_${i}`,
            type: 'MCQ',
            question: `Which of the following best describes the core concept of ${point}?`,
            options: [
                `${point} is a fundamental principle in ${subject}.`,
                `${point} is unrelated to ${topicName}.`,
                `${point} was discovered in 2024.`,
                `${point} is a type of chemical reaction.`
            ],
            correctAnswer: `${point} is a fundamental principle in ${subject}.`,
            explanation: `This is a key aspect of ${topicName} in the field of ${subject}.`
        }));
    };

    try {
        console.log(`Attempting AI generation for ${topicName} with 45s timeout...`);

        // Timeout set to 45s to allow deep thinking on local machines, but preventing infinite hangs
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const prompt = `
        You are a strict academic examiner. Create 3 HIGH-QUALITY, CONCEPTUAL multiple-choice questions for "${topicName}" (${subject}).
        
        Context:
        - Input Notes: ${keyPoints ? keyPoints.join(', ') : 'General Analysis'}.
        - Goal: Test deep understanding, application, and scenarios. AVOID simple definitions.
        
        Format: JSON Object ONLY.
        { "questions": [{ "question": "Scenario/Concept...", "options": ["A","B","C","D"], "correctAnswer": "...", "explanation": "Why..." }] }
        `;

        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt: prompt,
            stream: false,
            format: 'json',
            options: { num_predict: 512, temperature: 0.6 }
        }, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = response.data;
        let generatedJson = JSON.parse(data.response);

        return {
            meta: {
                topic: topicName,
                subject,
                difficulty,
                totalQuestions: generatedJson.questions.length,
                generatedAt: new Date()
            },
            questions: generatedJson.questions.map((q, i) => ({
                id: `ai_gen_${i}`,
                type: 'MCQ',
                ...q
            }))
        };

    } catch (error) {
        console.error("AI Generation Failed/Timed Out. Switching to Smart Fallback:", error.message);

        // Smart Fallback
        const fallbackQuestions = createFallbackQuestions();

        return {
            meta: { topic: topicName, difficulty, note: "Generated via Smart Rule-Based Engine (AI Timeout)" },
            questions: fallbackQuestions
        };
    }
};

module.exports = { generateTest };
