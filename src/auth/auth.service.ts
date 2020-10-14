import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { AuthRepository } from './auth.repository';

// export interface FindWhereData {
//     readonly email: string;
//     readonly password: string;
// }

export interface LoginResponse {
    readonly token: string;
    readonly refresh_token: string;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService
    ) {}

    /**
     * Login user service
     *
     * @param doc
     */
    public async login(doc: LoginDTO): Promise<LoginResponse> {
        // verify user email
        const user = await this.authRepository.findOne({ email: doc.email });

        if (!user) {
            throw new NotFoundException('Could not find user');
        }
        // verify password
        const passwordsMatch = await this.passwordsAreEqual(doc.password, user.password);
        if (!passwordsMatch) {
            throw new UnauthorizedException('Incorrect login credentials');
        }

        // generate JWT
        const token = await this.jwtService.signAsync({ id: user.id });

        // create the refresh token
        const refreshToken = crypto.randomBytes(256).toString('hex');

        // store the refresh token

        return {
            token: token,
            refresh_token: refreshToken,
        };
    }

    /**
     * Generate a hashed password
     *
     * @param password
     */
    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();

        return await bcrypt.hash(password, salt);
    }

    /**
     * Compare password against an encrypted string
     *
     * @param password
     * @param encryptedPassword
     */
    public async passwordsAreEqual(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }

    /**
     * Find a record by column attribute and value
     *
     * @param queryObject
     *
     */
    public async findWhere(queryObject): Promise<AuthEntity> {
        const authEntity = await this.authRepository.findOne({ where: queryObject });

        if (!authEntity) {
            return null;
        }

        return authEntity;
    }

    public async findOne(id: string): Promise<AuthEntity> {
        return this.authRepository.findOne(id);
    }
}
