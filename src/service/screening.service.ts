import { EntityManager, LockMode } from '@mikro-orm/mysql'
import { Injectable, NotFoundException } from '@nestjs/common';
import { Screening } from '../entity/screening.entity';
import { Movie } from '../entity/movie.entity';



@Injectable()
export class ScreeningService {
    constructor(private readonly em: EntityManager) { }

    async getScreeningsWithAvailability(date: Date) {
        const qb = this.em.createQueryBuilder(Screening, 's');
        return qb
            .select(['s.*', 'm.title', 'm.duration'])
            .leftJoin('s.movie', 'm')
            .where({
                startTime: { $gte: date }, // startTime >= date
                'm.deletedAt': null,
            })
            .andWhere('s.reservedSeats < s.totalSeats')
            .orderBy({ startTime: ' QueryOrder.ASC ' });
    }


    async findAvailableSeats(screeningId: number) {
        const screening = await this.em.findOne(Screening, screeningId, {
            populate: ['movie'],
        });

        if (!screening) {
            throw new NotFoundException('Screening not found');
        }

        return {
            screening,
            availableSeats: screening.totalSeats - screening.reservedSeats,
        };
    }

    async create(
        movieId: number,
        startTime: Date,
        theaterId: number,
        totalSeats: number,
    ) {
        const movie = await this.em.findOne(Movie, movieId);
        if (!movie || movie.deletedAt) {
            throw new NotFoundException('Movie not found or deleted');
        }

        const screening = this.em.create(Screening, {
            movie,
            startTime,
            theaterId,
            totalSeats,
            reservedSeats: 0,
        });

        await this.em.persistAndFlush(screening);
        return screening;
    }

    async lockScreeningForReservation(screeningId: number) {
        return this.em.findOne(Screening, screeningId, {
            lockMode: LockMode.PESSIMISTIC_WRITE,
        });
    }

    // TODO: implement screening update method
    async updateScreening(screeningId: number, updateData: Partial<Screening>) {
        const screen = await this.em.findOne(Screening, screeningId);
        if (!screen) {
            throw new NotFoundException('Screen not found');
        }

        if (updateData.movie) {
            const movie = await this.em.findOne(Movie, updateData.movie.id);
        }
        if (updateData.movie !== undefined) {
            screen.movie = updateData.movie;
        }
        if (updateData.startTime !== undefined) {
            screen.startTime = updateData.startTime
        }
        if (updateData.theaterId !== undefined) {
            screen.theaterId = updateData.theaterId
        }
        if (updateData.totalSeats !== undefined) {
            screen.totalSeats = updateData.totalSeats
        }
        if (updateData.reservedSeats !== undefined) {
            screen.reservedSeats = updateData.reservedSeats
        }
        return screen;
    }

    // TODO: implement screening cancellation
    async cancelScreening(screeningId: number) {
        const screen = await this.em.findOne(Screening, screeningId);
        if (!screen) {
            throw new Error('Screening was not found')
        }
        screen.deletedAt = new Date();
        await this.em.flush();
        return screen;
    }



}