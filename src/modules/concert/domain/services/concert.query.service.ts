import { Injectable, NotFoundException } from '@nestjs/common';
import { Concert, ConcertSchedule, ConcertSeat } from '../entities';
import { ConcertRepository, ConcertScheduleRepository, ConcertSeatRepository } from '../repositories';

@Injectable()
export class ConcertQueryService {

    constructor(
        private readonly concertRepository: ConcertRepository,
        private readonly concertScheduleRepository: ConcertScheduleRepository,
        private readonly concertSeatRepository: ConcertSeatRepository
    ) {}

    // 콘서트 조회
    async concerts(concertId?: number): Promise<Concert[]> {

        // 콘서트 조회
        const concertsInfo = await this.concertRepository.concertsInfo(concertId);
        if (!concertsInfo || (Array.isArray(concertsInfo) && concertsInfo.length === 0)) {
            throw new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.');
        }
        return concertsInfo;
        
    }
    
    // 콘서트 일정 조회
    async schedules(concertId: number): Promise<ConcertSchedule[]> {
        
        // 콘서트 조회
        const concertsInfo = await this.concertRepository.concertsInfo(concertId);
        if (!concertsInfo || (Array.isArray(concertsInfo) && concertsInfo.length === 0)) {
            throw new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.');
        }
        
        // 콘서트 일정 조회
        const concertSchedulesInfo = await this.concertScheduleRepository.schedulesInfo(concertId);
        if (!concertSchedulesInfo || (Array.isArray(concertSchedulesInfo) && concertSchedulesInfo.length === 0)) {
            throw new NotFoundException('해당 콘서트 일정 정보를 찾을 수 없습니다.');
        }
        
        return concertSchedulesInfo;
        
    }
    
    // 콘서트 좌석 조회
    async seats(concertId: number, scheduleId: number): Promise<ConcertSeat[]> {

        // 콘서트 조회
        const concertsInfo = await this.concertRepository.concertsInfo(concertId);
        if (!concertsInfo || (Array.isArray(concertsInfo) && concertsInfo.length === 0)) {
            throw new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.');
        }
        
        // 콘서트 일정 조회
        const concertSchedulesInfo = await this.concertScheduleRepository.schedulesInfo(concertId);
        
        if (!concertSchedulesInfo || (Array.isArray(concertSchedulesInfo) && concertSchedulesInfo.length === 0)) {
            throw new NotFoundException('해당 콘서트 일정 정보를 찾을 수 없습니다.');
        }

        // 콘서트 좌석 조회 로직
        const concertSeatsInfo = await this.concertSeatRepository.seatsInfo(concertId, scheduleId);
        if (!concertSeatsInfo || (Array.isArray(concertSeatsInfo) && concertSeatsInfo.length === 0)) {
            throw new NotFoundException('해당 콘서트 좌석 정보를 찾을 수 없습니다.');
        }
        return concertSeatsInfo;
        
    }

}