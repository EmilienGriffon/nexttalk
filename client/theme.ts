import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'body': {
          "transition": "background-color 0.3s, color 0.3s",
        },
        '*': {
          "transition": "background-color 0.3s, color 0.3s",
        },
        ':root': {
          '--loginContainer-bg': '#1a1a1a', 
          '--loginContainer-title': '#a83493', 
          '--loginContainer-subtitle': '#ccc', 
          '--loginBox-bg': '#fff', 
          '--loginBox-border': '#595959', 

          '--border-color': '#2e3033', 

          '--inputContainer-bg': '#202124', 

          '--scrollbar-bg': '#626262ff', 
          '--scrollbar-hover-bg': '#649cf5', 

          '--msg-own-bg': '#649cf5', 
          '--msg-own-text': '#ffffff', 
          '--msg-other-bg': '#2e3033', 
          '--msg-other-text': '#fff', 
          '--msg-system-bg': '#323338ff', 
          '--msg-system-text': '#ccc', 
          '--msg-username-text': '#649cf5', 
          '--msg-time-text': '#ccc', 
          '--msg-typing-bg': '#649cf5', 
          '--msg-typing-text': '#fff',
          '--msg-typing-dots': '#fff',
          '--msg-typing-blockQuote-text': '#ddd',

          '--sidebar-bg': '#202124', 
          '--sidebar-title': '#fff', 
          '--sidebar-onlineCount-bg': '#543f46', 
          '--sidebar-onlineCount-text': '#fff', 
          '--sidebar-userItem-hover-bg': 'rgba(232, 234, 237, 0.08)', 
          '--sidebar-statusDot': "#34a853", 
          '--sidebar-username': '#fff', 
          '--sidebar-connectionStatus': '#ccc', 
          '--sidebar-status-connected': '#34a853', 
          '--sidebar-status-offline': '#ea4335', 

          '--chatContainer-bg': '#fff', 
          '--chatMain-bg': '#202124', 
          '--chatHeader-bg': '#202124', 


        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#357deaff',
      light: '#5ebdf8ff',
      dark: '#448bf7ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5f6368',
      light: '#9aa0a6',
      dark: '#3c4043',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
      disabled: '#9aa0a6',
    },
    divider: '#e0e0e0',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'body': {
          "transition": "background-color 0.3s, color 0.3s",
        },
        '*': {
          "transition": "background-color 0.3s, color 0.3s",
        },
        ':root': {
          '--loginContainer-bg': '#e5e5e5', 
          '--loginContainer-title': '#a83493', 
          '--loginContainer-subtitle': '#333333', 
          '--loginBox-bg': '#000000', 
          '--loginBox-border': '#a6a6a6', 

          '--border-color': '#d1cfcc', 

          '--inputContainer-bg': '#dfdedb', 

          '--scrollbar-bg': '#9d9d9d', 
          '--scrollbar-hover-bg': '#a1c5ff', 

          '--msg-own-bg': '#a1c5ff', 
          '--msg-own-text': '#000000', 
          '--msg-other-bg': '#d1cfcc', 
          '--msg-other-text': '#000000', 
          '--msg-system-bg': '#cdccc7', 
          '--msg-system-text': '#333333', 
          '--msg-username-text': '#a1c5ff', 
          '--msg-time-text': '#333333', 
          '--msg-typing-bg': '#d1cfcc', 
          '--msg-typing-text': '#000',
          '--msg-typing-dots': '#000',

          '--sidebar-bg': '#dfdedb', 
          '--sidebar-title': '#000', 
          '--sidebar-onlineCount-bg': '#abc0b9', 
          '--sidebar-onlineCount-text': '#000', 
          '--sidebar-userItem-hover-bg': 'rgba(232, 234, 237, 0.08)', 
          '--sidebar-statusDot': "#34a853", 
          '--sidebar-username': '#000', 
          '--sidebar-connectionStatus': '#333333', 
          '--sidebar-status-connected': '#34a853', 
          '--sidebar-status-offline': '#ea4335', 

          '--chatContainer-bg': '#000', 
          '--chatMain-bg': '#dfdedb', 
          '--chatHeader-bg': '#dfdedb', 
        },
      },
    },
  },
});
