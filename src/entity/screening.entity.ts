import {
    Entity,
    ManyToOne,
    PrimaryKey,
    Property,
    Ref,
} from '@mikro-orm/core';

import { Movie } from './movie.entity';

@Entity()
export class Screening {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Movie)
    movie!: Ref<Movie>;

    @Property()
    startTime!: Date;

    @Property()
    theaterId!: number;

    @Property()
    totalSeats !: number;

    @Property()
    reservedSeats: number = 0;

    @Property({ nullable: true })
    deletedAt?: Date;

    @Property({ persist: false })
    get isDeleted(): boolean {
        return !!this.deletedAt;
    }

}