import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { RegisterDto, LoginDto } from 'src/dto/auth';

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
            username: loginBody.username,
            password: loginBody.password
        });
    }
}