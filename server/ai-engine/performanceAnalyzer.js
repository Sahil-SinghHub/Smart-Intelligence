/**
 * Analyzes test performance and returns metrics + classification.
 * @param {number} correct 
 * @param {number} totalAttempted 
 * @returns {Object} result { accuracy, classification }
 */
const analyzePerformance = (correct, totalAttempted) => {
    if (totalAttempted === 0) {
        return { accuracy: 0, classification: 'Weak' };
    }

    const accuracy = (correct / totalAttempted) * 100;
    let classification = 'Weak';

    if (accuracy >= 75) {
        classification = 'Strong';
    } else if (accuracy >= 50) {
        classification = 'Medium';
    }

    return { accuracy, classification };
};

module.exports = { analyzePerformance };
