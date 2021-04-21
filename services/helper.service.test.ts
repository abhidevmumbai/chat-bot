import { HelperService } from '.';

describe('`Helper Service`', () => {
    it('should offer `getWeatherByLocation`', () => {
        expect(HelperService.getRandomReply).toBeDefined();
    });

    it('should get random reply by key', async () => {
        HelperService.conversations = {
            Color: {
                replies: [
                    'What is your favourite colour?',
                    'Favourite colour?',
                ],
            },
            Location: {
                replies: [
                    'Which city/country are you from?',
                    'Where are you from?',
                    'Where are you located',
                ],
            },
        };
        const reply = HelperService.getRandomReply('Location');
        expect(HelperService.conversations.Location.replies).toContainEqual(
            reply
        );
    });
});
