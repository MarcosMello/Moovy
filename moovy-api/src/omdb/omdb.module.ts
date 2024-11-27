import { Module } from '@nestjs/common';
import { OmdbController } from './omdb.controller';
import { HttpModule } from '@nestjs/axios';
import { OmdbService } from './omdb.service';
import { MoviesModule } from "../movies/movies.module";

@Module({
  imports: [HttpModule, MoviesModule],
  controllers: [OmdbController],
  providers: [OmdbService],
})
export class OmdbModule {}
