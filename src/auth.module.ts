import { Module } from '@nestjs/common';
import { AuthController } from './interfaces/controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService],

})
export class AuthModule { }