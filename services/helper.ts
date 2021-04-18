import { WelcomeConversation, InfoConversation } from '../conversations';

class HelperService {
    private conversations: {};

    constructor() {
        this.conversations = { ...WelcomeConversation, ...InfoConversation };
    }

    getRandomReply(key) {
        const len = this.conversations[key].questions.length;
        console.log(this.conversations);
        return this.conversations[key].questions[
            Math.floor(Math.random() * len - 1)
        ];
    }
}

export const Helper = new HelperService();
