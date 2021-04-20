import { DataService, HelperService } from '../services';

import { StateTypes } from '../enums';

export const InfoState = {
    Welcome: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('Welcome'),
        after: (state) => {
            DataService.set('name', state.answer);
        },
    },
    Color: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('Color'),
        after: (state) => {
            DataService.set('colour', state.answer);
        },
    },
    Location: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('Location'),
        after: (state) => {
            DataService.set('location', state.answer);
        },
    },
    LikeMovies: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('LikeMovies'),
        after: (state) => {
            DataService.set('likeMovies', state.answer);
        },
    },
};
