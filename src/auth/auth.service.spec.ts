import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let authService: AuthService;
    let authRepository: AuthRepository;
    const mockAuthRepository = () => ({
        login: jest.fn(),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtModule,
                {
                    provide:getRepositoryToken(AuthRepository),
                    useFactory: mockAuthRepository,
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(() => 'token'),
                    }
                }
            ]
        }).compile();

        authService = await module.get<AuthService>(AuthService);
        authRepository = await module.get<AuthRepository>(AuthRepository);
    });

    /**
     * Test that the service is defined
     */
    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    /**
     * Unit test for the findWhere() method
     */
    // describe('finding an auth record by email', () => {
    //     /**
    //      * Non-existing user
    //      */
    //     it('should return null if it cannot find a user record', async () => {
    //         const email = 'notAUser@email.com';

    //         const result = await authService.findWhere({
    //             email: email,
    //         });

    //         expect(result).toBe(null);
    //     });

    //     /**
    //      * Existing user
    //      */
    //     it('should return an auth record', async () => {
    //         const email = 'user@email.com';
    //         const password = await authService.hashPassword('password123');
    //         const resetToken = 'JnKiuhg07Byg6g876gbG';

    //         const existingAuthEntity = AuthEntity.of({
    //             id: 1,
    //             email: email,
    //             password: password,
    //             reset_token: resetToken,
    //             created_at: new Date().valueOf(),
    //             updated_at: new Date().valueOf(),
    //         });

    //         const authRepositoryFindOneSpy = jest
    //             .spyOn(authRepository, 'findOne')
    //             .mockResolvedValue(existingAuthEntity);

    //         const result = await authService.findWhere({
    //             email: email,
    //         });

    //         expect(result).toBe(existingAuthEntity);
    //         expect(authRepositoryFindOneSpy).toHaveBeenCalledWith({
    //             where: {
    //                 email: email,
    //             },
    //         });
    //     });
    // });

    /**
     * Password Hashing
     */
    // describe('ensuring that passwords are hashed', () => {
    //     /**
    //      * Return a hashed string
    //      */
    //     it('it should return a hashed string', async () => {
    //         const password = 'password123';
    //         const regEx = '$2';

    //         const result = await authService.hashPassword(password);

    //         expect(result).toMatch(regEx);
    //     });
    // });

    /**
     * Password comparison
     */
    // describe('comparing a password with the hashed version', () => {
    //     /**
    //      * Incorrect password match
    //      */
    //     it('reject an incorrect password', async () => {
    //         const incorrectPassword = 'NotTheRightPassword';
    //         const hashedPassword = await authService.hashPassword('password123');

    //         const result = await authService.passwordsAreEqual(incorrectPassword, hashedPassword);

    //         expect(result).toBeFalsy();
    //     });

    //     /**
    //      * Missing password
    //      */
    //     it('reject a missing password', async () => {
    //         const hashedPassword = await authService.hashPassword('password123');

    //         const result = await authService.passwordsAreEqual('', hashedPassword);

    //         expect(result).toBeFalsy();
    //     });

    //     /**
    //      * Correct password match
    //      */
    //     it('reject an incorrect password', async () => {
    //         const correctPassword = 'password123';
    //         const hashedPassword = await authService.hashPassword('password123');

    //         const result = await authService.passwordsAreEqual(correctPassword, hashedPassword);

    //         expect(result).toBeTruthy();
    //     });
    // });















    // it('should reject missing email', async () => {
    //     expect.assertions(2);

    //     try {
    //         await authService.login('', '12345@');
    //     } catch (e) {
    //         expect(e).toBeInstanceOf(BadRequestException);
    //         expect(e.message).toBe('Valid email is required');
    //     }
    // });

    // it('should reject missing password', async () => {
    //     expect.assertions(2);

    //     try {
    //         await authService.login('user@email.com', '');
    //     } catch (e) {
    //         expect(e).toBeInstanceOf(BadRequestException);
    //         expect(e.message).toBe('Password is required');
    //     }
    // });

    // it('should reject a malformed email', async () => {
    //     expect.assertions(2);

    //     try {
    //         await authService.login('notAnEmail', '12345@');
    //     } catch (e) {
    //         expect(e).toBeInstanceOf(BadRequestException);
    //         expect(e.message).toBe('Email address is not valid');
    //     }
    // });

    // it('should reject incorrect login credentials', async () => {
    //     expect.assertions(2);

    //     try {
    //         await authService.login('notAnEmail', '12345@');
    //     } catch (e) {
    //         expect(e).toBeInstanceOf(UnauthorizedException);
    //         expect(e.message).toBe('Invalid login credentials');
    //     }
    // });

    // it('it should reject a deactivated user in the system', async () => {
    //     expect.assertions(2);

    //     try {
    //         await authService.login('notAUser@email.com', '12345@');
    //     } catch (e) {
    //         expect(e).toBeInstanceOf(UnauthorizedException);
    //         expect(e.message).toBe('Invalid login credentials');
    //     }
    // });
});
