import { CreateMovieUserDto, CreateMovieUserResultDto } from '../../interfaces/dto/movie-user';
import { MovieUser } from '../../domain/entity/movie-user.entity';

export abstract class MovieUserInterface {
    findByEmail: (email: string) => Promise<MovieUser | null>;
    createUser: (createUserDto: CreateMovieUserDto) => Promise<MovieUser>;
    findAllUsers: () => Promise<MovieUser[]>;
    findById: (id: number) => Promise<MovieUser | null>;
}