import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Volume from './Volume.tsx';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import About from './About.tsx';

const theme = createTheme({
  palette: {
    background: {
      default: '#fffaf0',
    },
  },
});

const router = createHashRouter(
  [
    {
      path: '/',
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
  { basename: import.meta.env.BASE_URL }
);

function fallbackRender({ error }: FallbackProps) {
  // https://www.npmjs.com/package/react-error-boundary
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  console.log('error:', error);
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ pt: 1, pb: 1 }}>
          <RouterProvider router={router} />
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
