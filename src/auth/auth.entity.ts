import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth' })
export class AuthEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column()
    public reset_token: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    public created_at: number;
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    public updated_at: number;

    public static of(params: Partial<AuthEntity>): AuthEntity {
        const authEntity = new AuthEntity();

        Object.assign(authEntity, params);

        return authEntity;
    }
}
