import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log(request.headers);

        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new HttpException("Authorization header is missing", HttpStatus.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
        }

        try {
            request.user = jwt.verify(token, 'secret');
            return true;
        } catch (error) {
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }
}

