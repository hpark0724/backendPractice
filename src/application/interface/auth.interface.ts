import { MovieUser } from "src/domain/entity/movie-user.entity";


export abstract class AuthInterface {
    findByEmail: (userEmail: string) => Promise<MovieUser | null>;
    createUser: (userData: Partial<MovieUser>) => Promise<MovieUser>;
}