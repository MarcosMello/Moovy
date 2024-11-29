import {Api} from "../axios-config";

export interface IMovieDto {
    id: string;
    title: string;
    poster: string;
    imdbRating?: string;
    imdbID: string;
    audioReviewURL?: string;
    isInLibrary?: boolean;
}

export interface IMovieResponseDto {
    data: IMovieDto[];
    page: number;
    totalPages: number;
    totalResults: number;
}

const getAllLibraryMovies = async (page: number = 1): Promise<IMovieResponseDto | Error> => {
    try {
        const { data } = await Api.get(`/movies?page=${page}`);

        if (data) {
            return data as IMovieResponseDto;
        }

        return new Error('Error encountered while loading library.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while loading library.');
    }
}

const create = async (movieDto: Omit<IMovieDto, 'id'>): Promise<IMovieDto | Error> => {
    try {
        const { data } = await Api.post("/movies", movieDto);

        if (data) {
            return data as IMovieDto;
        }

        return new Error('Error encountered while saving to the library.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while saving to the library.');
    }
}

const update = async (movieDto: IMovieDto) => {
    try {
        const { data } = await Api.put(`/movies/${movieDto.id}`, movieDto);

        if (data) {
            return data as IMovieResponseDto;
        }

        return new Error('Error encountered while updating movie.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while updating movie');
    }
}

const removeFromLibrary = async (id: string): Promise<void | Error> => {
    try {
        await Api.delete(`/movies/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while removing from the library.');
    }
}

const getUploadedAudio = async (id: string): Promise<string | Error> => {
    try {
        const { data } = await Api.get(`/movies/${id}`, {responseType: "blob"});

        if (!data) {
            return new Error('Error encountered while loading library.');
        }

        return URL.createObjectURL(data);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error encountered while loading library.');
    }
}

export const MovieService = {
    getAllLibraryMovies,
    create,
    update,
    removeFromLibrary,
    getUploadedAudio,
}