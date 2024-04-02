// import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Volume from './Volume.tsx';
import About from './About.tsx';
import ErrorPage from './ErrorPage.tsx';
import Root from './Root.tsx';

/* const theme = createTheme({
  palette: {
    background: {
      default: '#fffaf0',
    },
  },
}); */

const router = createHashRouter(
  [
    {
      path: '/',
      element: <Root />,
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
        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    // <ThemeProvider theme={theme}>
      // <React.Fragment>
        // <CssBaseline />
        <RouterProvider router={router} />
      // </React.Fragment>
    // </ThemeProvider>
  // </React.StrictMode>
);
