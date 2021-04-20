jest.mock('readline');
jest.useFakeTimers();

import { sm } from 'jssm';
import { StateService, PromptService, VoiceService } from '.';
import { StateTypes } from '../enums';
import { StateList } from '../models';

describe('`State Service`', () => {
    let State: StateService;

    beforeAll(() => {
        PromptService.interface = {
            question: jest.fn().mockReturnValue('hello'),
            close: jest.fn(),
        };

        VoiceService.speak = jest.fn();
        VoiceService.stop = jest.fn();
    });

    beforeEach(() => {
        const FSM = sm`Welcome 'next' <-> Color 'next' <-> Menu;`;
        const states: StateList = {
            Welcome: {
                type: StateTypes.Question,
                before: jest.fn(),
                text: jest.fn().mockReturnValue('hello'),
                after: jest.fn(),
            },
            Color: {
                type: StateTypes.Statement,
                before: jest.fn(),
                text: jest.fn().mockReturnValue('hello'),
                after: jest.fn(),
            },
        };
        State = new StateService(FSM, states);
    });

    it('should offer `executeState`, `transitionIn` and `transitionOut`', () => {
        expect(State.executeState).toBeDefined();
        expect(State.transitionIn).toBeDefined();
        expect(State.transitionOut).toBeDefined();
    });

    describe('`transitionIn`', () => {
        it('should run `before` if there is one', async () => {
            await State.transitionIn();
            expect(State.state.before).toHaveBeenCalled();
        });
    });

    describe('`transitionOut`', () => {
        beforeEach(() => {
            State.executeState = jest.fn();
            State.machine.transition = jest.fn();
            State.machine.action = jest.fn();
        });

        it('should run `after` if there is one', async () => {
            await State.transitionOut();
            expect(State.state.after).toHaveBeenCalled();
        });

        it('should transition to `next` if it exists', async () => {
            State.state.next = 'next';

            await State.transitionOut();

            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(
                State.state.next
            );
        });

        it('should transition to a choice it exists in `choices`', async () => {
            State.state.answer = 'menu1';
            State.state.choices = ['menu1', 'menu2'];

            await State.transitionOut();

            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(
                State.state.answer
            );
        });

        it('should transition to the default `action` if there is no choice or next', async () => {
            await State.transitionOut();
            expect(State.machine.action).toHaveBeenCalled();
        });
    });

    describe('`executeState`', () => {
        let answer = 'executeState answer';

        beforeAll(() => {
            PromptService.question = jest.fn().mockImplementation(() => {
                const promise = new Promise((resolve) => {
                    resolve(answer);
                });

                return promise;
            });
        });

        beforeEach(() => {
            State.machine.transition('Welcome');
            State.transitionIn = jest.fn();
            State.transitionOut = jest.fn();
        });

        it('should should call `transitionIn` and `transitionOut`', async () => {
            await State.executeState();
            expect(State.transitionIn).toHaveBeenCalled();
            expect(State.transitionOut).toHaveBeenCalled();
        });

        it('should should call `Voice.speak`', async () => {
            await State.executeState();
            expect(VoiceService.speak).toHaveBeenCalled();
        });

        describe('for `StateTypes.Question`', () => {
            it('should call `Prompt.question`', async () => {
                await State.executeState();
                expect(PromptService.question).toHaveBeenCalled();
            });

            it('should store the answer on the state', async () => {
                await State.executeState();
                expect(State.state.answer).toBe(answer);
            });
        });

        describe('for `StateTypes.Statement`', () => {
            it('should wait until the bot is finished speaking before transitioning', (done) => {
                State.transitionOut = jest.fn().mockImplementation(() => {
                    expect(VoiceService.isSpeaking).toBeFalsy();
                    done();
                });

                VoiceService.isSpeaking = true;
                jest.runOnlyPendingTimers();
                jest.advanceTimersByTime(500);
                VoiceService.isSpeaking = false;
                jest.advanceTimersByTime(500);
                expect(State.transitionOut).toHaveBeenCalled();
            });
        });
    });
});
