// Import the functions you need from the SDKs you need
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
// const functions = require('firebase-functions');

const MODEL_NAME = "gemini-pro";
const API_KEY = "YOUR_API_KEY";

document.addEventListener('DOMContentLoaded', async function () {
    const chatContainer = document.getElementById('chat');
    const userInput = document.getElementById('user-input');

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
        {text: "input: What is your name?"},
        {text: "output: My name is Afham Irfan."},
        {text: "input: How old are you?"},
        {text: "output: I am 21 years old."},
        {text: "input: Where do you live?"},
        {text: "output: I live in Selangor, Malaysia."},
    ];

    async function appendMessage(role, text) {
        const message = document.createElement('div');
        message.classList.add(role);
        message.innerText = text;
        chatContainer.innerHTML = ''; // Clear previous content
        chatContainer.appendChild(message);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Update the conversation for printing in the terminal
        console.log(`${role}: ${text}\n`);
    }

    async function sendMessageButton(parts) {
        const userMessage = userInput.value.trim();
        if (userMessage !== '') {
            // Append the new message to the parts array
            parts.push({ text: `input: ${userMessage}` }, { text: `output: ` });

            appendMessage('user', userMessage);

            const waitMessage = document.createElement('div');
            waitMessage.classList.add('chatbot');
            waitMessage.innerText = '\nPlease wait for a few seconds...';
            chatContainer.appendChild(waitMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
                safetySettings,
                });

                const response = await result.response;
                const text = response.text();
                // const editedText = 'AI-Afham Chatbot may display inaccurate info, including about people, so double-check its responses.\n\n' + text
                appendMessage('chatbot', text);
            } catch (error) {
                console.error('Error:', error);
                waitMessage.innerText = '\nOops! Something went wrong. Please try again.';
            }
            
            // Remove the last two elements
            parts.pop(); // Remove the oldest message
            parts.pop(); // Remove the oldest message
            userInput.value = '';
        }
    }

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            sendMessageButton(parts);
        }
    });

    // Display the alert when the page loads
    document.addEventListener('DOMContentLoaded', function () {
        const alert = document.getElementById('alert');
        alert.style.display = 'block';
    });

    // Function to dismiss the alert
    function dismissAlert() {
        const alert = document.getElementById('alert');
        alert.style.display = 'none';
    }
});