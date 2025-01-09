import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { Reservation } from '../entity/reservation.entity';

@Injectable()
export class ReservationService {
    constructor(
        private readonly em: EntityManager,
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
            const existingReservation = await em.findOne(Reservation, {
                screening: screeningId,
                seatNumber, // 키와 값이 동일해서 seatNumber : seatNumber -> seatNumber로 축약 가능
            });

            if (existingReservation) {
                throw new ConflictException('Seat already reserved');
            }

            const reservation = em.create(Reservation, {
                user: userId,
                screening,
                seatNumber,
            });

            screening.reservedSeats++;

            await em.persistAndFlush([reservation, screening]);
            await em.commit();

            return reservation;

        } catch (error) {
            await em.rollback();
            throw error;
        }
    }

    async findUserReservations(userId: number) {
        return this.em.find(
            Reservation,
            { user: userId },
            {
                populate: ['screening', 'screening.movie'],
                orderBy: { screening: { startTime: 'DESC ' } }
            },
        );
    }

    async findUserReservationHistory(
        userId: number,
        type: 'upcoming' | 'past',
        page: number = 1,
        limit: number = 10,
    ) {
        const qb = this.em.createQueryBuilder(Reservation, 'r');
        const now = new Date();

        qb.select(['*'])
            .leftJoin('r.screening', 's')
            .leftJoin('s.movie', 'm')
            .where({ user: userId })
            .orderBy({ 'r.reservedAt': 'DESC' });

        if (type === 'upcoming') {
            qb.andWhere({ 's.startTime': { $gt: now } });
        } else {
            qb.andWhere({ 's.startTime': { $lte: now } });
        }

        const [reservations, total] = await qb
            .limit(limit)
            .offset((page - 1) * limit)
            .getResultAndCount();

        return {
            reservations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async getReservationDetail(reservationId: number, userId: number): Promise<{
        id: number;
        status: 'upcoming' | 'past';
        canCancel: boolean;
        seatNumber: string;
        screening: any;
        user: any;
    }> {
        const reservation = await this.em.findOne(Reservation, reservationId, {
            populate: ['screening', 'screening.movie'],
        });

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
        const qb = this.em.createQueryBuilder(Reservation, 'r');
        const now = new Date();

        const stats = await qb
            .select([
                'COUNT(*) as total',
                `SUM(CASE WHEN s.startTime > '${now.toISOString()}' THEN 1 ELSE 0 END) as upcoming`,
                `SUM(CASE WHEN s.startTime > '${now.toISOString()}' THEN 1 ELSE 0 END) as past`,
            ])
            .leftJoin('r.screening', 's')
            .where({ user: userId })
            .execute('all');

        return stats[0];
    }

    // TODO: implement reservation cancellation
    async cancelReservation(userId: number) {
        const userReservation = await this.em.findOne(
            Reservation,
            { user: userId },
        );

        userReservation.deletedAt = new Date();
        await this.em.flush();

        return userReservation;

    }

    // TODO: implement reservation modification
    async modifyReservation(userId: number, modifyData: Partial<Reservation>) {
        const userReservation = await this.em.findOne(Reservation, { user: userId });
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