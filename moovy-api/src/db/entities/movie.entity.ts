import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'movie' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  poster: string;

  @Column({ type: 'varchar', name: 'imdb_rating' })
  imdbRating: string;

  @Column({ type: 'varchar', name: 'imdb_id' })
  imdbID: string;

  @Column({ type: 'varchar', name: 'audio_review_url', nullable: true })
  audioReviewURL: string;

  @ManyToOne(() => UserEntity, (user) => user.movies)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;
}
