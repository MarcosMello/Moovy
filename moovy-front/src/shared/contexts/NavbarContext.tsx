import React, {createContext, useCallback, useContext, useState} from "react";

interface INavbarOption {
    icon: string;
    path: string;
    label: string;
}
interface INavbarContextData {
    navbarOptions: INavbarOption[];
    setNavbarOptions: (newDrawerOptions: INavbarOption[]) => void;
}

const NavbarContext = createContext({} as INavbarContextData);

export const useNavbarContext = () => {
    return useContext(NavbarContext);
};

interface INavbarProviderProps {
    children: React.ReactNode;
}
export const NavbarProvider: React.FC<INavbarProviderProps> = ({ children }) => {
    const [navbarOptions, setNavbarOptions] = useState<INavbarOption[]>([]);

    const handleSetNavbarOptions = useCallback((newNavbarOptions: INavbarOption[]) => {
        setNavbarOptions(newNavbarOptions);
    }, []);

    return (
        <NavbarContext.Provider value={{ navbarOptions, setNavbarOptions: handleSetNavbarOptions }}>
            {children}
        </NavbarContext.Provider>
    );
};