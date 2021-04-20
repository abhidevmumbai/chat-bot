import { DataService } from './data.service';

describe('`Data Service`', () => {
    it('should offer `get` and `set`', () => {
        expect(DataService.get).toBeDefined();
        expect(DataService.set).toBeDefined();
    });

    it('should persist data', () => {
        const animal = 'dog';
        DataService.set('fav-animal', animal);
        expect(DataService.get('fav-animal')).toBe(animal);
    });
});
