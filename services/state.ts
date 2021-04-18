import { Voice, Prompt } from '.';
import { StateTypes } from '../enums';
import { StateList, State } from '../models';

export class StateService {

    machine: any;
    states: StateList;
    stateName: string;
    state: State

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
        Voice.speak(phrase)


        if (this.state.type === StateTypes.Statement) {
            Prompt.write(phrase);
            let interval = setInterval(() => {
                if (!Voice.isSpeaking) {
                    clearInterval(interval);
                    this.transitionOut();
                }
            }, 1000);

        } else if (this.state.type === StateTypes.Question) {
            answer = await Prompt.question(phrase) as string
            Voice.stop();
            this.state.answer = answer;
            this.transitionOut();
        }

    }

    async transitionIn() {
        if (this.state.before) {
            await this.state.before();
        }
    }

    async transitionOut() {

        if (this.state.after) {
            await this.state.after(this.state);
        }

        if (this.state.next) {
            this.machine.transition(this.state.next);
        } else if (this.state.choices && this.isInChoices(this.state.choices, this.state.answer)) {
            this.machine.transition(this.state.answer);
        } else {
            this.machine.action('next');
        }

        this.executeState()

    }

    isInChoices(choices, answer) {
        const filtered = choices.filter(item => answer.toLowerCase() === item.toLowerCase());
        return filtered.length > 0;
    }
}