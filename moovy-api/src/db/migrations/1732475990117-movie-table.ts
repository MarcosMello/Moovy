import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovieTable1732475990117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie" (
            id uuid NOT NULL DEFAULT uuid_generate_v7(),
            user_id uuid NOT NULL, 
            title varchar(256) NOT NULL,
            poster varchar(256) NOT NULL,
            imdb_rating varchar(256) NOT NULL,
            imdb_id varchar(256) NOT NULL,
            audio_review_url varchar(256),
            CONSTRAINT movie_pk_id PRIMARY KEY (id),
            CONSTRAINT movie_user_un UNIQUE (user_id, imdb_id),
            CONSTRAINT user_fk_id FOREIGN KEY (user_id) REFERENCES "user"(id)
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS movie;`);
  }
}
