import React, { useEffect, useMemo, useState } from "react";
import { BaseLayout } from "../../shared/layout";
import { IOmdbDto, IOmdbSearchDto, OmdbService} from "../../shared/services/api/omdb/OmdbService";
import { useSearchParams } from "react-router-dom";
import { IMovieDto, MovieService} from "../../shared/services/api/movie/MovieService";
import {MovieCard, SearchBar} from "../../shared/components";
import { Pagination, Stack } from "@mui/material";
import { useDebounce } from "../../shared/hooks";

interface ISearchProps {
    children?: never[];
}
export const Search: React.FC<ISearchProps> = () => {
    const [omdbMovies, setOmdbMovies] = useState<IOmdbDto[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce(0);

    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const handleDelete = (id: string) => {
        if (window.confirm('Do you really want to remove this movie from the library? ')) {
            MovieService.removeFromLibrary(id).then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                    return;
                }

                alert('Movie removed from library!');
            });
        }
    };

    const handleCreate = async (movieDto: Omit<IMovieDto, 'id'>): Promise<IMovieDto | undefined> => {
        const result = await MovieService.create(movieDto);
        if (result instanceof Error) {
            alert(result.message);
            return undefined;
        }

        alert('Movie added on your library.');
        return result;
    };

    const titleSearch = useMemo(() => {
        return searchParams.get('s') || '';
    }, [searchParams]);

    const page = useMemo(() => {
        return Number(searchParams.get('page') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            if (titleSearch.length < 3) {
                return;
            }

            OmdbService.findAllMoviesWhere(titleSearch, page)
                .then((result: IOmdbSearchDto | Error) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        return;
                    }

                    setOmdbMovies(result.data);
                    setTotalPages(result.totalPages);
                    setTotalCount(result.totalResults);
                }
            );
        })
    }, [titleSearch, page, debounce]);

    return (
        <BaseLayout title="Search">
            <SearchBar onTextChange={text => setSearchParams({ s: text, page: '1' }, { replace: true })}/>

            <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2} >
                {omdbMovies.map(movie => (
                    <MovieCard key={movie.imdbID} id={movie.id}
                               posterUrl={movie.poster}
                               title={movie.title}
                               imdbID={movie.imdbID}
                               imdbRating={movie.imdbRating}
                               isInLibrary={movie.isInLibrary}
                               handleDelete={handleDelete}
                               handleCreate={handleCreate}
                    />
                ))}
            </Stack>

            <Pagination
                page={page}
                count={totalPages}
                onChange={(_, newPage) => setSearchParams({ s: titleSearch, page: newPage.toString() }, { replace: true })}
                sx={{display: "flex", justifyContent: "center", pb: 5.25}}
            />
        </BaseLayout>
    );
};