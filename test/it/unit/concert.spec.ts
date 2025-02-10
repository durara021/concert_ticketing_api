import { Test, TestingModule } from '@nestjs/testing';
import { ConcertQueryService } from 'src/modules/concert/domain/services';
import { ConcertRepository, ConcertScheduleRepository, ConcertSeatRepository } from 'src/modules/concert/domain/repositories';
import { Concert, ConcertSchedule, ConcertSeat } from 'src/modules/concert/domain/entities';
import { NotFoundException } from '@nestjs/common';

describe('ConcertQueryService 테스트', () => {

    // 테스트 대상 서비스
    let service: ConcertQueryService;
    
    // 테스트 데이터
    const concertsInfo: Concert[] = Concert.of([
        { concertId: 1, isReservatable: true },
        { concertId: 2, isReservatable: false },
        { concertId: 3, isReservatable: true },
    ]);

    const schedules: ConcertSchedule[] = ConcertSchedule.of([
        { scheduleId: 1, concertId: 1, date: new Date(2023, 9, 1), isReservatable: true, capacity: 500, current: 27 },
        { scheduleId: 2, concertId: 2, date: new Date(2023, 9, 2), isReservatable: true, capacity: 500, current: 29 },
        { scheduleId: 3, concertId: 1, date: new Date(2023, 9, 3), isReservatable: true, capacity: 500, current: 32 },
        { scheduleId: 4, concertId: 2, date: new Date(2023, 9, 1), isReservatable: false, capacity: 500, current: 500 },
    ]);

    const seats: ConcertSeat[] = ConcertSeat.of([
        { seatId: 1, scheduleId: 1, concertId: 1, status: "reservatable" },
        { seatId: 2, scheduleId: 1, concertId: 1, status: "reservatable" },
        { seatId: 3, scheduleId: 1, concertId: 1, status: "reservatable" },
        { seatId: 4, scheduleId: 1, concertId: 1, status: "reservatable" },
        { seatId: 5, scheduleId: 1, concertId: 1, status: "reservatable" },
        { seatId: 6, scheduleId: 2, concertId: 2, status: "reservatable" },
        { seatId: 7, scheduleId: 2, concertId: 2, status: "reservatable" },
        { seatId: 8, scheduleId: 2, concertId: 2, status: "reservatable" },
        { seatId: 9, scheduleId: 2, concertId: 2, status: "reservatable" },
        { seatId: 10, scheduleId: 2, concertId: 2, status: "sold" },
    ]);

    // 테스트 모듈 설정
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConcertQueryService,
                { // 콘서트 정보 레포지토리 모킹
                    provide: ConcertRepository,
                    useValue: {
                        concertsInfo: jest.fn().mockImplementation((concertId?: number) => {
                            if (concertId == null) {
                                return concertsInfo;
                            } else {
                                const concertInfo = concertsInfo.filter(concert => concert.concertId === concertId);
                                if(concertInfo.length === 0) {
                                    throw new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.');
                                } else {
                                    return concertInfo;
                                }
                            } 
                        }),
                    }
                },
                { // 콘서트 일정 정보 레포지토리 모킹
                    provide: ConcertScheduleRepository,
                    useValue: {
                        schedulesInfo: jest.fn().mockImplementation((concertId: number) => {                     
                            const schedule = schedules.filter(concert => concert.concertId === concertId);
                            if(schedule.length === 0) {
                                throw new NotFoundException('해당 콘서트 일정 정보를 찾을 수 없습니다.');
                            } else {
                                return schedule;
                            }
                        }),
                    }
                },
                { // 콘서트 좌석 정보 레포지토리 모킹
                    provide: ConcertSeatRepository,
                    useValue: {
                        seatsInfo: jest.fn().mockImplementation((concertId: number, scheduleId: number) => {
                            const seat = seats.filter(concert => concert.concertId === concertId && concert.scheduleId === scheduleId);
                            if(seat.length === 0) {
                                throw new NotFoundException('해당 콘서트 좌석 정보를 찾을 수 없습니다.');
                            } else {
                                return seat;
                            }
                        }),
                    }
                },
            ],
        }).compile();

        service = module.get<ConcertQueryService>(ConcertQueryService);
    });

    describe('concerts 함수 테스트', () => {

        it('concerts 함수를 호출했을 때_요청값이 없다면_모든 객체를 반환해야한다.', async () => {
            const result = await service.concerts();

            expect(result.map(concert => concert.concertId)).toEqual([1, 2, 3]);
        });

        it('concerts 함수를 호출했을 때_요청값이 존재한다면_해당 객체를 반환해야한다.', async () => {
            
            const result = await service.concerts(1);

            expect(result[0].concertId).toEqual(1);
        });

        it('concerts 함수를 호출했을 때_요청값이 존재하지 않는 값이라면_NotFoundException을 발생시켜야 한다.', async () => {
            await expect(service.concerts(4)).rejects.toThrow(new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.'));
        });

    });
    
    describe('schedules 함수 테스트', () => {
       
        it('schedules 함수를 호출했을 때_요청값(concertId)의 값이 존재하지 않는 값이라면_NotFoundException을 발생시켜야 한다.', async () => {
            await expect(service.schedules(4)).rejects.toThrow(new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.'));
        });

        it('schedules 함수를 호출했을 때_요청값(concertId)의 값이 존재하나 일정이 존재하지 않는다면_NotFoundException을 발생시켜야 한다.', async () => {
            await expect(service.schedules(3)).rejects.toThrow(new NotFoundException('해당 콘서트 일정 정보를 찾을 수 없습니다.'));
        });

        it('schedules 함수를 호출했을 때_요청값(concertId)의 값이 존재하고 일정이 존재한다면_해당 객체를 반환해야한다.', async () => {
            let result = await service.schedules(1);
            expect(result.map(schedule => schedule.scheduleId)).toEqual([1, 3]);

            result = await service.schedules(2);
            expect(result.map(schedule => schedule.scheduleId)).toEqual([2, 4]);
        });

    });

    describe('seats 함수 테스트', () => {

        it('seats 함수를 호출했을 때_요청값(concertId)의 값이 존재하지 않는 값이라면_NotFoundException을 발생시켜야 한다.', async () => {
            await expect(service.seats(4, 1)).rejects.toThrow(new NotFoundException('해당 콘서트 정보를 찾을 수 없습니다.'));
        });

        it('seats 함수를 호출했을 때_요청값(concertId)의 값이 존재하나 일정이 존재하지 않는다면_NotFoundException을 발생시켜야 한다.', async () => {
            await expect(service.seats(3, 1)).rejects.toThrow(new NotFoundException('해당 콘서트 일정 정보를 찾을 수 없습니다.'));
        });

        it('seats 함수를 호출했을 때_요청값(concertId)의 값이 존재하고 일정이 존재하지만 좌석이 존재하지 않는다면_NotFoundException을 발생시켜야 한다.', async () => {
            await expect(service.seats(2, 1)).rejects.toThrow(new NotFoundException('해당 콘서트 좌석 정보를 찾을 수 없습니다.'));
        });

        it('seats 함수를 호출했을 때_요청값(concertId)의 값이 존재하고 일정이 존재하며 좌석이 존재한다면_해당 객체를 반환해야한다.', async () => {
            let result = await service.seats(1, 1);
            expect(result.map(seat => seat.seatId)).toEqual([1, 2, 3, 4, 5]);

            result = await service.seats(2, 2);
            expect(result.map(seat => seat.seatId)).toEqual([6, 7, 8, 9, 10]);
        });
        
    });
});