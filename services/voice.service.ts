const say = require('say');

export class Voice {
    isSpeaking: boolean;
    activePhrase: string;

    onClose(phrase) {
        if (this.isSpeaking && this.activePhrase === phrase) {
            this.isSpeaking = false;
        }
    }

    stop() {
        say.stop();
    }

    speak(phrase) {
        this.activePhrase = phrase;
        say.speak(phrase, null, null, () => this.onClose(phrase));
        this.isSpeaking = true;
    }
}

export const VoiceService = new Voice();
