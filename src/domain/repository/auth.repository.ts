import { AuthInterface } from '../../../src/application/interface/auth.interface';
import { EntityManager } from '@mikro-orm/mysql';
import { MovieUser } from '../entity/movie-user.entity';
import { RegisterDto, LoginDto } from '../../interfaces/dto/auth';

export class AuthRepository implements AuthInterface {
    constructor(private readonly em: EntityManager) { }

    async findByEmail(userEmail: string): Promise<MovieUser | null> {
        return await this.em.findOne(MovieUser, { email: userEmail });
    }

    async register(registerBody: RegisterDto): Promise<{ email: string }> {
        const newUser = await this.em.findOne(MovieUser, { email: registerBody.email });
        await this.em.persistAndFlush(newUser);
        return newUser
    }

    async createUser(userData: Partial<MovieUser>): Promise<MovieUser> {
        const newUser = this.em.create(MovieUser, userData);
        await this.em.persistAndFlush(newUser);
        return newUser;
    }

}