import { PromptService, VoiceService } from '.';
import { State, StateList } from '../models';

import { IntentService } from './intent.service';
import { StateTypes } from '../enums';

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
        if (this.state.before) {
            await this.state.before();
        }
    }

    async transitionOut() {
        if (this.state.isIntent) {
            this.handleIntent();
        } else {
            if (this.state.after) {
                await this.state.after(this.state);
            }
            if (!this.state.answer && this.state.error) {
                this.machine.transition(this.state.retry);
            } else if (this.state.next) {
                this.machine.transition(this.state.next);
            } else {
                this.machine.action('next');
            }
        }
        this.executeState();
    }

    handleIntent() {
        const intent = IntentService.getIntent(this.state.answer);
        switch (intent) {
            case 'Confirm':
                this.machine.transition(this.state.next);
                break;
            case 'Cancel':
                this.machine.transition(this.state.retry);
                break;
            case 'Exit':
                this.machine.transition('Exit');
            case 'None':
                this.machine.transition('Menu');
                break;
            default:
                this.machine.transition(intent);
        }
    }
}
