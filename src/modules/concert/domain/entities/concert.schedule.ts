type Part = Partial<ConcertSchedule>;

export class ConcertSchedule {
    
    scheduleId: number;
    concertId: number;
    capacity: number;
    current: number;
    date: Date;
    isReservatable: boolean;

    // of 메서드: Partial 타입을 이용해 객체를 생성
    static of(partial: Part): ConcertSchedule;
    static of(partial: Part[]): ConcertSchedule[];
    static of(
        partial: Part | Part[]
    ): ConcertSchedule | ConcertSchedule[] {
        if(Array.isArray(partial)) return partial.map(partial => this.of(partial));
        return new ConcertSchedule({ ...partial });
    }

    // 생성자에서 전개 연산자를 사용해 필드 초기화
    constructor(partial: Partial<ConcertSchedule>) {
        Object.assign(this, partial);
    }

}
  