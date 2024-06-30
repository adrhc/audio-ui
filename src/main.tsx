import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import THEME from './styles/theme.ts';
import ROUTER from './router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ThemeProvider theme={THEME}>
    <CssBaseline />
    <RouterProvider router={ROUTER} />
  </ThemeProvider>
  // </React.StrictMode>
);
