import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'aos/dist/aos.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { CookiesProvider } from 'react-cookie';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <CssBaseline />
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </SnackbarProvider>
  </BrowserRouter>,
);
