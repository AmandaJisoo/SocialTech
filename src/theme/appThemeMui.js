import { createTheme } from "@mui/material/styles";

const appTheme = createTheme({
    palette: {
      primary: {
        main: "#F34343",
        dark: "#FFFFFF"
      },
      secondary: {
        main: "#151522"
      },
      primaryLight: {
        main: "#FFFFFF"
      },
      accent1: {
        main: "#FECE00"
      },
      fb_blue: {
        main: "#1877F2"
      },
      twitter_blue: {
        main: "#1DA1F2"
      },
      google_white: {
        main: "#FFFFFF"
      }
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        '@media (min-width:600px)': {
          fontSize: '3rem',
        },
        lineHeight: 1.5
      },
      h2: {
        fontSize: '1.5rem',
        '@media (min-width:600px)': {
          fontSize: '2rem',
        },
        lineHeight: 1.5
      },
      h3: {
        fontSize: '1.5rem',
        '@media (min-width:600px)': {
          fontSize: '2.5rem',
        },
        lineHeight: 1.5
      },
      h4: {
        fontSize: '1rem',
        '@media (min-width:600px)': {
          fontSize: '1.5rem',
        },
        lineHeight: 1.5
      }
    },
    BookmarkBorderOutlinedIcon: {
      '@media (max-width:200px)': {
        fontSize: '50px',
      },

    }
    // neutrals: {
    //     darkest: "#151522",
    //     darker: "#7E7E7E",
    //     dark: "#C4C4C4",
    //     light: "#EBEBEB",
    //     background: "FFFFFF"
    // }
  });
    
export default appTheme;