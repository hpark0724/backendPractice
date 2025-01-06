import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Movie {
    @PrimaryKey()
    id!: number;

    @Property()
    title!: string;

    @Property({ nullable: true })
    genre?: string;

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