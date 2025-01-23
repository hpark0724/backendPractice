import { ScreeningRepositoryInterface, ScreeningMovieData, ScreeningData } from 'src/application/interface/screening.interface';
import { EntityManager, LockMode, Reference } from '@mikro-orm/mysql';
import { Screening } from 'src/domain/entity/screening.entity';
import { Movie } from 'src/domain/entity/movie.entity';

export abstract class ScreeningRepository {
    constructor(private readonly em: EntityManager) { }

    async getScreeningsWithAvailability(date: Date): Promise<ScreeningMovieData[]> {
        const qb = this.em.createQueryBuilder(Screening, 's');
        const screenings = await qb
            .select([
                's.id',
                's.startTime',
                's.theaterId',
                's.totalSeats',
                's.reservedSeats',
                's.deletedAt',
                'm.title as title',
                'm.duration as duration',
            ])
            .leftJoin('s.movie', 'm')
            .where({
                startTime: { $gte: date },
                'm.deletedAt': null,
            })
            .andWhere('s.reservedSeats < s.totalSeats')
            .orderBy({ startTime: 'ASC' })
            .getResultList()

        // await this.em.populate(screenings, ['movie']);

        const results: ScreeningMovieData[] = screenings.map((result) => {
            const movie = result.movie.unwrap();
            return {
                id: result.id,
                startTime: result.startTime,
                theaterId: result.theaterId,
                totalSeats: result.totalSeats,
                reservedSeats: result.reservedSeats,
                deletedAt: result.deletedAt,
                title: movie.title,
                duration: movie.duration,
            };
        });

        return results;
    }


    async findScreeningById(screeningId: number): Promise<Screening | null> {
        return this.em.findOne(Screening, { id: screeningId });
    }

    async findMovieById(movieId: number): Promise<Movie> {
        return this.em.findOne(Movie, { id: movieId });
    }

    async createScreening(screeningData: Partial<Screening>): Promise<Screening> {
        const screening = this.em.create(Screening, {
            ...screeningData,
            movie: Reference.create(screeningData.movie),
        });
        await this.em.persistAndFlush(screening);
        return screening;
    }

    async lockScreeningForReservation(screeningId: number): Promise<Screening | null> {
        return this.em.findOne(Screening, screeningId, {
            lockMode: LockMode.PESSIMISTIC_WRITE,
        });
    }

    async updateScreening(screening: Screening): Promise<Screening> {
        await this.em.persistAndFlush(screening);
        return screening;
    }

    async softdeleteScreening(screening: Screening): Promise<Screening> {
        screening.deletedAt = new Date();
        await this.em.flush();
        return screening;
    }

}