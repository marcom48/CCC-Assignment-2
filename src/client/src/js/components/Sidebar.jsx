import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { openStatsDrawer } from '../actions';
import { List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function Sidebar(opened, selected) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector(store => store.MapReducer);

  const toggleDrawer = (env) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    dispatch(openStatsDrawer(env));
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {state.selected ? state.selected.geometry.type === "Point" ? 
          <div>
            <ListItem>
              <ListItemText primary="Tweet Data"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Hashtags" secondary={state.selected.properties.hashtags} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Suburb" secondary={state.selected.properties.suburb} />
            </ListItem>
            <ListItem>
              <ListItemText primary="User" secondary={state.selected.properties.user} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Text" secondary={state.selected.properties.text} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Time Created" secondary={state.selected.properties.createdTime}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Sentiment" secondary={state.selected.properties.sentiment}/>
            </ListItem>
        </div>
        :
        <div>
          <ListItem >
            <ListItemText primary="Suburb" secondary={state.selected.properties.SA2_NAME16}/>
          </ListItem>
          <ListItem >
            <ListItemText primary="Area" secondary={state.selected.properties.SA3_NAME16}/>
          </ListItem>
          <ListItem >
            <ListItemText primary="Region" secondary={state.selected.properties.SA4_NAME16}/>
          </ListItem>
          <ListItem >
            <ListItemText primary="Sentiment" secondary={state.selected.properties.sentiment.toString()}/>
          </ListItem>
        </div> 

        : ""}
      </List>
    </div>
  );


  return (
    <div>
        <React.Fragment>
          <Drawer anchor={'right'} open={state.drawerOpen}  onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}