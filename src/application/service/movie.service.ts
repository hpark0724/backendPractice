import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { Movie } from '../../../src/domain/entity/movie.entity';
import { MovieRepository } from '../../domain/repository/movie.repository';

@Injectable()
export class MovieService {
    // constructor(private readonly em: EntityManager) { }
    // constructor(@InjectRepository(Movie)
    // private readonly movieRepository: Repository<Movie>,
    // ) { }
    constructor(private readonly movieRepository: MovieRepository) { }

    async findAll(includeDeleted: boolean = false) {
        // const qb = this.em.createQueryBuilder(Movie);

        // // select in which is is not deleted (soft deletes)
        // if (!includeDeleted) {
        //     qb.where({ deleteAt: null });
        // }

        // return qb.select('*').orderBy({ createdAt: 'DESC' });
        return this.movieRepository.findAllMovies(includeDeleted);
    }

    async findOne(id: number) {
        const movie = await this.movieRepository.findOneById(id);
        if (!movie) {
            throw new Error('Movie not found');
        }
        return movie;
    }


    async create(title: string, genre: string, duration: number) {
        return this.movieRepository.createUser({ title, genre, duration });
        // await this.em.persistAndFlush(movie);
        // return movie;
    }

    async softDelete(id: number) {
        return this.movieRepository.softDelete(id);
    }

    // TODO: implement update method
    async updateMovie(id: number, updateData: Partial<Movie>) {
        const movie = await this.movieRepository.findOneById(id);
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
        await this.movieRepository.createUser(movie);
        return movie;
    }

    // TODO: implement hard delete method for admin
    async hardDelete(id: number) {
        return this.movieRepository.hardDelete(id);
    }

    // TODO: implement search by genre
    async getGenre(searchGenre: string, includeDeleted: boolean = false) {
        return this.movieRepository.findbyGenre(searchGenre, includeDeleted);

    }
}