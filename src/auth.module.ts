import { Module } from '@nestjs/common';
import { AuthController } from './interfaces/controller/auth.controller';
import { AuthService } from '../src/application/service/auth.service';
import { AuthRepository } from './domain/repository/auth.repository';

@Module({
    imports: [],
    controllers: [AuthController, AuthRepository],
    providers: [AuthService],

})
export class AuthModule { }