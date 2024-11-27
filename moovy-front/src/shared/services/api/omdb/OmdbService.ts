import {Api} from "../axios-config";

export interface IOmdbDto{
    id: string;
    title: string;
    poster: string;
    imdbRating: string;
    imdbID: string;
    isInLibrary: boolean;
}

export interface IOmdbSearchDto {
    data: IOmdbDto[];
    page: number;
    totalPages: number;
    totalResults: number;
}

const getMovieById = async (id: string): Promise<IOmdbDto | Error> => {
    try {
        const { data } = await Api.get(`/omdb/${id}`);

        if (data) {
            return data as IOmdbDto;
        }

        return new Error('Error encountered while searching movies.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while searching movies.');
    }
}

const findAllMoviesWhere = async (titleSearch: string, page: number = 1): Promise<IOmdbSearchDto | Error> => {
    try {
        const { data } = await Api.get(`/omdb?page=${page}&s=${titleSearch}`);

        if (data) {
            return data as IOmdbSearchDto;
        }

        return new Error('Error encountered while searching movies.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while searching movies.');
    }
}

export const OmdbService = {
    getMovieById,
    findAllMoviesWhere,
}