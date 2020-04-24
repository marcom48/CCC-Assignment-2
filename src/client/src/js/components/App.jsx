import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import NavBar from './NavBar';
import Footer from './Footer';
import Main from './Main';

const THEME = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'column',
    minHeight: '100vh',
    display: 'flex',
  },
  main: {
    marginBottom: theme.spacing(4),
  },
  footer: {
    padding: theme.spacing(4),
    marginTop: 'auto',
  },
  header: {
    maxHeight: '100px',
  },
  phantom: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={THEME}>
        <CssBaseline />
        <NavBar />
        <Main className={classes.main} />
        <div className={classes.phantom} />
        <Footer className={classes.footer} />
      </MuiThemeProvider>
    </div>
  );
};

export default App;