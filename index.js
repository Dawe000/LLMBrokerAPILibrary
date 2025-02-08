import { config } from "dotenv";
import { UserApi } from "./src/userapi.js";
import readline from 'readline';
import { client } from "./src/client.js";
import { createWallet, privateKeyToAccount } from "thirdweb/wallets";

let api = new UserApi("http://localhost:8080");
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

    console.log("Wallet address: ", account.address);
    console.log(account.address);
    let userapi = new UserApi(client,account);
    
    let serverList = await userapi.GetServerList();

    console.log("Server List: ", serverList);

    //let result = await userapi.SetUpModel("0xa51dc9055EB7C2c8cb79018fA30bD6Aa23f21c82","test",12,21,"/test");
    //let result = await userapi.CreateServer();


    //serverList = await userapi.GetServerList();

    //console.log("Server List: ", serverList);
}

main(); // Start the main function