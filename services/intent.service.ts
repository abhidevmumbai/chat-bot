import { Intents } from '../conversations';

class Intent {
    constructor() {}

    getIntent(input) {
        let currentIntent = 'None';
        Object.keys(Intents).some((intent) => {
            if (this.foundIntent(intent, input)) {
                currentIntent = intent;
                return true;
            }
            return false;
        });
        return currentIntent;
    }

    foundIntent(intent, input) {
        let found = Intents[intent].some((phrase) => {
            return input.includes(phrase);
        });
        return found;
    }
}

export const IntentService = new Intent();
