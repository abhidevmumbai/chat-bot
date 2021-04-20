import { VoiceService } from './voice.service';

const say = require('say');
jest.mock('say');

describe('`Voice Service`', () => {
    const phrase = 'hello';

    it('should offer `isSpeaking`, `speak` and `stop`', () => {
        expect(VoiceService.speak).toBeDefined();
        expect(VoiceService.stop).toBeDefined();
    });

    describe('`speak`', () => {
        it("should set `isSpeaking` to true when there's dialog", () => {
            VoiceService.speak(phrase);
            expect(VoiceService.isSpeaking).toBeTruthy();
        });

        it("should set `isSpeaking` to true when there's dialog", () => {
            VoiceService.speak(phrase);
            expect(VoiceService.activePhrase).toBe(phrase);
        });
    });

    describe('`stop`', () => {
        it('should call `say.stop`', () => {
            VoiceService.stop();
            expect(say.stop).toHaveBeenCalled();
        });
    });

    describe('`onClose`', () => {
        it("should set `isSpeaking` to false when it's done", () => {
            VoiceService.isSpeaking = true;
            VoiceService.activePhrase = phrase;
            VoiceService.onClose(phrase);
            expect(VoiceService.isSpeaking).toBeFalsy();
        });
    });
});
