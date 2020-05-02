import {DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_URL} from '../constants/config'
import axios from 'axios'

export const jsonGeoJson = json => {

    let res = {}
    let features = []
    let cur = {}
    res["type"] = "FeatureCollection"
    json["default"]["rows"].forEach(element => {
        if (element["doc"]["location"] != null) {
            cur["type"] = "Feature"
            cur["properties"] = {
                "harvestTime": element["doc"]["harvestTime"],
                "_id": element["_id"],
                "harvestNode": element["doc"]["harvestNode"],
                "createdTime": element["doc"]["created_at"],
                "user": element["doc"]["user"],
                "hashtags": element["doc"]["hashtags"],
                "suburb": element["doc"]["location"]["suburb"],
                "text": element["doc"]["text"],
                "sentiment": element["doc"]["sentiment"],
            }
            cur["geometry"] = {
                "type": "Point",
                "coordinates": [element["doc"]["location"]["longitude"], element["doc"]["location"]["latitude"]]
            }
            features.push(cur)
            cur = {}
        }
    });

    res["features"] = features
    
    return res

}


export function requestDB(request) {
    console.log(DATABASE_PASSWORD, DATABASE_USERNAME )
    return axios.get(DATABASE_URL + request, {
      auth : {
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
      },
      crossdomain: true,
    })
  }

export async function asyncRequestDB(request) {
    let res = await axios.get(DATABASE_URL + request, {
      auth : {
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
      },
      crossdomain: true,
    }).catch(err => {
        console.log(err)
            return null
        })
    return res;
  }

export const combineSuburbData = (r, suburbs) => {
    const res  = {}
    r.forEach(e => {
      var id = e["id"]
      var sentiment = {}
      Object.keys(e["doc"]).forEach(k => {
        if (k[0] !== '_') {
          sentiment[k] = e["doc"][k]
        } 
      })

      res[id] = sentiment
    })

    for (var i=0; i < suburbs.features.length; i++) {
        var suburb_name = suburbs["features"][i]["properties"]["SA2_NAME16"]
        suburbs["features"][i]["properties"]["sentiment"] = res[suburb_name]
    }
    return suburbs
  }