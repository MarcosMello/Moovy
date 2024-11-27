import React from "react";
import {Stack, Typography} from "@mui/material";
import {Navbar} from "../components";

interface IBaseLayoutProps {
    title: string;
    children?: React.ReactNode | React.ReactNode[];
}
export const BaseLayout: React.FC<IBaseLayoutProps> = ({children, title}) => {
    return (
        <Stack flexDirection={"column"} width={"100%"} gap={5.25} sx={{overflowY: "auto", height: "100%"}}>
            <Navbar />

            <Typography variant={'h3'} fontWeight={400} fontSize={25}>
                {title}
            </Typography>

            {children}
        </Stack>
    );
};