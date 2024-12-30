import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

const config: Options = {
    driver: MySqlDriver,
    dbName: 'mydb',
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'qwer1234',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: true,
};

export default config;