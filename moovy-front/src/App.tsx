import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Stack, ThemeProvider } from "@mui/material";
import { LightTheme } from "./shared/themes";
import { Login, Sidebar } from "./shared/components";
import { AuthProvider, NavbarProvider } from "./shared/contexts";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={LightTheme}>
                <Login>
                    <NavbarProvider>
                        <BrowserRouter>
                            <Stack direction="row" spacing={10} width={"100%"} sx = {{height: "100vh"}}>
                                <Sidebar />
                                <AppRoutes />
                            </Stack>
                        </BrowserRouter>
                    </NavbarProvider>
                </Login>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
