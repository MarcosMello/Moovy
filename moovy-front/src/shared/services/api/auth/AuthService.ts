import { Api } from '../axios-config';

interface IAuth {
    token: string;
    expiresIn: number;
}
const auth = async (username: string, password: string): Promise<IAuth | Error> => {
    try {
        const { data } = await Api.post('/login', { username: username, password: password });

        if (data) {
            return data;
        }

        return new Error('Login Error');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro no login.');
    }
};

export const AuthService = {
    auth,
};