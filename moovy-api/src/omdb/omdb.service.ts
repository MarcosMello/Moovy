import { Injectable, NotFoundException} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  OmdbResponseDto,
  OmdbDto,
  OmdbQueryParameters,
  MovieSearchResponseDto,
  OmdbSearchDto,
} from './omdbDto';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { MoviesService } from "../movies/movies.service";
import { LoggedUserDto } from "../auth/auth.dto";
import {MoviesInLibraryDto} from "../movies/movie.dto";

@Injectable()
export class OmdbService {
  private readonly uri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly moviesService: MoviesService,
  ) {
    this.uri =
      'http://www.omdbapi.com/?apikey=' +
      this.configService.get<string>('OMDB_API_KEY');
  }

  async getMovieById(id: string, loggedUser: LoggedUserDto): Promise<OmdbDto> {
    const uri = this.uri + '&i=' + id;

    return this.httpService.axiosRef
      .get<OmdbResponseDto>(uri)
      .then((response) => response.data)
      .then((data) => plainToInstance(OmdbResponseDto, data))
      .then(async (instance) => {
          if (instance.Response !== 'True') throw new NotFoundException(instance.Error);

          const omdbMovie: OmdbDto = instance.toOmdbDto();

          omdbMovie.isInLibrary = await this.moviesService.isMovieInLibrary(omdbMovie.imdbID, loggedUser);

          return omdbMovie;
      });
  }

  async findAllMovies(
    queryParameters: OmdbQueryParameters, loggedUser: LoggedUserDto, limit: number = 10
  ): Promise<OmdbSearchDto> {
    let query: string = '';

    for (const [key, value] of Object.entries(queryParameters)) {
      query += `&${key}=${value}`;
    }

    const uri: string = encodeURI(this.uri + query);

    return this.httpService.axiosRef
      .get<MovieSearchResponseDto>(uri)
      .then((response) => response.data)
      .then((data) => plainToInstance(MovieSearchResponseDto, data))
      .then(async (instance) => {
        if (instance.Response == 'False')
          throw new NotFoundException(instance.Error);

        const totalResult = parseInt(instance.totalResults);

        const searchIds: string[] = instance.Search.map(movie => {
            return movie.imdbID;
        })

        const idsInLibrary: Map<string, MoviesInLibraryDto> = await this.moviesService.isMoviesInLibrary(searchIds, loggedUser);

          const omdbSearchDto: OmdbSearchDto = {
              page: 1,
              totalPages: Math.ceil(totalResult / limit),
              totalResults: totalResult,
              data: (instance.Search.map((movie): OmdbDto => {
                      return {
                          id: idsInLibrary.has(movie.imdbID) ? idsInLibrary.get(movie.imdbID).id : null,
                          title: movie.Title,
                          poster: movie.Poster,
                          imdbRating: idsInLibrary.has(movie.imdbID) ? idsInLibrary.get(movie.imdbID).imdbRating : null,
                          imdbID: movie.imdbID,
                          isInLibrary: idsInLibrary.has(movie.imdbID),
                      }
                })
              )
          };

        return omdbSearchDto;
      });
  }
}
