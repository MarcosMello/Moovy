import { UserDto } from '../users/user.dto';
import { IsInstance, IsOptional, IsString, IsUUID } from 'class-validator';

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
