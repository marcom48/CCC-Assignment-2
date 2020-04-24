import React from 'react';
import MapBox from './MapBox';
import { Switch, Route } from 'react-router-dom';
import FoF from './FoF';


const Main = () => {
    return (
        <main>
            <Switch>
                <Route exact path ='/' component={MapBox} />
                <Route component={FoF} />
            </Switch>
        </main>
    )
}


export default Main;