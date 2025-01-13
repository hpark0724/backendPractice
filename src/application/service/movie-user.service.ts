import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MovieUser } from '../../../src/domain/entity/movie-user.entity';
import { CreateMovieUserDto, CreateMovieUserResultDto } from '../../interfaces/dto/movie-user';
import { MovieUserRepository } from '../../../src/domain/repository/movie-user.repository';
import * as crypto from 'crypto';

@Injectable()
export class MovieUserService {
    constructor(private readonly movieUserRepository: MovieUserRepository) { }

    async create(createUserDto: CreateMovieUserDto): Promise<CreateMovieUserResultDto> {
        const existingUser = await this.movieUserRepository.findByEmail(createUserDto.email);

        if (existingUser) {
            throw new HttpException('이미 존재하는 이메일입니다', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = crypto
            .createHash('md5')
            .update(createUserDto.password)
            .digest('hex');

        const user = await this.movieUserRepository.createUser({
            ...createUserDto,
            password: hashedPassword,
        });

        return {
            id: user.id,
            email: user.email
        };
    }

    async findAll(): Promise<MovieUser[]> {
        return await this.movieUserRepository.findAllUsers();
    }

    async findOne(id: number): Promise<MovieUser> {
        const user = await this.movieUserRepository.findById(id);
        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}