import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MovieUser } from '../entity/movie-user.entity';
import { CreateMovieUserDto, CreateMovieUserResultDto } from '../dto/movie-user';
import * as crypto from 'crypto';

@Injectable()
export class MovieUserService {
    constructor(private readonly em: EntityManager) { }

    async create(createUserDto: CreateMovieUserDto): Promise<CreateMovieUserResultDto> {
        const existingUser = await this.em.findOne(MovieUser, { email: createUserDto.email });
        
        if (existingUser) {
            throw new HttpException('이미 존재하는 이메일입니다', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = crypto
            .createHash('md5')
            .update(createUserDto.password)
            .digest('hex');

        const user = this.em.create(MovieUser, {
            ...createUserDto,
            password: hashedPassword,
        });

        await this.em.persistAndFlush(user);
        return {
            id: user.id,
            email: user.email
        };
    }

    async findAll(): Promise<MovieUser[]> {
        return await this.em.find(MovieUser, {});
    }

    async findOne(id: number): Promise<MovieUser> {
        const user = await this.em.findOne(MovieUser, { id });
        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}