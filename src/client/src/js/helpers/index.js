export const jsonGeoJson = json => {

    let res = {}
    let features = []
    let cur = {}
    res["type"] = "FeatureCollection"
    json["default"]["rows"].forEach(element => {
        cur["type"] = "Feature"
        cur["properties"] = {
            "harvestTime": element["harvestTime"],
            "_id": element["_id"],
            "harvestNode": element["harvestNode"],
            "createdTime": element["created_at"],
            "user": element["user"],
            "hashtags": element["hashtags"],
            "suburb": element["location"]["suburb"] ? element["location"]["suburb"] : "",
            "text": element["text"]
        }
        cur["geometry"] = {
            "type": "Point",
            "coordinates": [element["location"]["longitude"], element["location"]["latitude"]]
        }
        features.push(cur)
        cur = {}
    });

    res["features"] = features
    
    return res

}

