import { MovieUser } from '../../domain/entity/movie-user.entity';
import { RegisterDto } from '../../interfaces/dto/auth';


export abstract class AuthInterface {
    findByEmail: (userEmail: string) => Promise<MovieUser | null>;
    register: (registerBody: RegisterDto) => Promise<{ email: string }>;
    createUser: (userData: Partial<MovieUser>) => Promise<MovieUser>;
}