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
        retry: 'Location',
        error: false,
        before: async () => {
            const location = DataService.get('location');
            try {
                const weather = await HttpService.getWeatherByLocation(
                    location
                );
                DataService.set('temperature', weather);
                MenuState.Weather.error = false;
            } catch (e) {
                MenuState.Weather.error = true;
            }
            return;
        },
        text: () => {
            if (!MenuState.Weather.error) {
                const temperature = DataService.get('temperature');
                const location = DataService.get('location');
                return `The weather for ${location} right now is ${temperature} celsius`;
            } else {
                return `Some error occured`;
            }
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
