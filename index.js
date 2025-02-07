import { UserApi } from "./src/userapi.js";
import readline from 'readline';

let api = new UserApi("http://localhost:8080");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let messages = [];

// Function to ask a question and return a Promise
function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

function removeThinkTags(input) {
    // Use regex to remove <think>...</think> along with any surrounding whitespace
    const cleaned = input.replace(/<think>.*?<\/think>/gs, '').trim();
    return cleaned;
}

async function main() {
    let message = {
        role: "user",
        content: ""
    };

    while (message.content !== "exit") {
        message.content = await askQuestion("Enter a message (exit to exit): ");
        
        if (message.content !== "exit") {
            messages.push(message);
            const reply = await api.PromptAI("deepseek", messages, 700);
            messages = reply.generated_text;
            const replytext = removeThinkTags(reply.generated_text[reply.generated_text.length - 1].content);
            console.log(replytext);
        }
    }

    console.log("Goodbye!");
    rl.close(); // Close the readline interface when done
}

main(); // Start the main function