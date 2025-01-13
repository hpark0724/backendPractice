import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
// theaterId, seatRow, seatColumn 조합 데이터베이스에서 중복X
@Unique({ properties: ['theatherId', 'seatRow', 'seatColumn'] })
export class Seat {
    @PrimaryKey()
    id !: number;

    @Property()
    theatherId: number;

    @Property()
    seatRow!: string;

    @Property()
    seatColumn!: string;

    @Property()
    isReserved: boolean = false;

}