import React from "react";
import {BaseLayout} from "../../shared/layout";
import {alpha, InputBase, Stack, styled} from "@mui/material";
import {MovieCard, MovieCardProps} from "../../shared/components";
import SearchIcon from '@mui/icons-material/Search';

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

const SearchField = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginLeft: "auto",
    marginRight: theme.spacing(5.25),
    width: '40%',
    [theme.breakpoints.up('sm')]: {
        width: '40%',
        '&:focus': {
            width: '40%',
        },
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    marginLeft: "auto",
    marginRight: theme.spacing(5.25),
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '40%',
            '&:focus': {
                width: '40%',
            },
        },
    },
}));

interface ISearchProps {
    children?: never[];
}
export const Search: React.FC<ISearchProps> = () => {
    return (
        <BaseLayout title="Search">
            <SearchField>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </SearchField>

            <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2} paddingBottom={5.25}>
                {movies.map(movie => (
                    <MovieCard posterUrl={movie.posterUrl} title={movie.title} imdbId={movie.imdbId} imdbRating={movie.imdbRating} />
                ))}
            </Stack>
        </BaseLayout>
    );
};