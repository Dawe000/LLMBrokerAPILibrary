import ApiClient from './apiclient.js';
import crypto from 'crypto';

import {BrokerABI,ServerABI,AgreementABI} from './abi.js';
import thirdwebPkg from "thirdweb/package.json" with { type: "json" };
import { 
    createThirdwebClient, 
    getContract, 
    prepareContractCall, 
    readContract,
    sendTransaction,
    waitForReceipt,
    parseEventLogs,
    prepareEvent
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

const brokerAddress = "0x13A9BBC98381Ea209dd6338BD9387Aad11DcD91D";

/**
 * UserApi class to interact with the Thirdweb API and the LLMBroker project
 * 
 */
class UserApi {
    /**
     * Constructor for the UserApi class
     * @param {Your thirdweb client} thirdWebClient 
     * @param {Web3 Account} account 
     * @param {Broker contract address} brokerAddress
     */
    constructor(thirdWebClient, account) {
        
        // If no client is provided, create a default one
        this.thirdWebClient = thirdWebClient || createThirdwebClient({
            clientId: "YOUR_CLIENT_ID" // Replace with your Thirdweb client ID if needed
        });
        this.account = account;
    };

    /**
     * Prompts the selected AI model with a conversation
     * @param {API URL} URL 
     * @param {Full conversation} messages 
     * @param {Max output tokens to be used in this request} max_Tokens 
     * @param {SHA256 Keypair for interacting with API and contract} keyPair 
     * @returns 
     */
    async PromptAI(URL, messages, max_Tokens, keyPair, walletAddress) {
        let apiClient = new ApiClient(URL);
        const signature = this.SignTransaction(messages, keyPair.privateKey);
        const data = {
            context: messages,
            num: max_Tokens,
            publicKey: this.account.address,
            signature: signature,
            address: walletAddress
        };
        return this.apiClient.post(`/`, data);
    };

    /**
     * Function calculating number of input tokens for a given set of messages
     * @param {API URL} URL 
     * @param {Messages to be tokenized} messages 
     * @returns Number of tokens for an input
     */
    async GetNumTokens(URL,messages){
        let apiClient = new ApiClient(URL);
        const data = {
            context: messages
        };
        return await apiClient.post('/tokens',data);
    };

    /**
     * 
     * @param {Target server} server 
     * @returns Returns the cost of input tokens for a server in wei
     */
    async GetServerInputPrice(server){
        const servers = await this.GetServerList();
        const targetServer = servers.find(s => s.serverContract === server);
        return targetServer.inputCost;
    };

    /**
     * 
     * @param {Target server} server 
     * @returns Returns the cost of output tokens for a server in wei
     */
    async GetServerOutputPrice(server){
        const servers = await this.GetServerList();
        const targetServer = servers.find(s => s.serverContract === server);
        return targetServer.outputCost;
    };

    async GetServerEndpoint(server){
        const servers = await this.GetServerList();
        const targetServer = servers.find(s => s.serverContract === server);
        return targetServer.endpoint;
    }

    async GetServerModel(server){
        const servers = await this.GetServerList();
        const targetServer = servers.find(s => s.serverContract === server);
        return targetServer.model;
    }

    /**
     * 
     * @param {Target server} server 
     * @param {Context} messages 
     * @returns Cost in wei for the server to process the input context
     */
    async GetServerContextPrice(server,messages){
        const inputPrice = await this.GetServerInputPrice(server);
        const numTokens = await this.GetNumTokens(this.GetServerEndpoint(server),messages);
        return (inputPrice) * numTokens;
    }

    /**
     * Returns a keypair for use with the protocol
     * @returns {Keypair}
     */
    CreateKeyPair() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
    };

    /**
     * Signs message to be validated by endpoint server
     * @param {Private key used in the protocol} privateKey 
     * @param {Message to sign} message 
     * @returns Signature
     */
    SignMessage(privateKey, message) {
        const signer = crypto.createSign('SHA256');
        signer.update(message);
        const signature = signer.sign(privateKey, 'base64');
        return signature;
    };

    /**
     * Verifies the signature of a message
     * @param {Public key used by user in the protocol} publicKey 
     * @param {Signature sent by user} signature 
     * @param {Message sent by user} message 
     * @returns Boolean
     */
    VerifySignature(publicKey, signature, message) {
        const verifier = crypto.createVerify('SHA256');
        verifier.update(message);
        return verifier.verify(publicKey, signature, 'base64');
    };

    /**
     * 
     * @returns Returns list of servers on the protocol
     */
    async GetServerList() {
        // Create contract with Coston 2 chain
        const brokerContract = getContract({
            address: brokerAddress, 
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
    };

    /**
     * Creates a server on the protocol
     * @returns the address of the created server
     */
    async CreateServer() {
        const brokerContract = getContract({
            address: this.brokerAddress, 
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
            
            const receipt = await waitForReceipt(result);
            
            const serverCreatedEvent = receipt.logs[0];

            const serverAddress = `0x${serverCreatedEvent.topics[1].slice(26)}`; // Remove padding

            return serverAddress;
        
    } catch (error) {
        console.error("Detailed Error:", {
            abiStructure: BrokerABI.filter(e => e.type === "event"),
            thirdwebVersion: thirdwebPkg.version, // Now using ES module import
            errorStack: error.stack
        });
        throw error;
        }
    };

    /**
     * Sets the parameters for a server
     * @param {Address of the server} serverAddress 
     * @param {Model being used} model 
     * @param {Cost per input token} inputCost 
     * @param {Cost per output token} outputCost 
     * @param {Endpoint URL for server} endpoint 
     * @param {Whether the server uses USD pricing or not} USD 
     * @returns 
     */
    async SetUpModel(serverAddress, model, inputCost, outputCost, endpoint, USD) {
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = prepareContractCall({
                contract: serverContract,
                method: "setupModel",
                params: [endpoint, model, inputCost, outputCost, USD]
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
    };

    /**
     * Sets the cost of input and output tokens for a server
     * @param {Address of server} serverAddress 
     * @param {New input token cost} inputCost 
     * @param {New output token cost} outputCost 
     * @returns 
     */
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
    };

    /**
     * Creates an agreement contract between a server and a client
     * @param {Address of target server} serverAddress 
     * @param {Your public key} publicKey 
     * @param {Amount of flare in wei being deposited} depositWei 
     * @returns 
     */
    async CreateAgreement(serverAddress, publicKey, depositWei){
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
                params: [publicKey],
                value: depositWei
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
    };

    /**
     * 
     * @param {Address of target server} serverAddress 
     * @param {Address of target clientId} clientAddress 
     * @returns Public key used by client in protocol
     */
    async GetClientPubKey(serverAddress,clientAddress){
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const publicKey = await readContract({
                contract: serverContract,
                method: "getAgreementPubKey",
                params: [clientAddress]
            });
            return publicKey;
        } catch (error) {
            console.error("Error fetching client public key:", error);
            throw error;
        }
    };

    /**
     * 
     * @param {Address of target server} serverAddress 
     * @param {Address of target client} clientAddress 
     * @returns Agreement contract of target client with this server or null
     */
    async GetClientAgreement(serverAddress,clientAddress){
        const serverContract = getContract({
            address: serverAddress, 
            abi: ServerABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const agreement = await readContract({
                contract: serverContract,
                method: "getAgreementContract",
                params: [clientAddress]
            });
            return agreement;
        } catch (error) {
            console.error("Error fetching client agreement:", error);
            throw error;
        }
    }

    /**
     * Allows the server to deduct tokens from client account
     * @param {Address of target agreement contract} agreementAddress 
     * @param {Number of input tokens used} inputTokens 
     * @param {Number of output tokens used} outputTokens 
     * @returns 
     */
    async NotifyResponse(agreementAddress,inputTokens,outputTokens){
        const agreementContract = getContract({
            address: agreementAddress, 
            abi: AgreementABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = await prepareContractCall({
                contract: agreementContract,
                method: "notifyResponse",
                params: [inputTokens,outputTokens]
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error notifying response:", error);
            throw error;
        }
    };

    /**
     * Allows client to notify contract of satisfaction
     * @param {Address of target agreement contract} agreementAddress 
     * @returns 
     */
    async NotifySatisfied(agreementAddress){
        const agreementContract = getContract({
            address: agreementAddress, 
            abi: AgreementABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = await prepareContractCall({
                contract: agreementContract,
                method: "notifySatisfied",
                params: []
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error notifying satisfaction:", error);
            throw error;
        }
    };

    /**
     * Allows client to notify contract oF dissatisfaction
     * @param {Address of target agreement contract} agreementAddress 
     * @returns 
     */
    async NotifyUnsatisfied(agreementAddress){
        const agreementContract = getContract({
            address: agreementAddress, 
            abi: AgreementABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = await prepareContractCall({
                contract: agreementContract,
                method: "notifyUnsatisfied",
                params: []
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error notifying unsatisfaction:", error);
            throw error;
        }
    };

    /**
     * Refunds remaining tokens to user
     * @param {Address of agreement contract} agreementAddress 
     * @returns 
     */
    async RefundTokens(agreementAddress){
        const agreementContract = getContract({
            address: agreementAddress, 
            abi: AgreementABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const transaction = await prepareContractCall({
                contract: agreementContract,
                method: "refundTokens",
                params: []
            });
            
            const result = await sendTransaction({
                transaction,
                account: this.account,
                chain: costonTwo
            });
            
            return result;
        } catch (error) {
            console.error("Error refunding tokens:", error);
            throw error;
        }
    };

    /**
     * 
     * @param {Target address} address 
     * @returns Returns all servers owned by this address
     */
    async GetWalletServerList(address){
        const servers = this.GetServerList();
        return servers.filter(server => server.owner === address);
    };

    /**
     * 
     * @param {Target address} address 
     * @returns Returns all agreement contracts associated with this wallet
     */
    async GetWalletAgreements(address) {
        try {
            const servers = await this.GetServerList();
            
            let agreements = await Promise.all(
                servers.map(async server => {
                    const agreement = await this.GetClientAgreement(server.serverContract, address);
                    return agreement;
                })
            );
            
            // Filter out null agreements AND zero addresses
            return agreements.filter(agreement => 
                agreement !== null && 
                agreement !== '0x0000000000000000000000000000000000000000'
            );
        } catch (error) {
            console.error("Error getting wallet agreements:", error);
            throw error;
        }
    };

    /**
     * 
     * @param {Target LLM model} model 
     * @returns Returns servers sorted by cheapest of the target LLM model
     */
    async GetSortedServers(model){
        let servers = await this.GetServerList();
        servers = servers.filter(server => server.model === model);
        servers.sort((a,b) => (a.outputCost+a.outputCost) - (b.outputCost+b.outputCost));
        return servers;
    }

    async GetRemainingTokens(agreementAddress){
        const agreementContract = getContract({
            address: agreementAddress, 
            abi: AgreementABI, 
            chain: costonTwo, 
            client: this.thirdWebClient
        });

        try {
            const tokens = await readContract({
                contract: agreementContract,
                method: "remainingBalance",
                params: []
            });
            return tokens;
        } catch (error) {
            console.error("Error fetching remaining tokens:", error);
            throw error;
        }
    }
}

export default UserApi;