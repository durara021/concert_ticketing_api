import { Module } from '@nestjs/common';
import { ConcertQueryService } from './domain/services/concert.query.service';

@Module({
    providers: [ConcertQueryService],
    exports: [ConcertQueryService],
})
export class ConcertModule {}