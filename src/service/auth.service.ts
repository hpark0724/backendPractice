import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

@Injectable()
export class AuthService {
    private users: { username: string; password: string }[] = [];

    register(registerBody: { username: string; password: string }) {
        const user = this.users.find(
            (user) => user.username === registerBody.username
        );

        if (user) {
            throw Error(' User Already Exists');
        }

        this.users.push({
            username: registerBody.username,
            password: crypto
                .createHash('md5') // MD5 알고리즘을 사용하는 해시 객체 셍성
                .update(registerBody.password) // 데이터 전달 
                .digest('hex') // 해싱 처리 완료, hex 문자열로 반환
        });

        return {
            username: registerBody.username,
        };
    }

    login(loginBody: { username: string, password: string }) {
        const user = this.users.find(user => user.username === loginBody.username);

        if (!user) {
            throw Error("User Not Found");
        }

        const password = crypto
            .createHash('md5')
            .update(loginBody.password)
            .digest('hex');

        if (user.password !== password) {
            throw Error("Invalid Password");
        }

        const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);

        return { accessToken };

    }
}
