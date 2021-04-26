import { DataService } from '../services';

export const Intents = {
    Name: {
        patterns: [/name/i],
    },
    Colour: {
        patterns: [/color|colour|color/i],
    },
    Weather: {
        patterns: [/weather|temp|temperature|condition|snow|rain|hot|sunny/i],
    },
    Movies: {
        patterns: [/recommend (?<type>(movie|tv|show|flick)s?)/i],
        setData: (data) => {
            if (data.type === 'tv' || data.type === 'shows') {
                DataService.set('type', 'tv');
            } else {
                DataService.set('type', 'movie');
            }
        },
    },
    GetMovies: {
        patterns: [
            /(.+)?(?<category>(top|best|most popular|top rated|highest rated)) (?<genre>\w.+?) (?<type>(movie|flick|show)s?) \w+ (?<year>\d{4})?/i,
        ],
        setData: (data) => {
            if (
                data.category === 'top' ||
                data.category === 'top rated' ||
                data.category === 'highest rated'
            ) {
                DataService.set('sortBy', 'vote_average.desc');
            } else if (
                data.category === 'popular' ||
                data.category === 'most popular'
            ) {
                DataService.set('sortBy', 'popularity.desc');
            }

            DataService.set('selectedGenreName', data.genre || null);

            if (
                data.type === 'movie' ||
                data.type === 'movies' ||
                data.type === 'flick' ||
                data.type === 'flicks'
            ) {
                DataService.set('type', 'movie');
            } else {
                DataService.set('type', 'tv');
            }

            DataService.set('selectedYear', data.year || null);
        },
    },
    Cast: {
        patterns: [/.+actor|actress|cast|lead|character.+/i],
    },
    Confirm: {
        patterns: [/yes|sure|ok|yup|fine/i],
    },
    Cancel: {
        patterns: [/no|nope|cancel|continue/i],
    },
    Exit: {
        patterns: [/bye|exit|goodbye|cya/i],
    },
};
