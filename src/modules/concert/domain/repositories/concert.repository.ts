import { Concert } from '../entities';

export interface IConcertRepository {
    concertsInfo(concertId?: number): Promise<Concert[]>;
}

export abstract class ConcertRepository implements IConcertRepository {
    abstract concertsInfo(concertId?: number): Promise<Concert[]>;
}