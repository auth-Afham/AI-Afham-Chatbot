// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

exports.handler = async function (event, context) {
    const { userMessage } = JSON.parse(event.body); // Extract user input from the request body

    const MODEL_NAME = "gemini-pro";
    const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

    if (!API_KEY) throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    let parts = [
        { text: "input: What is your name?" },
        { text: "output: My name is Afham Irfan." },
        { text: "input: How old are you?" },
        { text: "output: I am 21 years old." },
        { text: "input: Where do you live?" },
        { text: "output: I live in Selangor, Malaysia." }
    ];

    let aiResponse = ""; // Variable to store AI-generated response

    if (userMessage !== '') {
        // Append the new message to the parts array
        parts.push({ text: `input: ${userMessage}` }, { text: `output: ` });
        console.log('You: ' + userMessage);

        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
                safetySettings,
            });

            const response = await result.response;
            aiResponse = response.text(); // Store the AI-generated response
            console.log('AI-Afham: ' + aiResponse);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ response: aiResponse }), // Send AI-generated response back to chatbot.js
    };
};
