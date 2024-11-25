import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MovieEntity } from './movie.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string;

  @OneToMany(() => MovieEntity, (movie) => movie.user)
  movies?: MovieEntity[];
}
