import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { MovieDto, MovieResponseDto, MovieRouteParameters } from './movie.dto';
import { LoggedUserDto } from '../auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MovieEntity } from '../db/entities/movie.entity';
import { Request } from 'express';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async getMovieById(id: string, loggedUser: LoggedUserDto): Promise<MovieDto> {
    const movieEntity = await this.movieRepository.findOne({
      where: { userId: loggedUser.sub, id: id },
    });

    if (!movieEntity) {
      throw new NotFoundException(`Movie with id ${id} associated with user ${loggedUser.username} not found!`);
    }

    return {
      id: movieEntity.id,
      title: movieEntity.title,
      poster: movieEntity.poster,
      imdbRating: movieEntity.imdbRating,
      imdbID: movieEntity.imdbID,
      audioReviewURL: movieEntity.audioReviewURL,
      isInLibrary: true,
    };
  }

  async isMovieInLibrary(id: string, loggedUser: LoggedUserDto): Promise<boolean> {
    const movieEntity = await this.movieRepository.findOne({
      where: { userId: loggedUser.sub, imdbID: id },
    });

    return !!movieEntity;
  }

  async isMoviesInLibrary(ids: string[], loggedUser: LoggedUserDto): Promise<Set<String>> {
    const movieEntities = await this.movieRepository.find({
      where: { userId: loggedUser.sub, imdbID: In([...ids]) },
    });

    return new Set<String>(movieEntities.map(movieEntity => {
      return movieEntity.imdbID;
    }))
  }

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
        isInLibrary: true,
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
      isInLibrary: true,
    };
  }

  async update(
    parameters: MovieRouteParameters,
    movieDto: MovieDto,
    request: Request,
    audio?: Express.Multer.File,
  ): Promise<void> {
    const foundMovie = await this.movieRepository.findOne({
      where: { id: parameters.id },
    });

    if (!foundMovie) {
      throw new BadRequestException(
        `Movie associated with id ${parameters.id} not found!`,
      );
    }

    if (audio) {
      movieDto.audioReviewURL = `${audio.filename}`;
    }

    await this.movieRepository.update(foundMovie.id, {
      title: movieDto.title,
      poster: movieDto.poster,
      imdbRating: movieDto.imdbRating,
      imdbID: movieDto.imdbID,
      audioReviewURL: movieDto.audioReviewURL,
    });

    return;
  }
}
