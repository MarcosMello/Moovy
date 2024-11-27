import {alpha, Icon, InputBase, styled} from "@mui/material";
import React from "react";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(5.25),
    marginLeft: 0,
    width: '80%'
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
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '80%',
    },
}));

interface SearchBarProps {
    onTextChange: (text: string) => void;

    children?: never[],
}
export const SearchBar: React.FC<SearchBarProps> = ({onTextChange}) => {
    return (
        <Search>
            <SearchIconWrapper>
                <Icon>search</Icon>
            </SearchIconWrapper>

            <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => onTextChange?.(e.target.value)}
            />
        </Search>
    );
}