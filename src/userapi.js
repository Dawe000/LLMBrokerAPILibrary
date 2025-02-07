import ApiClient from './apiclient.js';

class UserApi {
    constructor(baseURL) {
        this.apiClient = new ApiClient(baseURL);
    }

    async PromptAI(ai, messages, max_Tokens) {
        const data = {
            context: messages,
            num: max_Tokens
        };
        return this.apiClient.post(`/${ai}`, data);
    }
}

// Export the UserApi class
export { UserApi };