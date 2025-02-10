type Part = Partial<ConcertSeat>;

export class ConcertSeat {
    
    seatId: number
    scheduleId: number;
    concertId: number;
    status: "reservatable"|"temp"|"reserved"|"sold";

    // of 메서드: Partial 타입을 이용해 객체를 생성
    static of(partial: Part): ConcertSeat;
    static of(partial: Part[]): ConcertSeat[];
    static of(
        partial: Part | Part[]
    ): ConcertSeat | ConcertSeat[] {
        if(Array.isArray(partial)) return partial.map(partial => this.of(partial));
        return new ConcertSeat({ ...partial });
    }

    // 생성자에서 전개 연산자를 사용해 필드 초기화
    constructor(partial: Partial<ConcertSeat>) {
        Object.assign(this, partial);
    }

}
  