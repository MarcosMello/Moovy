import React from "react";
import {
    Icon,
    ListItemButton, ListItemIcon, ListItemText,
    Stack,
    Typography
} from "@mui/material";
import { useAuthContext } from "../../contexts";

interface ISidebarProps {
    children?: React.ReactNode;
}
export const Sidebar: React.FC<ISidebarProps> = ({children}) => {
    const { logout } = useAuthContext();

    return (
        <Stack flexDirection={"column"} width={"min-content"} p={5.25} sx={{justifyContent: "space-between"}}>
            <Typography color="#F2911B" fontWeight={700} fontSize={30} display={"span"}>
                Moovy
            </Typography>

            <Stack flexDirection={"column"} width={"100%"}>
                { children }
            </Stack>

            <ListItemButton onClick={logout} sx={{width: "100%", maxHeight: "50px"}}>
                <ListItemIcon>
                    <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </Stack>
    );
};