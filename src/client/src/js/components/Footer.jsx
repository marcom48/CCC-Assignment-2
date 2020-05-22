/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import React from "react";
import Typography from "@material-ui/core/Typography";
import Copyright from "./Copyright";

function Footer() {
  return (
    <footer>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        kvoli - cam-wong - marcom48 - SamMei323
      </Typography>
      <Copyright />
    </footer>
  );
}

export default Footer;
