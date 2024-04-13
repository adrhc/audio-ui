// import { createBreakpoints } from '@mui/system';

import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    desktop: true;
  }
}

// responsiveFontSizes from '@mui/material'
// import { createBreakpoints } from '@mui/system'
// const breakpoints = createBreakpoints({});
// console.log(`breakpoints.down('sm') = ${breakpoints.down('sm')}`);
// console.log(breakpoints);
const THEME = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 400,
      desktop: 1481,
    },
  },
  palette: {
    background: {
      default: '#fffaf0',
    },
  },
  /* typography: {
      fontSize: 16,
    }, */
  /* // NO EFFECT
    typography: {
      [breakpoints.down('sm')]: {
        fontSize: 28,
      },
      [breakpoints.up('sm')]: {
        fontSize: 16,
      },
    }, */
  /* components: {
      // IGNORED
      MuiCssBaseline: {
        styleOverrides: () => `
        ${breakpoints.down('sm')} {
          body {
            font-size: 28px !important;
          }
        }`,
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 'auto',
          },
          labelMedium: {
            fontSize: FONT_SIZE.default
          }
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: FONT_SIZE.default
          }
        }      
      },
      MuiSvgIcon: {
        styleOverrides: {
          fontSizeMedium: {
            fontSize: FONT_SIZE.icon,
          }
        }
      },
    }, */
});

// eslint-disable-next-line react-refresh/only-export-components
export default THEME;
