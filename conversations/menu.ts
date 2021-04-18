import { StateTypes } from "../enums";
import { Data, Http, Prompt } from "../services";

export const MenuState = {
    'Menu': {
        type: StateTypes.Question,
        text: () => "What can I help you with today?",
        choices: ["Name", "Colour", "Weather", "Goodbye"]
    },
    'Name': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const name = Data.get('name');
            return `Your name is ${name}, of course.`
        }
    },
    'Colour': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const colour = Data.get('colour');
            return `Your favourite colour is ${colour}, of course.`
        }
    },
    'Weather': {
        type: StateTypes.Statement,
        next: "Menu",
        before: async () => {
            const location = Data.get('location');
            const weather = await Http.getWeatherByLocation(location);
            Data.set('temperature', weather);
            return;
        },
        text: () => {
            const temperature = Data.get('temperature');
            const location = Data.get('location');
            return `The weather for ${location} right now is ${temperature} celsius`
        }
    },
    'Goodbye': {
        type: StateTypes.Statement,
        text: () => "Ok. See you.",
        after: () => {
            Prompt.close();
            process.exit();
        }
    }
};