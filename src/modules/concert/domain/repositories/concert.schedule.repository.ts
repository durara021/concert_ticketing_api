import { ConcertSchedule } from '../entities';

export interface IConcertScheduleRepository {
    schedulesInfo(concertId: number): Promise<ConcertSchedule[]>;
}

export abstract class ConcertScheduleRepository implements IConcertScheduleRepository {
    abstract schedulesInfo(concertId: number): Promise<ConcertSchedule[]>;
}