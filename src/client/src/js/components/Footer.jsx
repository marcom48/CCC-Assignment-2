
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Copyright from './Copyright';

function Footer() {
  return (
    <footer>
      <Typography variant='subtitle1' align='center' color='textSecondary' component='p'>
        kvoli - bjschuurman - cam-wong - marcom48 - SamMei323
      </Typography>
      <Copyright />
    </footer>
  );
}

export default Footer;