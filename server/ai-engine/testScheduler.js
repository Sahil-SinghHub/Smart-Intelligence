/**
 * Suggests when to take the next test based on performance.
 * @param {string} classification - Weak | Medium | Strong
 * @returns {number} daysUntilNextTest
 */
const suggestNextTest = (classification) => {
    switch (classification) {
        case 'Weak':
            return 2; // Test again in 2 days
        case 'Medium':
            return 4; // Test again in 4 days
        case 'Strong':
            return 7; // Test again in 7 days
        default:
            return 3;
    }
};

module.exports = { suggestNextTest };
