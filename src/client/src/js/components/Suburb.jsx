import React, { useEffect, useRef, useState} from 'react'
import { Grid } from '@material-ui/core';
import { Bar, Doughnut, Line } from 'react-chartjs-2'


const Suburb = ({selected}) => {

    const getAvg = (keys, sentiment) => {
        return keys.map(k => sentiment[k]["average"])
    }

    const setBarData = selected => {
        const bd = {
            labels: Object.keys(selected.properties.sentiment),
            datasets: [{
                label: 'Avg Sentiment',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
                hoverBorderColor: 'rgba(255, 99, 132, 1)',
                data: getAvg(Object.keys(selected.properties.sentiment),  selected.properties.sentiment),
            }]
        }
        console.log(Object.entries(selected.properties.sentiment))
        console.log(selected.properties.sentiment)
        return bd
    }

    
    return (
        <Grid container>
            <Grid item>
                <Bar
                    data={() => setBarData(selected)}
                    width={100}
                    height={85}
                />
            </Grid>

        </Grid>
    )

}


export default Suburb;