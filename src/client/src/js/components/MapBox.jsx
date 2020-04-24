import React, { useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import {MAPBOX_KEY, MAPBOX_PUB_KEY} from '../constants/config'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as melb_geo from '../constants/melbourne.geojson'
import { Container } from '@material-ui/core'

const styles = {
  width: "100vw",
  height: "calc(100vh - 115px)",
  position: "absolute"
};

const MapBox = () => {
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(145.11);
    const [lat, setLat] = useState(-37.84);
    const [zoom, setZoom] = useState(8);
    const [map, setMap] = useState(null);


    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_PUB_KEY;
        const initializeMap = ({ setMap, mapContainer }) => {
          const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/kvoli/ck9dizunz0vf51io892dqx4gw", 
            center: [lng, lat],
            zoom: zoom
          });
    
          map.on("load", () => {
            setMap(map);
            map.resize();
            map.addSource('suburbs', {
              'type': 'geojson',
              'data': melb_geo
            })

            map.addLayer({
              'id': 'suburb-border',
              'type': 'line',
              'source': 'suburbs',
              "paint": {
                "line-color": "#8B4225",
                "line-width": 0.5,
                "line-opacity": 1
              }
            })

          });
        };
    
        if (!map) initializeMap({ setMap, mapContainer });
      }, [map]);

    return (
        <div ref={el => (mapContainer.current = el)} style={styles} />
      )
    
}

export default MapBox;