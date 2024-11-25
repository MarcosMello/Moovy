import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put, Req, Res, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MoviesService } from './movies.service';
import { LoggedUserDto } from '../auth/auth.dto';
import { plainToInstance } from 'class-transformer';
import { MovieDto, MovieResponseDto, MovieRouteParameters } from './movie.dto';
import { validate } from 'class-validator';
import { HttpStatusCode } from 'axios';
import { FileInterceptor } from "@nestjs/platform-express";
import multerConfig from "../files/multer-config";
import { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  async getLoggedUserMovies(
    @Req() request: any,
  ): Promise<MovieResponseDto> {
    const user: LoggedUserDto = plainToInstance(LoggedUserDto, request.user);

    return this.movieService.getMoviesFrom(user);
  }

  @Post()
  @HttpCode(HttpStatusCode.Created)
  async saveMovieToLoggedUser(
    @Req() request: any,
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
  @UseInterceptors(FileInterceptor('audioFile', multerConfig))
  async update(
    @Param() parameters: MovieRouteParameters,
    @Body() movie: MovieDto,
    @Req() request: Request,
    @UploadedFile() audio?: Express.Multer.File,
  ): Promise<void> {
    await this.movieService.update(parameters, movie, request, audio);
  }

  @Get('/:id')
  async getUploadedFile(@Param('id') movieId: string, @Req() request: any, @Res() response: Response): Promise<void> {
    const user: LoggedUserDto = plainToInstance(LoggedUserDto, request.user);
    const movie: MovieDto = await this.movieService.getMovieById(movieId, user);

    return response.sendFile(movie.audioReviewURL, { root: 'uploads/files' });
  }
}
