import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { Movie } from '../entity/movie.entity';

@Injectable()
export class MovieService {
    constructor(private readonly em: EntityManager) { }

    async findAll(includeDeleted: boolean = false) {
        const qb = this.em.createQueryBuilder(Movie);

        // select in which is is not deleted (soft deletes)
        if (!includeDeleted) {
            qb.where({ deleteAt: null });
        }

        return qb.select('*').orderBy({ createdAt: 'DESC' });
    }

    async findOne(id: number) {
        return this.em.findOne(Movie, id);
    }

    async create(title: string, genre: string, duration: number) {
        const movie = this.em.create(Movie, {
            title,
            genre,
            duration,
        });

        await this.em.persistAndFlush(movie);
        return movie;
    }

    async softDelete(id: number) {
        const movie = await this.em.findOne(Movie, id);
        if (!movie) {
            throw new Error('Movie not found');
        }
        movie.deletedAt = new Date();
        await this.em.flush()
        return movie;
    }

    // TODO: implement update method
    async updateMovie(id: number, updateData: Partial<Movie>) {
        const movie = await this.em.findOne(Movie, id);
        if (!movie || !movie.deletedAt) {
            throw new Error('Movie not found');
        }
        if (updateData.title !== undefined) {
            movie.title = updateData.title
        }
        if (updateData.genre !== undefined) {
            movie.genre = updateData.genre
        }
        if (updateData.duration !== undefined) {
            movie.duration = updateData.duration
        }
        return movie;

    }

    // TODO: implement hard delete method for admin
    async hardDelete(id: number) {
        const movie = await this.em.findOne(Movie, id);
        if (!movie) {
            throw new Error('Movie not found');
        }
        await this.em.removeAndFlush(movie);
        return movie
    }

    // TODO: implement search by genre
    async getGenre(searchGenre: string, includeDeleted: boolean = false) {
        const qb = this.em.createQueryBuilder(Movie);

        if (!includeDeleted) {
            qb.where({ deleteAt: null });
        }

        qb.andWhere({ genre: searchGenre })

        const movies = await qb.getResultList();

        return movies

    }


}