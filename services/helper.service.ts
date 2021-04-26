import {
    InfoConversation,
    MenuConversation,
    MoviesConversation,
    WelcomeConversation,
} from '../constants';

import { DataService } from '.';

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

    getRandomReply(key: string): string {
        const len = this.conversations[key].replies.length;
        const index = len > 1 ? Math.floor(Math.random() * len) : 0;
        return this.conversations[key].replies[index];
    }

    setSelectedGenre() {
        let genres = DataService.get('genres');
        if (genres?.length) {
            const selectedGenreName = DataService.get('selectedGenreName');
            if (selectedGenreName) {
                const selectedGenre = genres.find(
                    (item) => item.name.toLowerCase() === selectedGenreName
                );
                DataService.set(
                    'selectedGenre',
                    selectedGenre && selectedGenre
                );
            }
        }
    }
}

export const HelperService = new Helper();
