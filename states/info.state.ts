import { StateTypes } from '../enums';
import { Data, Helper } from '../services';

export const InfoState = {
    Welcome: {
        type: StateTypes.Question,
        text: () => Helper.getRandomReply('Welcome'),
        after: (state) => {
            Data.set('name', state.answer);
        },
    },
    Color: {
        type: StateTypes.Question,
        text: () => Helper.getRandomReply('Color'),
        after: (state) => {
            Data.set('colour', state.answer);
        },
    },
    Location: {
        type: StateTypes.Question,
        text: () => Helper.getRandomReply('Location'),
        after: (state) => {
            Data.set('location', state.answer);
        },
    },
};
