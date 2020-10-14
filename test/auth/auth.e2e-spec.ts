import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthEntity } from 'src/auth/auth.entity';
import { AuthRepositoryFake } from 'src/auth/auth.repository.fake';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let service: AuthService;
    let authRepository: Repository<AuthEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(AuthEntity),
                    useClass: AuthRepositoryFake,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        authRepository = module.get(getRepositoryToken(AuthEntity));
    });

    it('/auth/login (POST)', async () => {
        const requestBody = {
            email: 'user@email.com',
            password: 'password123',
        };

        const existingAuthEntity = AuthEntity.of({
            id: 1,
            email: requestBody.email,
            password: await service.hashPassword('password123'),
            reset_token: '',
            created_at: new Date().valueOf(),
            updated_at: new Date().valueOf(),
        });

        const response = await request(app.getHttpServer()).post('/auth/login').send(requestBody);

        console.log(response);
        expect(response.status).toBe(200);

        // const authRepositoryFindOneSpy = jest
        //     .spyOn(authRepository, 'login')
        //     .mockResolvedValue(existingAuthEntity);
    });
});
