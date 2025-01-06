export class ReservationDetailDto {
    id: number;
    status: 'upcoming' | 'past';
    canCancel: boolean;
    seatNumber: string;
    screening: any;
    user: any;
}