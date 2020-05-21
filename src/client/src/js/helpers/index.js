/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_URL,
} from "../constants/config";
import axios from "axios";

export const jsonGeoJson = (json) => {
  let res = {};
  let features = [];
  let cur = {};
  res["type"] = "FeatureCollection";
  json["default"]["rows"].forEach((element) => {
    if (element["doc"]["location"] != null) {
      cur["type"] = "Feature";
      cur["properties"] = {
        harvestTime: element["doc"]["harvestTime"],
        _id: element["_id"],
        harvestNode: element["doc"]["harvestNode"],
        createdTime: element["doc"]["created_at"],
        user: JSON.parse(element["doc"]["user"]),
        hashtags: element["doc"]["hashtags"],
        suburb: element["doc"]["location"]["suburb"],
        text: element["doc"]["text"],
        sentiment: element["doc"]["sentiment"],
      };
      cur["geometry"] = {
        type: "Point",
        coordinates: [
          element["doc"]["location"]["longitude"],
          element["doc"]["location"]["latitude"],
        ],
      };
      features.push(cur);
      cur = {};
    }
  });

  res["features"] = features;

  return res;
};

export function requestDB(request) {
  return axios.get(DATABASE_URL + request, {
    auth: {
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
    },
    crossdomain: true,
  });
}

export async function asyncRequestDB(request) {
  let res = await axios
    .get(DATABASE_URL + request, {
      auth: {
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
      },
      crossdomain: true,
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  return res;
}

const getLSentiment = (sentimentData) => {
  let latestMonth = Object.keys(sentimentData).sort().reverse()[0];
  return sentimentData[latestMonth]["average"];
};

export const combineSuburbData = (r, suburbs) => {
  const res = {};
  const latestSentiment = {};
  r.forEach((e) => {
    var id = e["id"];
    var sentiment = {};
    Object.keys(e["doc"]).forEach((k) => {
      if (k[0] !== "_") {
        sentiment[k] = e["doc"][k];
      }
    });
    latestSentiment[id] = getLSentiment(sentiment);
    res[id] = sentiment;
  });

  for (var i = 0; i < suburbs.features.length; i++) {
    var suburb_name = suburbs["features"][i]["properties"]["SA2_NAME16"];
    suburbs["features"][i]["properties"]["sentiment"] = res[suburb_name];
    suburbs["features"][i]["properties"]["LATEST_SENTIMENT"] =
      latestSentiment[suburb_name];
  }
  return suburbs;
};

export const extractTotalTweets = (data) => {
  const res = [];
  const pre = ["2018", "2019"];
  data.forEach((e) => {
    var id = e["id"];
    var count = 0;
    var pre_covid = 0.0;
    var pre_count = 0;
    var post_covid = 0.0;
    var post_count = 0;
    var pre_seen = 0;
    var post_seen = 0;
    var cur = { suburb: id };
    Object.keys(e["doc"]).forEach((k) => {
      if (k[0] != "_") {
        count += e["doc"][k]["count"];
        if (k.match(pre[0]) || k.match(pre[1])) {
          pre_covid += e["doc"][k]["average"];
          pre_count += e["doc"][k]["count"];
          pre_seen += 1;
        } else {
          post_covid += e["doc"][k]["average"];
          post_count += e["doc"][k]["count"];
          post_seen += 1;
        }
      }
    });

    if (post_covid == 0) {
      console.log(id, post_count, post_seen);
    }

    if (pre_covid == 0) {
      console.log(id, pre_count, pre_seen);
    }

    cur["pre_sentiment"] = +(pre_covid / pre_seen).toFixed(2);
    cur["pre_count"] = pre_count;
    cur["post_sentiment"] = +(post_covid / post_seen).toFixed(2);
    cur["post_count"] = post_count;
    cur["change"] = +(cur["pre_sentiment"] - cur["post_sentiment"]).toFixed(2);
    cur["count"] = count;
    res.push(cur);
  });

  // res.sort(function(a,b){return b["count"] - a["count"]})
  return res;
};
