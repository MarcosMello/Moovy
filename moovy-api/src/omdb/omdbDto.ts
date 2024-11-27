import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OmdbResponseDto {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [OmdbResponseDtoRatings];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error: string;

  public toOmdbDto(): OmdbDto {
    return {
      title: this.Title,
      poster: this.Poster,
      imdbRating: this.imdbRating,
      imdbID: this.imdbID,
      isInLibrary: false,
    };
  }
}

class OmdbResponseDtoRatings {
  Source: string;
  Value: string;
}

export enum OmdbMediaType {
  MOVIE = 'movie',
  SERIES = 'series',
  EPISODE = 'episode',
}

export enum OmdbReturnType {
  JSON = 'json',
  XML = 'xml',
}

export class OmdbQueryParameters {
  @IsString()
  s: string;

  @IsEnum(OmdbMediaType)
  @IsOptional()
  type: OmdbMediaType;

  @IsInt()
  @IsOptional()
  y: number;

  @IsEnum(OmdbReturnType)
  @IsOptional()
  r: OmdbReturnType;

  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  callback: string;

  @IsString()
  @IsOptional()
  v: string;
}

export class MovieSearchResponseDtoSearchField {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export class MovieSearchResponseDto {
  Search: [MovieSearchResponseDtoSearchField];
  totalResults: string;
  Response: string;
  Error: string;
}

export class OmdbSearchDto {
  data: OmdbDto[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export class OmdbDto {
  title: string;
  poster: string;
  imdbRating: string;
  imdbID: string;
  isInLibrary: boolean;
}
