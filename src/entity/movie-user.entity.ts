import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'MovieUser' })
export class MovieUser {
    @PrimaryKey()
    id!: number;

    @Property()
    name: string = '';

    @Property({ unique: true })
    email!: string;

    @Property()
    password!: string;

    @Property({ name: 'createdAt' })
    createdAt: Date = new Date();
}