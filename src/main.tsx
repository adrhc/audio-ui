import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import Volume from './Volume.tsx';
import ErrorPage from './ErrorPage.tsx';

const theme = createTheme({
  palette: {
    background: {
      default: '#fffaf0',
    },
  },
});

const router = createHashRouter([
  {
    path: '/',
    element: (
      <Container sx={{ pt: 1, pb: 1, height: '100%' }}>
        <Outlet />
      </Container>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'volume',
        element: <Volume />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
