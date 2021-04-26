import { DataService, HelperService } from '.';

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

    it('should set selectedGenreName in Data service', () => {
        const genres = [
            {
                id: 28,
                name: 'Action',
            },
            {
                id: 12,
                name: 'Adventure',
            },
            {
                id: 16,
                name: 'Animation',
            },
            {
                id: 35,
                name: 'Comedy',
            },
        ];
        const spy = jest.spyOn(DataService, 'get').mockReturnValue('action');
        HelperService.getSelectedGenre(genres);
        expect(spy).toHaveBeenCalledWith('selectedGenreName');
    });
});
