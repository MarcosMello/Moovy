import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MoviesService } from './movies.service';
import { LoggedUserDto } from '../auth/auth.dto';
import { plainToInstance } from 'class-transformer';
import { MovieDto, MovieResponseDto, MovieRouteParameters } from './movie.dto';
import { validate } from 'class-validator';
import { HttpStatusCode } from 'axios';

@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  async getLoggedUserMovies(
    @Request() request: any,
  ): Promise<MovieResponseDto> {
    const user: LoggedUserDto = plainToInstance(LoggedUserDto, request.user);

    return this.movieService.getMoviesFrom(user);
  }

  @Post()
  @HttpCode(HttpStatusCode.Created)
  async saveMovieToLoggedUser(
    @Request() request: any,
    @Body() body: MovieDto,
  ): Promise<MovieDto> {
    const user: LoggedUserDto = plainToInstance(LoggedUserDto, request.user);

    if ((await validate(body)).length) {
      throw new BadRequestException(
        'Error while validating body, try again later!',
      );
    }

    return await this.movieService.saveMovieToLoggedUser(user, body);
  }

  @Put('/:id')
  async update(
    @Param() parameters: MovieRouteParameters,
    @Body() movie: MovieDto,
  ): Promise<void> {
    await this.movieService.update(parameters, movie);
  }
}
