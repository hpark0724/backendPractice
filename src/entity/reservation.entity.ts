import { Entity, ManyToOne, PrimaryKey, Property, Ref, Unique } from '@mikro-orm/core';
import { MovieUser } from './movie-user.entity';
import { Screening } from './screening.entity';

@Entity()
@Unique({ properties: ['screening', 'seatNumber'] })
export class Reservation {
    @PrimaryKey()
    id !: number;

    // one movie user -> 여러 Reservation
    @ManyToOne(() => MovieUser)
    user!: Ref<MovieUser>;

    // One Screening(상영관) => 여러 Reservation
    @ManyToOne(() => Screening)
    screening!: Ref<Screening>;

    @Property()
    seatNumber!: string;

    @Property()
    reservedAt: Date = new Date();

    @Property({ nullable: true })
    deletedAt?: Date;

    @Property({ persist: false })
    get isDeleted(): boolean {
        return !!this.deletedAt;
    }

}