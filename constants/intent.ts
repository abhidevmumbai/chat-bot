import { DataService } from '../services';

export const Intents = {
    Name: {
        patterns: [/name/i],
    },
    Colour: {
        patterns: [/color|colour|color/i],
    },
    Weather: {
        patterns: [
            /(.+)?weather|temp|temperature|condition|snow|rain|hot|sunny/i,
        ],
    },
    Movies: {
        patterns: [/(.+)?movies|tv|show|flick.+/i],
    },
    GetMovies: {
        patterns: [
            /(.+)?(?<category>(top|best|most popular|top rated|highest rated)) (?<genre>\w.+?) (?:(movies|flicks|shows)) \w+ (?<year>\d{4})?/i,
        ],
        setData: (data) => {
            console.log('matched groups', data);
            if (
                data.category === 'top' ||
                data.category === 'top rated' ||
                data.category === 'highest rated'
            ) {
                DataService.set('sort_by', 'vote_average.desc');
            } else if (
                data.category === 'popular' ||
                data.category === 'most popular'
            ) {
                DataService.set('sort_by', 'popularity.desc');
            }

            DataService.set('selectedGenreName', data.genre || null);
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
