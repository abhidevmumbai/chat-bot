import { Intents } from '../constants';

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
        console.log(input, currentIntent);
        return currentIntent;
    }

    foundIntent(intent, input) {
        // let found = Intents[intent].some((regex) => {
        //     return regex.test(input);
        // });
        // return found;
        let found = Intents[intent].patterns.some((regex) => {
            let exec = regex.exec(input);
            if (exec?.groups && Intents[intent].setData) {
                Intents[intent].setData(exec.groups);
                return true;
            } else {
                return regex.test(input);
            }
        });
        return found;
    }
}

export const IntentService = new Intent();
