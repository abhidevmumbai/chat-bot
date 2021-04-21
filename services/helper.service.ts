import {
    InfoConversation,
    MenuConversation,
    WelcomeConversation,
} from '../conversations';
import { MovieConversation } from '../conversations/movie.conversation';

class Helper {
    conversations;

    constructor() {
        this.conversations = {
            ...WelcomeConversation,
            ...InfoConversation,
            ...MenuConversation,
            ...MovieConversation,
        };
    }

    getRandomReply(key): string {
        const len = this.conversations[key].replies.length;
        const index = len > 1 ? Math.floor(Math.random() * len) : 0;
        return this.conversations[key].replies[index];
    }
}

export const HelperService = new Helper();
