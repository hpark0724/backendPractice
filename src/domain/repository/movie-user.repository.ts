import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { MovieUser } from '../entity/movie-user.entity';
import { MovieUserInterface } from '../../../src/application/interface/movie-user.interface';


@Injectable()
export class MovieUserRepository implements MovieUserInterface {
    constructor(private readonly em: EntityManager) { }

    async findByEmail(userEmail: string): Promise<MovieUser | null> {
        return await this.em.findOne(MovieUser, { email: userEmail });
    }

    async createUser(userData: Partial<MovieUser>): Promise<MovieUser> {
        const newUser = this.em.create(MovieUser, userData);
        await this.em.persistAndFlush(newUser);
        return newUser;
    }

    async findAllUsers(): Promise<MovieUser[]> {
        return await this.em.find(MovieUser, {});
    }

    async findById(id: number): Promise<MovieUser | null> {
        return await this.em.findOne(MovieUser, { id });
    }
}