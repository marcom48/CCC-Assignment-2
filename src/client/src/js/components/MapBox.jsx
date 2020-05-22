/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_PUB_KEY } from '../constants/config'
import 'mapbox-gl/dist/mapbox-gl.css'
import Sidebar from './Sidebar'
import Axios from 'axios';
import './MapBox.css'

import * as melb_geo from '../constants/melbourne.geojson'
import * as melb_points from '../constants/melbourneTweets.geojson'
import { selectArea, selectPoint, setAreaData } from '../actions'
import { useSelector, useDispatch } from 'react-redux';
import { requestDB, combineSuburbData, extractTotalTweets } from '../helpers'

const styles = {
  width: "100vw",
  height: "calc(100vh - 115px)",
  position: "absolute"
};



const MapBox = () => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.MapReducer);
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(145.11);
  const [lat, setLat] = useState(-37.84);
  const [zoom, setZoom] = useState(8);
  const [legend, setLegend] = useState(true);
  const [map, setMap] = useState(null);

  const loadData = async (map) => {
    const reqs = [];
    reqs.push(Axios.get(melb_geo)); // local census suburb data
    reqs.push(requestDB('website_suburb/_all_docs?include_docs=true')); // sentiment suburb data
    reqs.push(Axios.get(melb_points)); // located tweets

    const res = await Axios.all(reqs);

    let suburbData = combineSuburbData(res[1].data.rows, res[0].data);
    let pointData = res[2].data;

    map.getSource('suburbs').setData(suburbData)
    map.getSource('points').setData(pointData)
    console.log(suburbData)
    dispatch(setAreaData(extractTotalTweets(res[1].data.rows)));
  }

  useEffect(() => {

    // console.log(requestDBStuff("located_tweets/_design/suburb_stats/_view/get_suburb_sentiment?group=true"))
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
          'data': null
        })

        map.addSource('points', {
          'type': 'geojson',
          'data': null
        })

        loadData(map)


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
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'LATEST_SENTIMENT'],
              0, '#F2F112',
              1, '#EED322',
              2, '#E6B71E',
              3, '#DA9C20',
              4, '#CA8323',
              5, '#B86B25',
              6, '#A25626',
              7, '#8B4225',
              8, '#723122',
              9, '#512015',
              10, '#000000'
            ],
            "fill-opacity": ["case",
              ["boolean", ["feature-state", "hover"], false],
              0.8,
              0.5
            ]
          }
        });

        map.addLayer({
          id: 'tweet-heat',
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
          id: 'tweet-points',
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

        map.on('click', function (e) {
          let f = map.queryRenderedFeatures(e.point, { layers: ['tweet-points'] })
          if (f.length) {
            onPointClick(f[0])
          } else {
            f = map.queryRenderedFeatures(e.point, { layers: ['suburb-fills'] })
            if (f.length) {
              onAreaClick(f[0])
            }
          }
        })

        map.on('zoom', function () {
            if (map.getZoom() >= 12) {
              setLegend(false);
            } else {
              setLegend(true);
            }
        })

        const onAreaClick = (e) => {
          dispatch(selectArea(e));
          map.flyTo({
            center: [e.properties.AVG_LNG, e.properties.AVG_LAT],
            zoom: 12,
            bearing: 0,
            speed: 0.4, // make the flying slow
            curve: 2.2, // change the speed at which it zooms out
          });
        }

        const onPointClick = (e) => {
          dispatch(selectPoint(e));
          map.flyTo({
            center: [e.geometry.coordinates[0], e.geometry.coordinates[1]],
            zoom: 16,
            bearing: 0,
            speed: 0.4, // make the flying slow
            curve: 2.2, // change the speed at which it zooms out
          });
        }

      });
      let hoveredStateId = null;

      map.on('mousemove', 'suburb-fills', function (e) {
        map.getCanvas().style.cursor = 'pointer'
        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState({
              source: 'suburbs',
              id: hoveredStateId
            }, {
              hover: false
            });
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState({
            source: 'suburbs',
            id: hoveredStateId
          }, {
            hover: true
          });
        }
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);




  return (
    <>
     <div className='legend' style={{'display': legend ? 'block' : 'none'}}>
          <h4>Suburb Tweet Sentiment</h4>
          <div><span style={{ backgroundColor: '#F2F12D' }}></span>0.0</div>
          <div><span style={{ backgroundColor: '#EED322' }}></span>1.0</div>
          <div><span style={{ backgroundColor: '#E6B71E' }}></span>2.0</div>
          <div><span style={{ backgroundColor: '#DA9C20' }}></span>3.0</div>
          <div><span style={{ backgroundColor: '#CA8323' }}></span>4.0</div>
          <div><span style={{ backgroundColor: '#B86B25' }}></span>5.0</div>
          <div><span style={{ backgroundColor: '#A25626' }}></span>6.0</div>
          <div><span style={{ backgroundColor: '#8B4225' }}></span>7.0</div>
          <div><span style={{ backgroundColor: '#723122' }}></span>8.0</div>
          <div><span style={{ backgroundColor: '#512015' }}></span>9.0</div>
          <div><span style={{ backgroundColor: '#000000' }}></span>10.0</div>
        </div>
      <div ref={el => (mapContainer.current = el)} style={styles} />
      <Sidebar />
    </>
  )
}
export default MapBox;