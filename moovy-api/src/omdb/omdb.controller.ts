import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { OmdbDto, OmdbQueryParameters } from './omdbDto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('omdb')
export class OmdbController {
  constructor(private readonly omdbService: OmdbService) {}

  @Get('/:id')
  findMovieById(@Param('id') id: string): Promise<OmdbDto> {
    return this.omdbService.getMovieById(id);
  }

  @Get()
  findAllMovies(@Query() queryParameters: OmdbQueryParameters) {
    return this.omdbService.findAllMovies(queryParameters);
  }
}
