import { Movie } from './movie.model';

export interface MovieList {
    [index: string]: Movie;
}
