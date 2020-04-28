import React, { useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import {MAPBOX_KEY, MAPBOX_PUB_KEY} from '../constants/config'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as melb_geo from '../constants/melbourne.geojson'
import * as melb_points from '../constants/sampleTwitter.json'
import { Container } from '@material-ui/core'
import  { jsonGeoJson } from '../helpers/index'
import Sidebar from './Sidebar'

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
    const [sidebar, setSidebar] = useState(false);
    const [selected, setSelected] = useState(null);

    const points = jsonGeoJson(melb_points);


    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_PUB_KEY;
        const initializeMap = ({ setMap, mapContainer }) => {
          const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/shijiel2/cjvcb640p3oag1gjufck6jcio", 
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

            map.addSource('points', {
              'type': 'geojson',
              'data': points
            })

            map.addLayer({
              'id': 'suburb-border',
              'type': 'line',
              'source': 'suburbs',
              "paint": {
                "line-color": "#22B0C0",
                "line-width": 0.5,
                "line-opacity": 1
              }
            })

            map.addLayer({
              'id': 'suburb-fills',
              'type': 'fill',
              'source': 'suburbs',
              "paint": {
                'fill-color': "#00ffff",
                "fill-opacity": ["case",
                  ["boolean", ["feature-state", "hover"], false],
                  0.5,
                  0.2
                ]
              }
            });

            map.addLayer({
              id: 'test-heat',
              type: 'heatmap',
              source: 'points',
              maxzoom: 15,
              paint: {
                // increase weight as diameter breast height increases
                'heatmap-weight': 1,
                // increase intensity as zoom level increases
                'heatmap-intensity': {
                  stops: [
                    [11, 1],
                    [15, 3]
                  ]
                },
                // assign color values be applied to points depending on their density
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, "rgba(33,102,172,0)",
                  0.2, "rgb(103,169,207)",
                  0.4, "rgb(209,229,240)",
                  0.6, "rgb(253,219,199)",
                  0.8, "rgb(239,138,98)",
                  1, "rgb(178,24,43)"
                ],
                // increase radius as zoom increases
                'heatmap-radius': {
                  stops: [
                    [11, 15],
                    [15, 20]
                  ]
                },
                // decrease opacity to transition into the circle layer
                'heatmap-opacity': {
                  default: 1,
                  stops: [
                    [5, 0.5],
                    [14, 1],
                    [15, 0]
                  ]
                },
              }
            });

            map.addLayer({
              id: 'test-point',
              type: 'circle',
              source: 'points',
              minzoom: 14,
              paint: {
                // increase the radius of the circle as the zoom level and dbh value increases
                'circle-radius': 7,
                'circle-color': 'rgb(178,24,43)',
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                  stops: [
                    [14, 0],
                    [15, 1]
                  ]
                }
              }
            });
      
          });
        };
    
        if (!map) initializeMap({ setMap, mapContainer });
      }, [map]);

    return (
      <>
        <div ref={el => (mapContainer.current = el)} style={styles} />
        <Sidebar opened={sidebar} selected={selected}/>
      </>
    )
    
}

export default MapBox;