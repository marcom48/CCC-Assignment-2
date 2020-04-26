import suburb
import pytz
from datetime import timezone, datetime
import time
import config
import json
import traceback

    
def init():
    suburb.init()

class TweetProcessor():

    def __init__(self):
        self.subProcessor = suburb.SuburbProcessor()


    def process_tweet(self, tweet) -> dict:

        tweet_doc = {}
        
        try:
            
            tweet_doc['_id'] = tweet["id_str"]
            tweet_doc["harvestTime"] = int(time.time())
            tweet_doc["harvestNode"] = config.NODE_ID

            # Location
            longitude, latitude, _suburb = self.subProcessor.get_location_details(tweet)
            if _suburb:
                tweet_doc["location"] = {
                    "longitude": longitude,
                    "latitude": latitude,
                    "suburb": _suburb
                }
            else:
                return None

            # Convert to ISO 8601
            tweet_time = datetime.strptime(tweet["created_at"], '%a %b %d %H:%M:%S %z %Y')
            tweet_time = tweet_time.replace(tzinfo=timezone.utc).astimezone(pytz.timezone('Australia/Melbourne')).isoformat()
            tweet_doc["created_at"] = tweet_time

            # Clean for sentiment analysis?
            tweet_doc["text"] = tweet["text"]
            
            # User details
            userId = tweet["user"]["id_str"]
            username = tweet["user"]["screen_name"]
            tweet_doc["user"] = {"id": userId, "screenName": username}

            tweet_doc["hashtags"] = [i["text"] for i in tweet["entities"]["hashtags"]]


            # Add in extra data relevant for our topic
            
            return tweet_doc

        except Exception as e:
            print("Process error:",e)
            print(traceback.format_exc())

            return None


