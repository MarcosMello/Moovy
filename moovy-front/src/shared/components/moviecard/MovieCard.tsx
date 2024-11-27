import React from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Icon, Stack, Typography} from "@mui/material";

export interface MovieCardProps {
    posterUrl: string;
    audioUrl?: string;
    title: string;
    imdbId: string;
    imdbRating: string;

    children?: never[];
}
export const MovieCard: React.FC<MovieCardProps> = ({posterUrl, audioUrl, title, imdbId, imdbRating}) => {
    return (
        <Card sx={{ maxWidth: 320, borderRadius: 2.5, p: 1 }}>
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
                        {imdbRating}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Button variant={"contained"} sx={{ width: "100%", backgroundColor:"#0ACF83" }}>
                    <Icon>bookmark</Icon>
                    Add to My Library
                </Button>
            </CardActions>
        </Card>
    );
};