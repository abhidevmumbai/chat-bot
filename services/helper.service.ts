import { WelcomeConversation, InfoConversation } from '../conversations';

class Helper {
    private conversations: {};

    constructor() {
        this.conversations = { ...WelcomeConversation, ...InfoConversation };
    }

    getRandomReply(key) {
        const len = this.conversations[key].questions.length;
        const index = len > 1 ? Math.floor(Math.random() * len) : 0;
        return this.conversations[key].questions[index];
    }
}

export const HelperService = new Helper();
