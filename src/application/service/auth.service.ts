import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { AuthRepository } from '../../domain/repository/auth.repository';
import { LoginDto, RegisterDto } from 'src/interfaces/dto/auth';

const JWT_SECRET = 'secret';

@Injectable()
export class AuthService {
    // constructor(private readonly em: EntityManager) { }

    constructor(private readonly authRepository: AuthRepository) { }


    async register(registerBody: RegisterDto): Promise<{ email: string }> {
        const user = await this.authRepository.findByEmail(registerBody.email);

        if (user) {
            throw new HttpException('이미 존재하는 이메일입니다', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = crypto
            .createHash('md5')
            .update(registerBody.password)
            .digest('hex');

        const newUser = await this.authRepository.createUser({
            name: registerBody.name,
            email: registerBody.email,
            password: hashedPassword
        });

        return {
            email: newUser.email
        };

    }

    async login(loginBody: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.authRepository.findByEmail(loginBody.email);

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
}