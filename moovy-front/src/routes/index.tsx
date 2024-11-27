import { Navigate, Route, Routes } from "react-router-dom";
import {useNavbarContext} from "../shared/contexts";
import {useEffect} from "react";
import {Library, Search} from "../pages";

export const AppRoutes = () => {
    const { setNavbarOptions } = useNavbarContext();

    useEffect(() => {
        setNavbarOptions([
            {
                icon: 'search',
                path: '/search',
                label: 'Search',
            },
            {
                icon: 'bookmarks',
                path: '/library',
                label: 'My Library',
            }
        ])
    }, [setNavbarOptions]);

    return (
        <Routes>
            <Route path="/library" element={<Library />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/library" />} />
        </Routes>
    );
};
