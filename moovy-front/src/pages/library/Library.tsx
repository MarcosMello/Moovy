import React, {useEffect, useMemo, useState} from "react";
import { BaseLayout } from "../../shared/layout";
import {Pagination, Stack} from "@mui/material";
import { MovieCard } from "../../shared/components";
import {IMovieDto, IMovieResponseDto, MovieService} from "../../shared/services/api/movie/MovieService";
import {useSearchParams} from "react-router-dom";

interface ILibraryProps {
    children?: never[];
}
export const Library: React.FC<ILibraryProps> = () => {
    const [movies, setMovies] = useState<IMovieDto[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const handleDelete = (id: string) => {
        if (window.confirm('Do you really want to remove this movie from the library? ')) {
            MovieService.removeFromLibrary(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                        return;
                    }

                    setMovies(oldMovies => [
                        ...oldMovies.filter(oldMovie => oldMovie.id !== id),
                    ]);

                    alert('Movie removed from library!');
                }
            );
        }
    };

    const page = useMemo(() => {
        return Number(searchParams.get('page') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        MovieService.getAllLibraryMovies(page)
            .then((result: IMovieResponseDto | Error) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                    return;
                }

                setMovies(result.data);
                setTotalPages(result.totalPages);
                setTotalCount(result.totalResults);
            });
    }, [page]);

    return (
        <BaseLayout title="My Library">
            <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2} >
                {movies.map(movie => (
                    <MovieCard key={movie.imdbID} id={movie.id}
                               posterUrl={movie.poster}
                               title={movie.title}
                               imdbID={movie.imdbID}
                               imdbRating={movie.imdbRating}
                               audioUrl={movie.audioReviewURL}
                               isInLibrary={movie.isInLibrary}
                               handleDelete={handleDelete}
                    />
                ))}
            </Stack>

            <Pagination
                page={page}
                count={totalPages}
                onChange={(_, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
                sx={{display: "flex", justifyContent: "center", pb: 5.25}}
            />
        </BaseLayout>
    );
};