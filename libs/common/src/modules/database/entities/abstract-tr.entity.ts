import {BeforeUpdate, Column, PrimaryGeneratedColumn} from 'typeorm';

export class AbstractTrEntity<T> {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    language: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at?: Date;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at?: Date;

    @BeforeUpdate()
    updateDate() {
        this.updated_at = new Date();
    }
}
