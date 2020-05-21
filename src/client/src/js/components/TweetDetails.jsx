/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserDetails from "./UserDetails";
import { requestDB } from "../helpers/index";
import { getUserHistory } from "../actions";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { TwitterTweetEmbed } from "react-twitter-embed";
import ReactStoreIndicator from "react-score-indicator";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  pad1: {
    padding: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(2),
  },
  heading1: {
    fontSize: theme.typography.pxToRem(25),
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(2),
  },
  pad2: {
    padding: theme.spacing(2),
  },
  spinner: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
    justifyContent: "center",
    alignItems: "center",
  },
}));

const TweetDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector((store) => store.MapReducer);
  const { selected } = state;
  const [loadingTweet, setLoadingTweet] = useState(true);
  const [loadingSentiment, setLoadingSentiment] = useState(true);
  const [renderUser, setRenderUser] = useState(false);
  const twitter = (
    <TwitterTweetEmbed
      tweetId={selected.properties.tweetId}
      options={{ width: 400 }}
    />
  );

  const loadUserData = async () => {
    let res = await requestDB(
      `users/${JSON.parse(selected.properties.user).id}`
    );
    const userData = res.data;
    return userData;
  };

  useEffect(() => {
    loadUserData().then((res) => dispatch(getUserHistory(res)));
  }, []);

  const loadTweet = () => {
    setTimeout(() => setLoadingTweet(false), 2000);
    return null;
  };
  const loadSentiment = () => {
    setTimeout(() => setLoadingSentiment(false), 3000);
    return null;
  };

  return (
    <div>
      {renderUser ? (
        <UserDetails />
      ) : (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={6}
          className={classes.pad2}
        >
          <Grid item className={classes.pad1}>
            <Typography align="center" className={classes.heading1}>
              Tweet Data
            </Typography>
            {loadingTweet ? (
              <div className={classes.spinner}>
                <CircularProgress />
              </div>
            ) : (
              <div>{twitter}</div>
            )}
            {loadTweet()}
          </Grid>
          <Grid item className={classes.pad1}>
            <Typography align="center" className={classes.heading}>
              Sentiment Score
            </Typography>

            {loadingSentiment ? (
              <div className={classes.spinner}>
                <CircularProgress />
              </div>
            ) : (
              <div>
                <ReactStoreIndicator
                  value={selected.properties.sentiment}
                  maxValue={10}
                  lineGap={3}
                />
              </div>
            )}
            {loadSentiment()}
          </Grid>
          <Grid item>
            {loadingSentiment ? null : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setRenderUser(true);
                }}
              >
                User Data
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default TweetDetails;
