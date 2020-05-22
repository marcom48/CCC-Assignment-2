/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import React from "react";
import { FourOFourImage } from "../../SVG/SVGImages";
import { Grid, Container, List, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  image: {
    maxHeight: "350px",
    maxWidth: "initial",
    overflow: "hidden",
    textIndent: "30%",
    margin: theme.spacing(3),
  },
  body: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
  },
}));

const FoF = () => {
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.body}
        >
          <Grid item>
            <img src={FourOFourImage} alt="404" className={classes.image}></img>
          </Grid>
          <Grid item>
            <List>
              <ListItem>
                <Typography variant="h3">This is Awkward!</Typography>
              </ListItem>
              <ListItem>
                <Typography variant="h6" color="textSecondary">
                  It looks like the page you are looking for doesn't exist.
                </Typography>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default FoF;
