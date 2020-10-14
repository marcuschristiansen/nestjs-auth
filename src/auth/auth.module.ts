import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';

@Module({
    imports: [
        JwtModule.register({ secret: process.env.JWT_SECRET || 'ABCDE12345' }),
        TypeOrmModule.forFeature([AuthRepository]),
    ],
    exports: [TypeOrmModule, AuthService],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
