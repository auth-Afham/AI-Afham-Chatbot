document.addEventListener('DOMContentLoaded', async function () {
    const chatContainer = document.getElementById('chat');
    const userInput = document.getElementById('user-input');

    async function appendMessage(text) {
        const message = document.createElement('div');
        message.innerText = text;
        chatContainer.innerHTML = ''; // Clear previous content
        chatContainer.appendChild(message); // Append the new message without clearing previous content
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessageButton() {
        const userMessage = userInput.value.trim();
        if (userMessage !== '') {
            // Append the new message to the parts array
            console.log('You: ' + userMessage);
            appendMessage("Received: \"" + userMessage + "\"\n\nPlease wait a few seconds...");
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                const response = await fetch('/.netlify/functions/generate-response', {
                    method: 'POST', // Change method to POST
                    body: JSON.stringify({ userMessage }), // Pass userMessage as JSON string in the body
                    headers: {
                        'Content-Type': 'application/json' // Set content type header
                    }
                });
                const data = await response.json();
                const text = data.response; // Extract response from data
                console.log('AI-Afham: ' + text);
                appendMessage(text);
            } catch (error) {
                console.error('Error:', error);
                appendMessage('\nOops! Something went wrong. Please try again.');
            }
            
            userInput.value = ''; // Clear user input after sending message
        }
    }

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            sendMessageButton();
        }
    });
});
