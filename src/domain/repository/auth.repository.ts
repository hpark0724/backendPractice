import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { MovieUser } from '../entity/movie-user.entity';
import { AuthInterface } from 'src/application/interface/auth.interface';


export class AuthRepository implements AuthInterface {
    constructor(private readonly em: EntityManager) { }

    async findByEmail(userEmail: string): Promise<MovieUser | null> {
        return await this.em.findOne(MovieUser, { email: userEmail });
    }

    async createUser(userData: Partial<MovieUser>): Promise<MovieUser> {
        const newUser = this.em.create(MovieUser, userData);
        await this.em.persistAndFlush(newUser);
        return newUser;
    }
}

