import { Module } from '@nestjs/common';
import { AuthController } from './interfaces/controller/auth.controller';
import { AuthService } from './application/service/auth.service';
import { AuthRepository } from './domain/repository/auth.repository';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
    exports: [AuthService, AuthRepository],
})
export class AuthModule { }
