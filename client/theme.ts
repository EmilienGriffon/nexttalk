import { createTheme } from '@mui/material/styles';

export const darkRedTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#357deaff',
      light: '#5ebdf8ff',
      dark: '#448bf7ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9aa0a6',
      light: '#bdc1c6',
      dark: '#80868b',
    },
    background: {
      default: '#1a1a1a',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#e8eaed',
      secondary: '#9aa0a6',
      disabled: '#5f6368',
    },
    divider: '#3c4043',
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 500,
    h1: {
      fontWeight: 400,
      fontFamily: '"Google Sans", sans-serif',
    },
    h2: {
      fontWeight: 400,
      fontFamily: '"Google Sans", sans-serif',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.0107em',
      fontFamily: '"Google Sans", sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Google Sans',
              fontStyle: 'normal',
              fontWeight: 400,
              src: 'local("Google Sans")',
            },
            {
              fontFamily: 'Google Sans',
              fontStyle: 'normal',
              fontWeight: 500,
              src: 'local("Google Sans Medium")',
            },
          ],
        },
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#48494b transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#48494b',
            borderRadius: '4px',
            '&:hover': {
              background: '#5f6368',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
          boxShadow: 'none',
          letterSpacing: '0.0107em',
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)',
          },
          '&.Mui-disabled': {
            backgroundColor: '#3c4043',
            color: '#5f6368',
          },
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#3b3f41',
            transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
            fontSize: '0.9375rem',
            fontWeight: 400,
            '& fieldset': {
              borderColor: '#3b3f41',
              borderWidth: '.1px',
            },
            '&:hover fieldset': {
              borderColor: '#9aa0a6',
            },
            '&.Mui-focused': {
              backgroundColor: '#1f1f1f',
              '& fieldset': {
                borderColor: '#93bbfd',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#e8eaed',
            padding: '14px 16px',
            '&::placeholder': {
              color: '#9aa0a6',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1f1f1f',
          border: '1px solid #3c4043',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
        },
        rounded: {
          borderRadius: 28,
        },
        elevation0: {
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(232, 234, 237, 0.08)',
          },
        },
      },
    },
  },
});