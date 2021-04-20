import { DataService, HttpService, PromptService } from '../services';

import { StateTypes } from '../enums';

export const MenuState = {
    Menu: {
        type: StateTypes.Question,
        text: () => 'What can I help you with today?',
        choices: ['Name', 'Colour', 'Weather', 'Movie', 'Goodbye'],
    },
    Name: {
        type: StateTypes.Statement,
        next: 'Menu',
        text: () => {
            const name = DataService.get('name');
            return `Your name is ${name}, of course.`;
        },
    },
    Colour: {
        type: StateTypes.Statement,
        next: 'Menu',
        text: () => {
            const colour = DataService.get('colour');
            return `Your favourite colour is ${colour}, of course.`;
        },
    },
    Weather: {
        type: StateTypes.Statement,
        next: 'Menu',
        before: async () => {
            const location = DataService.get('location');
            const weather = await HttpService.getWeatherByLocation(location);
            DataService.set('temperature', weather);
            return;
        },
        text: () => {
            const temperature = DataService.get('temperature');
            const location = DataService.get('location');
            return `The weather for ${location} right now is ${temperature} celsius`;
        },
    },
    Movie: {
        type: StateTypes.Statement,
        text: () => {
            return `Cool, let me ask you a few questions?`;
        },
    },
    Goodbye: {
        type: StateTypes.Statement,
        text: () => 'Ok. See you.',
        after: () => {
            PromptService.close();
            process.exit();
        },
    },
};
