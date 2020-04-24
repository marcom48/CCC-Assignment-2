import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles(theme => ({
    navBar: {
      flexGrow: 1,
      background: '#3e4360',
      position: 'relative',
      maxHeight: '63px',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function NavBar() {
    const classes = useStyles();
    return (
        <AppBar position='static' className={classes.navBar}>
            <Toolbar>
             <Typography variant='h5' className={classes.title}>
                Cluster and Cloud Computing Project 2
            </Typography>
            </Toolbar>
        </AppBar>

    )
}