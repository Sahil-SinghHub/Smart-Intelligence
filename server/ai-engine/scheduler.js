const calculate_smart_schedule = (complexity, priority, last_score = null, current_interval = 0, ease_factor = 2.5) => {
    // 1. Mapping Complexity to a Divider
    // Harder topics = Smaller intervals (more frequent revision)
    const complexity_map = {
        "Easy": 0.8,   // Gap thoda bada kar dega
        "Medium": 1.0, // Neutral
        "Hard": 1.3    // Gap chota kar dega (1.3x more frequent)
    };
    // Default to 1.0 if complexity is not found or is null
    const comp_multiplier = complexity_map[complexity] || 1.0;

    // Ensure numeric types
    current_interval = parseInt(current_interval) || 0;

    let next_interval;

    // 2. Logic Implementation

    if (last_score !== null) {
        last_score = parseInt(last_score);

        // Case A: First Time Test (Interval was 0)
        if (current_interval === 0) {
            if (last_score >= 90) next_interval = 4;      // Excellent start -> 4 days
            else if (last_score >= 70) next_interval = 2; // Good start -> 2 days
            else next_interval = 1;                       // Needs work -> 1 day
        }
        // Case B: Subsequent Reviews (Established Interval)
        else {
            if (last_score >= 80) {
                // Success: Increase Gap significantly
                // Use ease_factor (default 2.5)
                // If perfect score (100), give a small bonus multiplier (1.1x)
                const bonus = (last_score === 100) ? 1.1 : 1.0;
                next_interval = (current_interval * ease_factor * bonus) / comp_multiplier;
            } else if (last_score >= 50) {
                // Struggle / Passable: Slight Increase or Maintain
                // E.g. Multiply by 1.2 instead of 2.5
                next_interval = (current_interval * 1.2) / comp_multiplier;
            } else {
                // Fail: Decrease / Reset ("Kam kro")
                if (priority === "High") {
                    next_interval = 1; // Immediate Review
                } else {
                    // Halve the interval or reset to 1 if it's already small
                    next_interval = Math.max(1, Math.floor(current_interval / 2));
                }
            }
        }
    } else {
        // No score provided (just creating schedule?)
        if (current_interval === 0) {
            if (complexity === "Hard") next_interval = 1;
            else next_interval = 2;
        } else {
            next_interval = current_interval;
        }
    }

    // Final cleanup
    next_interval = Math.max(1, Math.round(next_interval));

    // Calculate dates
    const today = new Date();
    const next_revision_date = new Date(today);
    next_revision_date.setDate(today.getDate() + next_interval);

    return {
        next_revision_date: next_revision_date,
        days_until_next: next_interval,
        priority_score: (priority === "High") ? 100 : 50
    };
};

module.exports = { calculate_smart_schedule };
