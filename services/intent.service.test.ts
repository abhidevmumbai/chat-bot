import { IntentService } from './intent.service';

describe('`Intent Service`', () => {
    it('should offer `getIntent`', () => {
        expect(IntentService.getIntent).toBeDefined();
    });

    it('should offer `foundIntent`', () => {
        expect(IntentService.foundIntent).toBeDefined();
    });

    it('should get intent for a given input string', () => {
        const intent = IntentService.getIntent('Please recommend movies');
        expect(intent).toEqual('Movies');
    });
});
