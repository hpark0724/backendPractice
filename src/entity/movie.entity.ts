import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';


@Entity()
@Index({ name: 'genre_fulltext_idx', properties: ['genre'] })
export class Movie {
    @PrimaryKey()
    id!: number;

    @Property()
    title!: string;

    // @Property({ nullable: true })
    @Property({ columnType: 'text' })
    genre!: string;

    @Property()
    duration!: number;

    @Property()
    createdAt: Date = new Date();

    @Property({ nullable: true })
    deletedAt?: Date;

    @Property({ persist: false })
    get isDeleted(): boolean {
        return !!this.deletedAt;
    }
}