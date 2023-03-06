import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';
import HomePage from './scenes/homepage';
import LoginPage from './scenes/loginpage';
import ProfilePage from './scenes/profilepage';
import { useMemo } from 'react';
import {userSelector} from 'react-redux';
import { CssBaseLine, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import { themeSettings } from './theme.';



function App() {
  const mode = userSelector((state) => state.mode);
  const theme = userMemo(() => createTheme(themeSettings(mode)), [mode]);


  return (
    <div className="App">
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseLine /> 
      <Routes>
        <Route path = "/" element={<LoginPage />} />
        <Route path = "/home" element={<HomePage />} />
        <Route path = "/profile/:userId" element={<ProfilePage />} />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
