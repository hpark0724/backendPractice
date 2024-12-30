import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto, LoginDto } from '../dto/auth'
import { MovieUser } from '../entity/movie-user.entity';

import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

@Injectable()
export class AuthService {
    constructor(private readonly em: EntityManager) { }

    async register(registerBody: RegisterDto): Promise<{ email: string }> {
        const user = await this.em.findOne(MovieUser, { email: registerBody.email });

        if (user) {
            throw new HttpException('이미 존재하는 이메일입니다', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = crypto
            .createHash('md5')
            .update(registerBody.password)
            .digest('hex');

        const newUser = this.em.create(MovieUser, {
            name: registerBody.name,
            email: registerBody.email,
            password: hashedPassword
        });

        await this.em.persistAndFlush(newUser);

        return {
            email: newUser.email
        };

    }

    async login(loginBody: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.em.findOne(MovieUser, { email: loginBody.email });

        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
        }

        const hashedPassword = crypto
            .createHash('md5')
            .update(loginBody.password)
            .digest('hex');

        if (user.password != hashedPassword) {
            throw new HttpException('비밀번호가 틀렸습니다', HttpStatus.BAD_REQUEST);
        };

        const accessToken = jwt.sign({ email: user.email }, JWT_SECRET);

        return { accessToken };

    }


    // private users: { email: string; password: string }[] = [];

    // register(registerBody: { email: string; password: string }) {
    //     const user = this.users.find(
    //         (user) => user.email === registerBody.email
    //     );

    //     if (user) {
    //         throw Error(' User Already Exists');
    //     }

    //     this.users.push({
    //         email: registerBody.email,
    //         password: crypto
    //             .createHash('md5') // MD5 알고리즘을 사용하는 해시 객체 셍성
    //             .update(registerBody.password) // 데이터 전달 
    //             .digest('hex') // 해싱 처리 완료, hex 문자열로 반환
    //     });

    //     return {
    //         email: registerBody.email,
    //     };
    // }

    // login(loginBody: { email: string, password: string }) {
    //     const user = this.users.find(user => user.email === loginBody.email);

    //     if (!user) {
    //         throw Error("User Not Found");
    //     }

    //     const password = crypto
    //         .createHash('md5')
    //         .update(loginBody.password)
    //         .digest('hex');

    //     if (user.password !== password) {
    //         throw Error("Invalid Password");
    //     }

    //     const accessToken = jwt.sign({ email: user.email }, JWT_SECRET);

    //     return { accessToken };

    // }
}
