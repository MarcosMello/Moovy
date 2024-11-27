import { UserDto } from '../users/user.dto';
import {IsBoolean, IsInstance, IsInt, IsOptional, IsString, IsUUID, Min} from 'class-validator';

export class MovieQueryParametersDto{
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;
}

export class MovieDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsInstance(UserDto)
  user?: UserDto;

  @IsString()
  title: string;

  @IsString()
  poster: string;

  @IsString()
  imdbRating: string;

  @IsString()
  imdbID: string;

  @IsOptional()
  @IsString()
  audioReviewURL: string;

  @IsOptional()
  @IsBoolean()
  isInLibrary: boolean;
}

export class MovieRouteParameters {
  @IsUUID()
  id: string;
}

export class MovieResponseDto {
  data: MovieDto[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export class MoviesInLibraryDto {
  id: string;
  imdbRating: string;
}
