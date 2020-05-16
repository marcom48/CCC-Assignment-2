import React from 'react';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { Link } from 'react-router-dom';
import MapIcon from '@material-ui/icons/Map';
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
            <IconButton component={Link} to='/stats' edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
              <EqualizerIcon />
            </IconButton>
            <IconButton component={Link} to='/' edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
              <MapIcon />
            </IconButton>
            </Toolbar>
        </AppBar>

    )
}