import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import VolumePage from './VolumePage.tsx';
import ErrorPage from './ErrorPage.tsx';
import App from './App.tsx';
import { createBreakpoints } from '@mui/system';

// responsiveFontSizes from '@mui/material'
// import { createBreakpoints } from '@mui/system'
const breakpoints = createBreakpoints({});
// console.log(`breakpoints.down('sm') = ${breakpoints.down('sm')}`);
// console.log(breakpoints);
const theme = createTheme({
  palette: {
    background: {
      default: '#fffaf0',
    },
  },
  typography: {
    fontSize: 28,
  },
  /* // NO EFFECT
  typography: {
    [breakpoints.down('sm')]: {
      fontSize: 28,
    },
    [breakpoints.up('sm')]: {
      fontSize: 16,
    },
  }, */
  components: {
    /* MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: '2em',
          height: '2em',
        },
      },
    }, */
    /* // IGNORED
    MuiCssBaseline: {
      styleOverrides: () => `
      ${breakpoints.down('sm')} {
        body {
          font-size: 28px !important;
        }
      }`,
    }, */
    MuiChip: {
      styleOverrides: {
        root: {
          height: 'auto',
        },
      },
    },
  },
});

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'volume',
        element: <VolumePage />,
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
