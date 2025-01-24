import { Screening } from '../../../src/domain/entity/screening.entity';
import { Movie } from '../../../src/domain/entity/movie.entity';


export interface ScreeningData {
    id: number;
    startTime: Date;
    theaterId: number;
    totalSeats: number;
    reservedSeats: number
    deletedAt?: Date | null;
}

export interface ScreeningMovieData extends ScreeningData {
    title: string;
    duration: number;
}

export interface ScreeningRepositoryInterface {
    getScreeningsWithAvailability(date: Date): Promise<ScreeningMovieData[]>;
    findScreeningById(screeningId: number): Promise<Screening | null>;
    findMovieById(movieId: number): Promise<Movie | null>;
    createScreening(screeningData: Partial<Screening>): Promise<Screening>;
    lockScreeningForReservation(screeningId: number): Promise<Screening | null>;
    updateScreening(screening: Screening): Promise<Screening>;
    softdeleteScreening(screening: Screening): Promise<Screening>;
}