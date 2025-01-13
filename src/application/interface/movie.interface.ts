import { Movie } from '../../domain/entity/movie.entity';

export abstract class MovieInterface {

    findAllMovies: (includeDeleted: boolean) => Promise<Movie[]>;
    createUser: (movie: Partial<Movie>) => Promise<Movie>;
    softDelete: (id: number) => Promise<boolean>;
    hardDelete: (id: number) => Promise<boolean>
    findbyGenre: (searchGenre: string, includeDeleted: boolean) => Promise<Movie[]>

}