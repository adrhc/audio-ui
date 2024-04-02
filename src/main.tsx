import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
  palette: {
    background: {
      default: '#fffaf0',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <React.StrictMode>
      <BrowserRouter>
        <Container sx={{ pt: 1, pb: 1 }}>
          <App />
        </Container>
      </BrowserRouter>
    </React.StrictMode>
  </ThemeProvider>
);
