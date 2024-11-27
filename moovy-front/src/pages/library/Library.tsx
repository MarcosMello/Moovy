import React from "react";
import {BaseLayout} from "../../shared/layout";
import {Stack} from "@mui/material";
import {MovieCard, MovieCardProps} from "../../shared/components";

const movies: MovieCardProps[] = [
    {
        posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_SX300.jpg",
        title: "Everything Everywhere All At Once",
        imdbId: "tt6710474",
        imdbRating: "7.8",
    },
    {
        posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_SX300.jpg",
        title: "Everything Everywhere All At Once",
        imdbId: "tt6710474",
        imdbRating: "7.8",
    },
    {
        posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_SX300.jpg",
        title: "Everything Everywhere All At Once",
        imdbId: "tt6710474",
        imdbRating: "7.8",
    },
    {
        posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_SX300.jpg",
        title: "Everything Everywhere All At Once",
        imdbId: "tt6710474",
        imdbRating: "7.8",
    },
    {
        posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_SX300.jpg",
        title: "Everything Everywhere All At Once",
        imdbId: "tt6710474",
        imdbRating: "7.8",
    }
];

interface ILibraryProps {
    children?: never[];
}
export const Library: React.FC<ILibraryProps> = () => {
    return (
        <BaseLayout title="My Library">
            <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2} paddingBottom={5.25}>
                {movies.map(movie => (
                    <MovieCard posterUrl={movie.posterUrl} title={movie.title} imdbId={movie.imdbId} imdbRating={movie.imdbRating} />
                ))}
            </Stack>
        </BaseLayout>
    );
};