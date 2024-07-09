import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
