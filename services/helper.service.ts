import {
    InfoConversation,
    MenuConversation,
    WelcomeConversation,
} from '../conversations';
import { MoviesConversation } from '../conversations/movie.conversation';

class Helper {
    conversations;

    constructor() {
        this.conversations = {
            ...WelcomeConversation,
            ...InfoConversation,
            ...MenuConversation,
            ...MoviesConversation,
        };
    }

    getRandomReply(key): string {
        const len = this.conversations[key].replies.length;
        const index = len > 1 ? Math.floor(Math.random() * len) : 0;
        return this.conversations[key].replies[index];
    }
}

export const HelperService = new Helper();
