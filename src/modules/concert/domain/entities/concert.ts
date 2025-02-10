type Part = Partial<Concert>;

export class Concert {
    
    concertId: number;
    isReservatable: boolean;

    // of 메서드: Partial 타입을 이용해 객체를 생성
    static of(partial: Part): Concert;
    static of(partial: Part[]): Concert[];
    static of(
        partial: Part | Part[]
    ): Concert | Concert[] {
        if(Array.isArray(partial)) return partial.map(partial => this.of(partial));
        return new Concert({ ...partial });
    }

    // 생성자에서 전개 연산자를 사용해 필드 초기화
    constructor(partial: Partial<Concert>) {
        Object.assign(this, partial);
    }

}
  