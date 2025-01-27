import { IsString, Matches } from 'class-validator';

export class ReservationDetailDto {
    id!: number;
    status!: 'upcoming' | 'past';
    canCancel!: boolean;
    seatNumber!: string;
    screening!: any;
    user!: any;
}

export class ReservationHistoryTypeDto {

    @IsString()
    @Matches(/^(upcoming|past)$/, { message: 'only upcoming or past type is possible' })
    type?: 'upcoming' | 'past' = 'upcoming';
}

