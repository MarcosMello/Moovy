import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import { AuthService } from '../services/api/auth/AuthService';
import {Api} from "../services/api/axios-config";

interface IAuthContextData {
    logout: () => void;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<string | void>;
}

interface IAuthAccessToken {
    token: string;
    expiresIn: number;
}

const AuthContext = createContext({} as IAuthContextData);
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

interface IAuthProviderProps {
    children: React.ReactNode;
}
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<IAuthAccessToken>();

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);

        console.log(accessToken);

        if (accessToken) {
            setAccessToken(JSON.parse(accessToken));
            return;
        }

        setAccessToken(undefined);
    }, []);

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await AuthService.auth(email, password);

        if (result instanceof Error) {
            return result.message;
        }

        localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify({
            token: result.token,
            expiresIn: Date.now() + result.expiresIn,
        }));

        setAccessToken({
            token: result.token,
            expiresIn: Date.now() + result.expiresIn,
        });

        Api.defaults.headers.common.Authorization = 'Bearer ' + result.token;
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
        setAccessToken(undefined);
    }, []);

    const isAuthenticated = useMemo(() => {
        if (!!accessToken && accessToken.expiresIn > Date.now()){
            return true;
        }

        handleLogout()
        return false;
    }, [accessToken, handleLogout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);