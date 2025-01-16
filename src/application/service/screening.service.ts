import { EntityManager, LockMode, Reference } from '@mikro-orm/mysql'
import { Injectable, NotFoundException } from '@nestjs/common';
import { Screening } from '../../../src/domain/entity/screening.entity';
import { Movie } from '../../domain/entity/movie.entity';
import { ScreeningRepository } from '../../domain/repository/screening.repository';


@Injectable()
export class ScreeningService {
    //constructor(private readonly em: EntityManager) { }
    constructor(private readonly screenRepository: ScreeningRepository) { }

    async getScreeningsWithAvailability(date: Date) {
        return this.screenRepository.getScreeningsWithAvailability(date);
    }


    async findAvailableSeats(screeningId: number) {
        const screening = await this.screenRepository.findScreeningById(screeningId);

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
        const movie = await this.screenRepository.findMovieById(movieId);
        if (!movie || movie.deletedAt) {
            throw new NotFoundException('Movie not found or deleted');
        }

        const screening = this.screenRepository.createScreening({
            // movie,
            movie: Reference.create(movie),
            startTime,
            theaterId,
            totalSeats,
            reservedSeats: 0,
        });

    }

    async lockScreeningForReservation(screeningId: number) {
        return this.screenRepository.lockScreeningForReservation(screeningId);
    }

    // TODO: implement screening update method
    async updateScreening(screeningId: number, updateData: Partial<Screening>) {
        const screening = await this.screenRepository.findScreeningById(screeningId);
        if (!screening) {
            throw new NotFoundException('Screen not found');
        }

        if (updateData.movie !== undefined) {
            screening.movie = updateData.movie;
        }
        if (updateData.startTime !== undefined) {
            screening.startTime = updateData.startTime
        }
        if (updateData.theaterId !== undefined) {
            screening.theaterId = updateData.theaterId
        }
        if (updateData.totalSeats !== undefined) {
            screening.totalSeats = updateData.totalSeats
        }
        if (updateData.reservedSeats !== undefined) {
            screening.reservedSeats = updateData.reservedSeats
        }
        return this.screenRepository.updateScreening(screening);
    }

    // TODO: implement screening cancellation
    async cancelScreening(screeningId: number) {
        const screening = await this.screenRepository.findScreeningById(screeningId);
        if (!screening) {
            throw new Error('Screening was not found')
        }
        return this.screenRepository.softdeleteScreening(screening);
    }

}