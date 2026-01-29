/**
 * Generates revision strategy and schedule based on topic classification.
 * @param {string} classification - Weak | Medium | Strong
 * @param {string} topicName
 * @returns {Object} plan { strategy, nextRevisionDays }
 */
const generateRevisionPlan = (classification, topicName) => {
    let strategy = [];
    let nextRevisionDays = 1;

    switch (classification) {
        case 'Weak':
            strategy = [
                `Revise core concepts of ${topicName}`,
                'Study solved examples',
                'Solve 5-8 practice questions'
            ];
            nextRevisionDays = 1; // Revise tomorrow
            break;
        case 'Medium':
            strategy = [
                `Revise notes for ${topicName}`,
                'Solve 3-5 practice questions'
            ];
            nextRevisionDays = 3; // Revise in 3 days
            break;
        case 'Strong':
            strategy = [
                `Quick revision of ${topicName}`,
                'Spend 10-15 minutes reviewing key points'
            ];
            nextRevisionDays = 7; // Revise in a week
            break;
        default:
            strategy = ['Review topic'];
            nextRevisionDays = 1;
    }

    return { strategy, nextRevisionDays };
};

module.exports = { generateRevisionPlan };
