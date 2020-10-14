import { isNotEmpty, isString } from 'class-validator';

export class LoginDTO {
    readonly email: string;
    readonly password: string;
}
