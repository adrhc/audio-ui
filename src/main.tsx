import ReactDOM from 'react-dom/client';
import Dashboard from './pages/Dashboard.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import VolumePage from './pages/volume/VolumePage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import App from './App.tsx';
import TrackListPage from './pages/tracklist/TrackListPage.tsx';
import THEME from './config/theme.tsx';

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
        path: 'trackList',
        element: <TrackListPage />,
      },
      {
        path: 'volume',
        element: <VolumePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  // </React.StrictMode>
);
