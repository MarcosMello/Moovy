import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {MovieDto, MovieResponseDto, MovieRouteParameters, MoviesInLibraryDto} from './movie.dto';
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
   const movieEntity: MovieEntity = await this.movieRepository.createQueryBuilder()
        .where('user_id = :userId', {userId: loggedUser.sub})
        .andWhere('id = :id', {id: id})
        .getOne();

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
    const movieEntity: MovieEntity = await this.movieRepository.createQueryBuilder()
        .where('user_id = :userId', {userId: loggedUser.sub})
        .andWhere('imdb_id = :imdbId', {imdbId: id})
        .getOne();

    return !!movieEntity;
  }

  async isMoviesInLibrary(ids: string[], loggedUser: LoggedUserDto): Promise<Map<string, MoviesInLibraryDto>> {
    const movieEntities = await this.movieRepository.find({
      where: { userId: loggedUser.sub, imdbID: In([...ids]) },
    });

    return new Map<string, MoviesInLibraryDto>(movieEntities.map(movieEntity => {
      return [movieEntity.imdbID, {
        id: movieEntity.id,
        imdbRating: movieEntity.imdbRating,
      }];
    }))
  }

  async getMoviesFrom(loggedUser: LoggedUserDto, page: number = 1, limit: number = 10): Promise<MovieResponseDto> {
    const offset: number = (page - 1) * limit;
    const [ movieEntities, totalResults ] = await this.movieRepository.findAndCount({
      where: { userId: loggedUser.sub },
      skip: offset,
      take: limit,
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
      page: page,
      totalPages: Math.ceil(totalResults / limit),
      totalResults: totalResults,
    };
  }

  async saveMovieToLoggedUser(
    user: LoggedUserDto,
    body: MovieDto,
  ): Promise<MovieDto> {
    const isMovieAlreadyInUserLibrary: MovieEntity = await this.movieRepository.createQueryBuilder()
        .where('user_id = :userId', {userId: user.sub})
        .andWhere('imdb_id = :imdbId', {imdbId: body.imdbID})
        .getOne();

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

  async remove(id: string, loggedUser: LoggedUserDto): Promise<void> {
    const movieEntity: MovieEntity = await this.movieRepository.createQueryBuilder()
        .where('user_id = :userId', {userId: loggedUser.sub})
        .andWhere('id = :id', {id: id})
        .getOne();

    if (!movieEntity) {
      throw new NotFoundException(`Movie with id ${id} associated with user ${loggedUser.username} not found!`);
    }

    await this.movieRepository.delete(id);
    return;
  }
}
