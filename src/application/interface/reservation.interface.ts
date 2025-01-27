export interface ReservationInterface {
    findUserReservationHistory(
        userId: number,
        type: 'upcoming' | 'past',
        page: number,
        limit: number,
    ): Promise<{ reservations: any[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>;
}