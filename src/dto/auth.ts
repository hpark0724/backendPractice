import { PartialType } from '@nestjs/mapped-types';

interface RegisterBody {
    username: string;
    password: string;
}

export class RegisterDto implements RegisterBody {
    username: string;
    password: string;
}

export class LoginDto extends PartialType(RegisterDto) { }