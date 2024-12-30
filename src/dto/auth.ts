import { PartialType } from '@nestjs/mapped-types';

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export class RegisterDto implements RegisterBody {
    name: string;
    email: string;
    password: string;
}

export class LoginDto extends PartialType(RegisterDto) { }