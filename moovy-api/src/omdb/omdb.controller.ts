import {Controller, Get, Param, Query, Req, UseGuards} from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { OmdbDto, OmdbQueryParameters } from './omdbDto';
import { AuthGuard } from '../auth/auth.guard';
import {LoggedUserDto} from "../auth/auth.dto";
import {plainToInstance} from "class-transformer";

@UseGuards(AuthGuard)
@Controller('omdb')
export class OmdbController {
  constructor(private readonly omdbService: OmdbService) {}

  @Get('/:id')
  findMovieById(@Param('id') id: string, @Req() request: any): Promise<OmdbDto> {
    const user: LoggedUserDto = plainToInstance(LoggedUserDto, request.user);

    return this.omdbService.getMovieById(id, user);
  }

  @Get()
  findAllMovies(@Query() queryParameters: OmdbQueryParameters, @Req() request: any) {
    const user: LoggedUserDto = plainToInstance(LoggedUserDto, request.user);

    return this.omdbService.findAllMovies(queryParameters, user);
  }
}
