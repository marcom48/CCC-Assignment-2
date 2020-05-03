import React, { useEffect, useRef, useState} from 'react'
import { Grid, Typography, Card } from '@material-ui/core';
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    heading1: {
        fontSize: theme.typography.pxToRem(25),
        fontWeight: theme.typography.fontWeightBold,
      },
    pad: {
        padding: theme.spacing(3),
    },
  }));


const Suburb = ({selected}) => {
    const classes = useStyles();
    const getAvg = (keys, sentiment) => {
        return keys.map(k => sentiment[k]["average"])
    }

    const getCounts = (keys, sentiment) => {
        return keys.map(k => sentiment[k]["count"])
    }

    const setBarData = selected => {
        const v = JSON.parse(selected.properties.sentiment);
        const bd = {
            labels: Object.keys(v),
            datasets: [{
                label: 'Avg Sentiment',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
                hoverBorderColor: 'rgba(255, 99, 132, 1)',
                data: getAvg(Object.keys(v),  v),
            }]
        }
        return bd
    }

    const setCircleData = selected => {
        const v = JSON.parse(selected.properties.sentiment);
        const cd = {
            labels: Object.keys(v),
            datasets: [{
                data: getCounts(Object.keys(v), v),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#5EF595',
                    '#1043D0',
                    '#FF5A40',
                    '#EF00FF',
                    '#050255',
                  ],
                  hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#5EF595',
                    '#1043D0',
                    '#FF5A40',
                    '#EF00FF',
                    '#050255',
                  ],
            }]
        }
        return cd
    }

    
    return (
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing={6}
            className={classes.pad}
            >
            <Grid item>
            <Typography align='center' className={classes.heading1}>{selected["properties"]["SA2_NAME16"]}</Typography>
            </Grid>
            <Grid item>
                <Typography align='center' className={classes.heading}>Monthly Sentiment Average</Typography>
                <Card>
                <Bar
                    data={() => setBarData(selected)}
                    width={400}
                    height={350}
                />
                </Card>
            </Grid>
            <Grid item>
                
            <Typography align='center' className={classes.heading}>Monthly Tweet Frequency</Typography>
                <Card>
                <Doughnut 
                    data={() => setCircleData(selected)}
                    width={400}
                    height={350}
                />
                </Card>
            </Grid>

        </Grid>
    )

}


export default Suburb;