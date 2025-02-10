import { ConcertSeat } from '../entities';

export interface IConcertSeatRepository {
    seatsInfo(concertId:number, scheduleId: number): Promise<ConcertSeat[]>;
}

export abstract class ConcertSeatRepository implements IConcertSeatRepository {
    abstract seatsInfo(concertId:number, scheduleId: number): Promise<ConcertSeat[]>;
}