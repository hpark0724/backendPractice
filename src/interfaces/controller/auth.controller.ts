import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from '../../../src/application/service/auth.service';
import { RegisterDto, LoginDto } from 'src/interfaces/dto/auth';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerBody: RegisterDto) {
        return this.authService.register(registerBody);
    }

    @Post('login')
    login(@Body() loginBody: LoginDto) {
        return this.authService.login({

            email: loginBody.email,
            password: loginBody.password
        });
    }
}

