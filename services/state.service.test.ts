jest.mock('readline');
jest.useFakeTimers();

import { sm } from 'jssm';
import { PromptService, StateService, VoiceService } from '.';
import { StateTypes } from '../enums';
import { StateList } from '../models';
import { IntentService } from './intent.service';

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

        it('should handle intent if there is one', async () => {
            const spyOn = jest.spyOn(State, 'handleIntent');
            State.state.answer = 'Name';
            State.state.isIntent = true;
            await State.transitionOut();
            expect(spyOn).toHaveBeenCalled();
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

        it('should transition to `retry` if there is an error', async () => {
            State.state.error = true;
            State.state.retry = 'retry';

            await State.transitionOut();

            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(
                State.state.retry
            );
        });

        it('should transition to the default `action` if there is no choice or next', async () => {
            await State.transitionOut();
            expect(State.machine.action).toHaveBeenCalled();
        });
    });

    describe('`handleIntent`', () => {
        beforeEach(() => {
            State.machine.transition = jest.fn();
        });

        it('should run `next` if the intent is `Confirm`', async () => {
            IntentService.getIntent = jest.fn().mockReturnValue('Confirm');
            await State.handleIntent();
            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(
                State.state.next
            );
        });

        it('should run `retry` if the intent is `Cancel`', async () => {
            IntentService.getIntent = jest.fn().mockReturnValue('Cancel');
            await State.handleIntent();
            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(
                State.state.retry
            );
        });

        it('should transition to `Exit` on `Exit`', async () => {
            IntentService.getIntent = jest.fn().mockReturnValue('Exit');
            await State.handleIntent();
            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith('Exit');
        });

        it('should transition to `None` on `None`', async () => {
            IntentService.getIntent = jest.fn().mockReturnValue('None');
            await State.handleIntent();
            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith('Menu');
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
