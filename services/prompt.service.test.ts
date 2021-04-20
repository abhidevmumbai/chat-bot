jest.mock('readline');
import { PromptService } from './prompt.service';

describe('`Prompt Service`', () => {
    beforeEach(function () {
        PromptService.interface = {
            question: jest.fn(),
            close: jest.fn(),
        };
    });

    it('should offer `interface`, `close` and `question`', () => {
        expect(PromptService.interface).toBeDefined();
        expect(PromptService.close).toBeDefined();
        expect(PromptService.question).toBeDefined();
    });

    describe('`close`', () => {
        it('should close the interface', () => {
            PromptService.interface.close = jest.fn();
            PromptService.close();
            expect(PromptService.interface.close).toHaveBeenCalled();
        });
    });

    describe('`write`', () => {
        it('should output a phrase', () => {
            console.log = jest.fn();
            PromptService.write('hello');
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('`question`', () => {
        it('should should call `interface.question`', () => {
            PromptService.question('hello');
            expect(PromptService.interface.question).toHaveBeenCalled();
        });

        it('should append `\\r\\n>`', () => {
            const input = 'hello';
            PromptService.question(input); // will call addListener with a callback
            expect(PromptService.interface.question.mock.calls[0][0]).toBe(
                input + '\r\n> '
            );
        });
    });
});
