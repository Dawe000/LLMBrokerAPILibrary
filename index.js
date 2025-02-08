import { config } from "dotenv";
import { UserApi } from "./src/userapi.js";
import readline from 'readline';
import { client } from "./src/client.js";
import { createWallet, privateKeyToAccount } from "thirdweb/wallets";


config();
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
    const wallet = createWallet("local");
    const account = await privateKeyToAccount({
        client,
        privateKey: process.env.PRIVATE_KEY
    
    });
    let api = new UserApi(client,account);

    console.log(account.address);
    const servers = await api.GetServerList();
    console.log(servers);

    //const serverAddress = await api.CreateServer();
}

main(); // Start the main function