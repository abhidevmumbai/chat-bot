import {
    DataService,
    HelperService,
    HttpService,
    PromptService,
} from '../services';

import { StateTypes } from '../enums';

export const MenuState = {
    Menu: {
        type: StateTypes.Question,
        isIntent: true,
        text: () =>
            `What can I help you with today? You can ask me about ${MenuState.Menu.choices.join(
                ', '
            )}`,
        choices: ['Name', 'Colour', 'Weather', 'Movies'],
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
                DataService.set('weather', weather);
                MenuState.Weather.error = false;
            } catch (e) {
                MenuState.Weather.error = true;
            }
            return;
        },
        text: () => {
            if (!MenuState.Weather.error) {
                const weather = DataService.get('weather');
                const location = DataService.get('location');
                return `The weather for ${location} right now is ${weather} celsius`;
            } else {
                return `Some error occured`;
            }
        },
    },
    Movies: {
        type: StateTypes.Question,
        isIntent: true,
        next: 'Genres',
        cancel: 'WhatMovies',
        text: () => {
            const type = DataService.get('type');
            return `Would you like to set your ${type} preferences like genre or actors?`;
        },
    },
    Exit: {
        type: StateTypes.Statement,
        text: () => HelperService.getRandomReply('Exit'),
        after: () => {
            PromptService.close();
            process.exit();
        },
    },
};
