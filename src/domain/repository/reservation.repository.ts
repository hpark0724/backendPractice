import { QueryBuilder, EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { Reservation } from '../entity/reservation.entity';
import { ReservationInterface } from 'src/application/interface/reservation.interface';
import { Screening } from '../../../src/domain/entity/screening.entity';

@Injectable()
export class ReservationRepository implements ReservationInterface {
    constructor(private readonly em: EntityManager) { }

    async findUserReservationHistory(
        userId: number,
        type: 'upcoming' | 'past',
        page: number = 1,
        limit: number = 10,
    ): Promise<{ reservations: any[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
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

    async findReservation(reservationId: number, seatNumber: string): Promise<Reservation> {
        return this.em.findOne(Reservation, { screening: reservationId, seatNumber: seatNumber });
    }

    async createReservation(userId: number, screeningId: number, seatNumber: string): Promise<Reservation> {
        const reservation = this.em.create(Reservation, {
            user: userId,
            screening: screeningId,
            seatNumber,
        });

        await this.em.persistAndFlush(reservation);
        await this.em.commit();
        return reservation;
    }


    async findUserReservations(userId: number): Promise<Reservation[]> {
        return this.em.find(
            Reservation,
            { user: userId },
            // {
            //     populate: ['screening', 'screening.movie'],
            //     orderBy: { screening: { startTime: 'DESC ' } }
            // },
        );
    }

    async findReservationById(reservationId: number): Promise<Reservation> {
        return this.em.findOne(Reservation, { id: reservationId });
    }

    async getReservationStats(userId: number): Promise<{ total: number; upcoming: number; past: number }> {
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

        const result = stats[0] as unknown as { total: number; upcoming: number; past: number };
        return result;
    }

    async softDelete(userId: number): Promise<Reservation> {
        const userReservation = await this.em.findOne(Reservation, { id: userId });

        userReservation.deletedAt = new Date();
        await this.em.flush();

        return userReservation;
    }

}






