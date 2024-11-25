import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieDto, MovieResponseDto, MovieRouteParameters } from './movie.dto';
import { LoggedUserDto } from '../auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../db/entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async getMoviesFrom(loggedUser: LoggedUserDto): Promise<MovieResponseDto> {
    const movieEntities = await this.movieRepository.find({
      where: { userId: loggedUser.sub },
    });

    const movies: MovieDto[] = movieEntities.map((movieEntity) => {
      return {
        id: movieEntity.id,
        title: movieEntity.title,
        poster: movieEntity.poster,
        imdbRating: movieEntity.imdbRating,
        imdbID: movieEntity.imdbID,
        audioReviewURL: movieEntity.audioReviewURL,
      };
    });

    return {
      data: movies,
      page: 1,
      totalPages: 1,
      totalResults: movies.length,
    };
  }

  async saveMovieToLoggedUser(
    user: LoggedUserDto,
    body: MovieDto,
  ): Promise<MovieDto> {
    const isMovieAlreadyInUserLibrary: MovieEntity =
      await this.movieRepository.findOne({
        where: { userId: user.sub, imdbID: body.imdbID },
      });

    if (isMovieAlreadyInUserLibrary) {
      throw new BadRequestException(
        'This movie is already in the user library.',
      );
    }

    const dbMovie: MovieEntity = {
      userId: user.sub,
      title: body.title,
      poster: body.poster,
      imdbRating: body.imdbRating,
      imdbID: body.imdbID,
      audioReviewURL: body.audioReviewURL,
    };

    const savedMovie: MovieEntity = await this.movieRepository.save(dbMovie);

    return {
      id: savedMovie.id,
      user: {
        id: savedMovie.user.id,
        username: savedMovie.user.username,
        password: null,
      },
      title: savedMovie.title,
      poster: savedMovie.poster,
      imdbRating: savedMovie.imdbRating,
      imdbID: savedMovie.imdbID,
      audioReviewURL: savedMovie.audioReviewURL,
    };
  }

  async update(
    parameters: MovieRouteParameters,
    task: MovieDto,
  ): Promise<void> {
    const foundMovie = await this.movieRepository.findOne({
      where: { id: parameters.id },
    });

    if (!foundMovie) {
      throw new BadRequestException(
        `Movie associated with id ${parameters.id} not found!`,
      );
    }

    await this.movieRepository.update(foundMovie.id, {
      title: task.title,
      poster: task.poster,
      imdbRating: task.imdbRating,
      imdbID: task.imdbID,
      audioReviewURL: task.audioReviewURL,
    });

    return;
  }
}
