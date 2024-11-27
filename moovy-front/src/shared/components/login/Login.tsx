import React, { useState } from 'react';
import { useAuthContext } from '../../contexts';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import * as yup from 'yup';

const loginSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

interface ILoginProps {
    children: React.ReactNode;
}
export const Login: React.FC<ILoginProps> = ({ children }) => {
    const { isAuthenticated, login } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = () => {
        setIsLoading(true);

        loginSchema
            .validate({ username, password }, { abortEarly: false })
            .then(validatedData => {
                login(validatedData.username, validatedData.password)
                    .then(() => {
                        setIsLoading(false);
                    });
            })
            .catch((errors: yup.ValidationError) => {
                setIsLoading(false);
                errors.inner.forEach(error => {
                    if (error.path === 'email') {
                        setUsernameError(error.message);
                    } else if (error.path === 'password') {
                        setPasswordError(error.message);
                    }
                });
            });
    };

    if (isAuthenticated) return (
        <>{children}</>
    );

    return (
        <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>
            <Card>
                <CardContent>
                    <Box display='flex' flexDirection='column' gap={2} width={250}>
                        <Typography variant='h6' align='center'>Login</Typography>
                        <TextField
                            fullWidth
                            label='Username'
                            value={username}
                            disabled={isLoading}
                            error={!!usernameError}
                            helperText={usernameError}
                            onKeyDown={() => setUsernameError('')}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label='Password'
                            type='password'
                            value={password}
                            disabled={isLoading}
                            error={!!passwordError}
                            helperText={passwordError}
                            onKeyDown={() => setPasswordError('')}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Box width='100%' display='flex' justifyContent='center'>
                        <Button
                            variant='contained'
                            disabled={isLoading}
                            onClick={handleSubmit}
                            endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
                        >
                            Login
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
};