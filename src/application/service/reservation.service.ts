import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { Reservation } from '../../../src/domain/entity/reservation.entity';
import { ReservationRepository } from '../../domain/repository/reservation.repository';

@Injectable()
export class ReservationService {
    constructor(
        private readonly em: EntityManager,
        private readonly reservationRepository: ReservationRepository,

        private readonly screeningService: ScreeningService,
    ) { }

    async createReservation(userId: number, screeningId: number, seatNumber: string) {
        const em = this.em.fork();
        // 트랜잭션 시작 (읽기,쓰기,수정 등 하나의 묶음)
        await em.begin();

        try {
            const screening =
                await this.screeningService.lockScreeningForReservation(screeningId);
            if (!screening) {
                throw new NotFoundException('Screening not fouind');
            }
            if (screening.reservedSeats >= screening.totalSeats) {
                throw new ConflictException('No seats available');
            }
            const existingReservation = await this.reservationRepository.findReservation(screeningId, seatNumber);

            if (existingReservation) {
                throw new ConflictException('Seat already reserved');
            }

            screening.reservedSeats++;
            const reservation = await this.reservationRepository.createReservation(userId, screeningId, seatNumber);

            // await em.persistAndFlush([reservation, screening]);
            // await em.commit();

            return reservation;

        } catch (error) {
            await em.rollback();
            throw error;
        }
    }

    async findUserReservations(userId: number) {
        return this.reservationRepository.findUserReservations(userId);
    }

    async findUserReservationHistory(
        userId: number,
        type: 'upcoming' | 'past',
        page: number = 1,
        limit: number = 10,
    ): Promise<{
        reservations: any[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
    }> {
        // Repository 메서드를 호출하여 예약 기록 조회
        return this.reservationRepository.findUserReservationHistory(userId, type, page, limit);
    }


    async getReservationDetail(reservationId: number, userId: number): Promise<{
        id: number;
        status: 'upcoming' | 'past';
        canCancel: boolean;
        seatNumber: string;
        screening: any;
        user: any;
    }> {
        // const reservation = await this.em.findOne(Reservation, reservationId, {
        //     populate: ['screening', 'screening.movie'],
        // });
        const reservation = await this.reservationRepository.findReservationById(reservationId);

        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        if (reservation.user.id !== userId) {
            throw new ConflictException('Not authorized to view this reservation');
        }

        const now = new Date();
        const screening = reservation.screening.unwrap();

        return {
            ...reservation,
            status: screening.startTime > now ? 'upcoming' : 'past',
            canCancel: screening.startTime > now,
        };
    }

    async getReservationStats(userId: number) {
        return await this.reservationRepository.getReservationStats(userId);
    }

    // TODO: implement reservation cancellation
    async cancelReservation(userId: number) {
        return await this.reservationRepository.softDelete(userId);

    }

    // TODO: implement reservation modification
    async modifyReservation(userId: number, modifyData: Partial<Reservation>) {
        const userReservation = await this.reservationRepository.findReservationById(userId);
        if (!userReservation || !userReservation.deletedAt) {
            throw new Error('Reservation not found');
        }
        if (userReservation.user !== undefined) {
            userReservation.user = modifyData.user
        }
        if (userReservation.screening !== undefined) {
            userReservation.screening = modifyData.screening
        }
        if (userReservation.seatNumber !== undefined) {
            userReservation.seatNumber = modifyData.seatNumber
        }
        if (userReservation.reservedAt !== undefined) {
            userReservation.reservedAt = modifyData.reservedAt
        }
    }
}