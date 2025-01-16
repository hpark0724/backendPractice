import { EntityManager } from '@mikro-orm/mysql';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { Movie } from '../entity/movie.entity';
import { MovieInterface } from '../../../src/application/interface/movie.interface';


export class MovieRepository implements MovieInterface {
    constructor(private readonly em: EntityManager) { }

    async findAllMovies(includeDeleted: boolean = false): Promise<Movie[]> {
        const qb = this.em.createQueryBuilder(Movie);

        // select in which is is not deleted (soft deletes)
        if (!includeDeleted) {
            qb.where({ deleteAt: null });
        }

        qb.select('*').orderBy({ createdAt: 'DESC' })
        return qb.getResultList();
    }

    async findOneById(id: number) {
        return this.em.findOne(Movie, id); // id 기준으로 영화 조회
    }

    async createUser(movie: Partial<Movie>): Promise<Movie> {
        const newMovie = this.em.create(Movie, movie); // 새로운 영화 데이터베이스 생성

        await this.em.persistAndFlush(newMovie); // 입력값을 받아 엔티티 생성, 저장
        return newMovie;
    }

    async softDelete(id: number): Promise<boolean> {
        const movie = await this.em.findOne(Movie, id);
        if (!movie) {
            return false;
        }
        if (movie.deletedAt) {
            return false;
        }
        movie.deletedAt = new Date(); // deletedAt 데이터 필드에 삭제 날짜 설정, 저장
        await this.em.flush()
        return true;
    }

    async hardDelete(id: number): Promise<boolean> {
        const movie = await this.em.findOne(Movie, id);
        if (!movie) {
            return false
        }
        await this.em.removeAndFlush(movie); // 데이터베이스로부터 삭제 
        return true
    }

    async findbyGenre(searchGenre: string, includeDeleted: boolean = false): Promise<Movie[]> {
        const qb = this.em.createQueryBuilder(Movie, 'm');

        if (!includeDeleted) {
            qb.where({ deleteAt: null });
        }

        // qb.andWhere({ genre: searchGenre })
        qb.andWhere(`MATCH(genre) AGAINST (? IN BOOLEAN MODE)`, [searchGenre]);

        return qb.getResultList();

    }


}