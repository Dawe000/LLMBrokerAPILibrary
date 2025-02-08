import ApiClient from './apiclient.js';
import crypto from 'crypto';

import {BrokerABI,ServerABI,AgreementABI} from './abi.js';

import { 
    createThirdwebClient, 
    getContract, 
    prepareContractCall, 
    readContract,
    sendTransaction
} from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Define Flare Coston 2 Testnet
const costonTwo = defineChain({
    id: 114,
    name: "Flare Coston2 Testnet",
    rpc: "https://coston2-api.flare.network/ext/bc/C/rpc",
    nativeCurrency: {
        name: "C2FLR",
        symbol: "C2FLR",
        decimals: 18
    },
    blockExplorerUrl: "https://coston2-explorer.flare.network"
});

const _brokerAddress = "0x9e205eD5AdEDC819EDC066CB852CA74B1A7727Fe";

class UserApi {
    constructor(thirdWebClient, account) {
        
        // If no client is provided, create a default one
        this.thirdWebClient = thirdWebClient || createThirdwebClient({
            clientId: "YOUR_CLIENT_ID" // Replace with your Thirdweb client ID if needed
        });
        this.account = account;
    }

    async PromptAI(baseURL, ai, messages, max_Tokens, keyPair) {
        let apiClient = new ApiClient(baseURL);
        const signature = this.SignTransaction(messages, keyPair.privateKey);
        const data = {
            context: messages,
            num: max_Tokens,
            publicAddress: this.account.address,
            signature: signature
        };
        return this.apiClient.post(`/${ai}`, data);
    }

    CreateKeyPair() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
    }

    SignMessage(privateKey, message) {
        const signer = crypto.createSign('SHA256');
        signer.update(message);
        const signature = signer.sign(privateKey, 'base64');
        return signature;
    }

    VerifySignature(publicKey, signature, message) {
        const verifier = crypto.createVerify('SHA256');
        verifier.update(message);
        return verifier.verify(publicKey, signature, 'base64');
    }

    async GetServerList() {
        // Create contract with Coston 2 chain
        const brokerContract = getContract({
            address: _brokerAddress, 
            abi: BrokerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            // Use readContract to call the method
            const serverList = await readContract({
                contract: brokerContract,
                method: "getAllServers",
                params: []
            });
            return serverList;
        } catch (error) {
            console.error("Error fetching server list:", error);
            throw error;
        }
    }

    async CreateServer() {
        const brokerContract = getContract({
            address: _brokerAddress, 
            abi: BrokerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });
    
        try {
            const transaction = await prepareContractCall({
                contract: brokerContract,
                method: "createServer",
                params: []
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error creating server:", error);
            throw error;
        }
    }

    async SetUpModel(serverAddress, model, inputCost, outputCost, endpoint) {
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = await prepareContractCall({
                contract: serverContract,
                method: "setupModel",
                params: [endpoint, model, inputCost, outputCost]
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error setting up model:", error);
            throw error;
        }
    }

    async SetTokenCost(serverAddress, inputCost, outputCost) {
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = await prepareContractCall({
                contract: serverContract,
                method: "setTokenCost",
                params: [inputCost, outputCost]
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error setting token cost:", error);
            throw error;
        }
    }


    async CreateAgreement(serverAddress, publicKey){
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try{
            const transaction = await prepareContractCall({
                contract: serverContract,
                method: "createAgreement",
                params: [publicKey]
            });

            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });

            return result;
        }
        catch(error){
            console.error("Error creating agreement:", error);
            throw error;
        }
    }

    async GetAgreements(serverAddress){
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const agreements = await readContract({
                contract: serverContract,
                method: "getAgreements",
                params: []
            });
            return agreements;
        } catch (error) {
            console.error("Error fetching agreements:", error);
            throw error;
        }
    }


}

// Export the UserApi class
export { UserApi };