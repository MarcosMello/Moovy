import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Icon, Stack, Typography} from "@mui/material";
import {IMovieDto, MovieService} from "../../services/api/movie/MovieService";
import {IOmdbDto, OmdbService} from "../../services/api/omdb/OmdbService";
import {Howl} from 'howler';

export interface MovieCardProps {
    id: string;
    posterUrl: string;
    audioUrl?: string;
    title: string;
    imdbID: string;
    imdbRating?: string;
    isInLibrary?: boolean;

    handleDelete: (id: string) => void;
    handleCreate?: (movieDto: Omit<IMovieDto, 'id'>) => Promise<IMovieDto | undefined>;

    children?: never[];
}

export const MovieCard: React.FC<MovieCardProps> = ({id,
                                                    posterUrl,
                                                    audioUrl,
                                                    title,
                                                    imdbID,
                                                    imdbRating,
                                                    isInLibrary,
                                                    handleDelete,
                                                    handleCreate }) => {
    const [imdbRatingState, setImdbRatingState] = useState(imdbRating);
    const [isInLibraryState, setIsInLibraryState] = useState(isInLibrary);
    const [idState, setIdState] = useState(id);

    useEffect(() => {
        if (!audioUrl) {
            return;
        }

        MovieService.getUploadedAudio(idState).then((result: string | Error) => {
            if (result instanceof Error) {
                alert(result.message);
                return;
            }

            audioRef.current = new Howl({
                src: result,
                html5: true,
                preload: true,
                onpause: () => {
                    pauseAudio();
                },
                onend: () => {
                    setActiveAudio(false);
                },
            })
        });
    }, [audioUrl, idState]);

    const audioRef: MutableRefObject<Howl | null> = useRef(null);
    const [isAudioActive, setActiveAudio] = useState(false);

    const playAudio = () => {
        setActiveAudio(true);
        audioRef.current?.play();
    };

    const pauseAudio = () => {
        setActiveAudio(false);
        audioRef.current?.pause();
    };

    useEffect(() => {
        if (!!imdbRatingState){
            return;
        }

        OmdbService.getMovieById(imdbID).then((result: IOmdbDto | Error) => {
                if (result instanceof Error) {
                    alert(result.message);
                    return;
                }

                setImdbRatingState(result.imdbRating);
            }
        );
    }, [imdbID, imdbRatingState]);

    return (
        <Card sx={{ width: 320, borderRadius: 2.5, p: 1, display: "flex", flexDirection: "column" }}>
            <CardMedia
                sx={{ height: 400, borderRadius: 1.5 }}
                image={posterUrl}
                title={title}
            />
            <CardContent>
                <Stack flexDirection={"row"}>
                    <Typography component="div" align={"left"} fontWeight={400} fontSize={24} width={"75%"}>
                        {title}
                    </Typography>
                    <Typography component="div" align={"right"} fontWeight={400} fontSize={24} width={"25%"}>
                        <Icon sx={{color: "#FCC419", pr: 1}}>star</Icon>
                        {imdbRatingState}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions sx={{mt: "auto", display: "flex", flexDirection: "column", gap: 1}}>
                {audioUrl &&
                    <Button variant={"contained"} sx={{width: "100%", height: "50px"}}
                            onClick={!isAudioActive ? playAudio : pauseAudio}>
                        <Icon>{!isAudioActive ? "play_circle" : "pause_circle"}</Icon>
                        {!isAudioActive ? "Play" : "Pause"}
                    </Button>
                }

                <Button variant={"contained"} sx={{ width: "100%", height: "50px", backgroundColor: `${!isInLibraryState ? "#0ACF83" : "#FE6D8E"}`, ml: "0px !important" }} disabled={!imdbRatingState} onClick={() => {
                    if (isInLibraryState) {
                        handleDelete(idState ?? "");

                        id = '';
                        setIdState(id);

                        isInLibrary = false;
                        setIsInLibraryState(isInLibrary);
                        return;
                    }

                    if (!handleCreate) {
                        return;
                    }

                    handleCreate({
                        title: title,
                        poster: posterUrl,
                        imdbRating: imdbRating ?? imdbRatingState,
                        imdbID: imdbID,
                        audioReviewURL: audioUrl,
                        isInLibrary: isInLibrary,
                    }).then((result) => {
                        if (!result) {
                            return;
                        }

                        id = result.id;
                        setIdState(id);

                        isInLibrary = result.isInLibrary;
                        setIsInLibraryState(result.isInLibrary);
                    });
                }}>
                    <Icon>{!isInLibraryState ? "bookmark" : "delete"}</Icon>
                    {!isInLibraryState ? "Add to My Library" : "Remove from Library"}
                </Button>
            </CardActions>
        </Card>
    );
};