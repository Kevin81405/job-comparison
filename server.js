require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");

const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60_000,
    maxRetries: 0
});
const PORT = process.env.PORT || 3000;


// Allow the server to read JSON sent by the browser
app.use(express.json());


// Make our HTML, CSS, and JavaScript available
app.use(express.static(__dirname));


// JOB COMPARISON API
app.post("/api/compare", async (req, res) => {

    // Get the two job descriptions sent by the browser
    const { job1, job2 } = req.body;


    // Make sure both descriptions exist
    if (!job1 || !job2) {

        return res.status(400).json({
            error: "Two job descriptions are required."
        });

    }


    // Show us in the terminal that the server received them
    console.log("Job 1 received:");
    console.log(job1);

    console.log("Job 2 received:");
    console.log(job2);


    
    // AI 
    try {
    const startedAt = Date.now();
    const completion = await openai.chat.completions.create({

        model: "gpt-5.4-nano",
        reasoning_effort: "none",

        messages: [
            {
                role: "system",
                content: `
You analyze job postings.

Extract only information explicitly stated in the job descriptions.
Never guess or invent missing information.

If information is not provided, return "Not listed".

Return ONLY valid JSON using exactly this structure:

{
    "job1": {
        "salary": "",
        "workStyle": "",
        "location": "",
        "experience": "",
        "education": "",
        "skills": "",
        "benefits": ""
    },
    "job2": {
        "salary": "",
        "workStyle": "",
        "location": "",
        "experience": "",
        "education": "",
        "skills": "",
        "benefits": ""
    },
    "summary": ""
}

For skills and benefits, separate items with " • ".

The summary should neutrally explain the most important differences
between the two opportunities. Do not say that one job is better.
`
            },

            {
                role: "user",
                content: `
JOB 1:
${job1}

JOB 2:
${job2}
`
            }
        ]

    });

    console.log(
    "AI request duration:",
    Date.now() - startedAt,
    "ms"
);

console.log("Token usage:", completion.usage);


    const aiResponse = completion.choices[0].message.content;

    console.log("AI response:");
    console.log(aiResponse);

    const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const comparison = JSON.parse(cleanedResponse);

    res.json(comparison);


} catch (error) {

    console.error("AI comparison error:");
    console.error(error);

    res.status(500).json({
        error: "The AI comparison could not be completed."
    });

}

});


// -------------------------------------
// START SERVER
// -------------------------------------

app.listen(PORT, () => {

    console.log(
        `Job Comparison server running at http://localhost:${PORT}`
    );

});