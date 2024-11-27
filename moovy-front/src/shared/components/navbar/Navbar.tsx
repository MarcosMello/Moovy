import React from "react";
import {useMatch, useNavigate, useResolvedPath} from "react-router-dom";
import {AppBar, Icon, ListItem, ListItemIcon, ListItemText, Stack} from "@mui/material";
import {useNavbarContext} from "../../contexts";

interface IListItemLinkProps {
    to: string;
    icon: string;
    label: string;
    onClick: (() => void) | undefined;
}
const ListItemLink: React.FC<IListItemLinkProps> = ({ to, icon, label, onClick }) => {
    const navigate = useNavigate();

    const resolvedPath = useResolvedPath(to);
    const match = useMatch({ path: resolvedPath.pathname, end: false });

    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return (
        <ListItem sx={{ color: !!match ? "#F2911B" : "inherit" }} onClick={handleClick} disableGutters={true}>
            <ListItemIcon>
                <Icon sx={{ color: !!match ? "#F2911B" : "inherit" }}>{icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItem>
    );
};

interface INavbarProps {
    children?: React.ReactNode;
}
export const Navbar: React.FC<INavbarProps> = ({children}) => {
    const { navbarOptions } = useNavbarContext();

    return (
        <AppBar component={"nav"} color="transparent" elevation={0} position="relative" sx={{pt: 5.25}}>
            <Stack flexDirection={"row"} gap={10}>
                {navbarOptions.map(navbarOption => (
                    <ListItemLink
                        to={navbarOption.path}
                        key={navbarOption.path}
                        icon={navbarOption.icon}
                        label={navbarOption.label}
                        onClick={undefined}
                    />
                ))}

                {children}
            </Stack>
        </AppBar>
    );
};