import { PromptService, VoiceService } from '.';
import { State, StateList } from '../models';

import { StateTypes } from '../enums';

const choicesMap = {
    name: { text: 'Name', value: 'name' },
    colour: { text: 'Colour', value: 'colour' },
    weather: { text: 'Weather', value: 'weather' },
    genre: { text: 'Movie', value: 'movie' },
    goodbye: { text: 'Goodbye', value: 'goodbye' },
};
export class StateService {
    machine: any;
    states: StateList;
    stateName: string;
    state: State;

    constructor(machine, config) {
        this.machine = machine;
        this.states = config;
        this.executeState();
    }

    async executeState() {
        this.stateName = this.machine.state();
        this.state = this.states[this.stateName];
        let answer;

        await this.transitionIn();

        const phrase = this.state.text();
        VoiceService.speak(phrase);

        if (this.state.type === StateTypes.Statement) {
            PromptService.write(phrase);
            let interval = setInterval(() => {
                if (!VoiceService.isSpeaking) {
                    clearInterval(interval);
                    this.transitionOut();
                }
            }, 1000);
        } else if (this.state.type === StateTypes.Question) {
            answer = (await PromptService.question(phrase)) as string;
            VoiceService.stop();
            this.state.answer = answer;
            this.transitionOut();
        }
    }

    async transitionIn() {
        console.log('transitionIn', this.state);
        if (this.state.before) {
            await this.state.before();
        }
    }

    async transitionOut() {
        console.log('transitionOut', this.state);
        if (this.state.after) {
            await this.state.after(this.state);
        }
        if (!this.state.answer && this.state.error) {
            this.machine.transition(this.state.retry);
        }
        if (this.state.next) {
            this.machine.transition(this.state.next);
        } else if (this.state.choices) {
            const matchingChoice = this.getMatchingChoice(
                this.state.choices,
                this.state.answer
            );
            if (matchingChoice.length > 0) {
                this.machine.transition(matchingChoice[0]);
            }
        } else {
            this.machine.action('next');
        }

        this.executeState();
    }

    getMatchingChoice(choices, answer) {
        const filtered = choices.filter(
            (item) => answer.toLowerCase() === item.toLowerCase()
        );
        return filtered;
    }
}
