const { generateTest } = require('./ai-engine/testGenerator');

async function testAI() {
    console.log("Testing AI Generation with Ollama (Timeout configured)...");
    const start = Date.now();
    try {
        // Asking for a simple topic to speed it up
        const result = await generateTest("Atoms", "Physics", ["Protons", "Electrons"], "Easy", "Low");
        const duration = (Date.now() - start) / 1000;
        console.log(`Generation completed in ${duration} seconds`);
        console.log("Meta:", result.meta);
        console.log("Questions Generated:", result.questions.length);
    } catch (error) {
        console.error("Verification Failed:", error);
    }
}

testAI();
