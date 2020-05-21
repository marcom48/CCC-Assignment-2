/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import React from "react";
import { useSelector } from "react-redux";
import { Grid, Typography, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Bar } from "react-chartjs-2";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import ReactStoreIndicator from "react-score-indicator";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  pad1: {
    padding: theme.spacing(2),
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

const UserDetails = () => {
  const classes = useStyles();
  const state = useSelector((store) => store.MapReducer);
  const { userData } = state;
  const getSentiment = (userData) => {
    let output = {};
    Object.keys(userData).forEach((key) => {
      if (userData[key] instanceof Object) {
        output[key] = userData[key];
      }
    });
    return output;
  };
  const sentiment = getSentiment(userData);
  const getAvg = (keys, sentiment) => {
    return keys.map((k) => sentiment[k]["average"]);
  };
  const setBarData = (v) => {
    const bd = {
      labels: Object.keys(v),
      datasets: [
        {
          label: "Avg Sentiment",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
          hoverBorderColor: "rgba(255, 99, 132, 1)",
          data: getAvg(Object.keys(v), v),
        },
      ],
    };
    return bd;
  };

  return (
    <div>
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
            User Data
          </Typography>
          <Card>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName={userData.screenName}
              options={{ width: 400, height: 400 }}
            />
          </Card>
        </Grid>
        <Grid item>
          <Typography align="center" className={classes.heading}>
            Monthly Sentiment Average
          </Typography>
          <Card>
            <Bar
              data={() => setBarData(sentiment)}
              width={400}
              height={350}
              options={{ scales: { yAxes: [{ stacked: true }] } }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserDetails;
