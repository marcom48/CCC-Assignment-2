import os
import tweepy
import database
import json
import queue
import threading
import config
from typing import *
def get_auth():
    auth = tweepy.OAuthHandler(config.TWITTER_CONSUMER_KEY, config.TWITTER_CONSUMER_SECRET)
    auth.set_access_token(config.TWITTER_ACCESS_TOKEN, config.TWITTER_ACCESS_TOKEN_SECRET)
    return tweepy.API(auth)
    

class StreamListener(tweepy.StreamListener):

    def __init__(self, _q: queue.Queue()):
        
        # Queue for jobs to process
        self.q = _q

        super().__init__()

    # Method called when listener gets data. I think its called from on_data
    def on_status(self, status):
        self.q.put(status._json)

    # Method called when an error occurs
    def on_error(self, status_code):
        print("Listener error")
        if status_code == 420:
            #returning False in on_error disconnects the stream
            return False


    # Method called when listener gets data
    # def on_data(self, data):
    #     if data[0].isdigit():
    #         pass
    #     else:
    #         print(data)


def start_listener(twitter_listener, locations):
    try:
        api = get_auth()
        tweepy_stream = tweepy.Stream(api.auth, twitter_listener)

        # Set location. Must have filter for it to start. This is melbourne
        tweepy_stream.filter(locations = config.melbourne)
        # tweepy_stream.filter(track="coronavirus")
    except Exception as e:
        print("Error:", e)

# Add tweets to database
def save_tweet(db: database.DBHelper, tweet: Dict[str, Any]):
    db.add_tweet(tweet)
    db.add_user(tweet["user"]["id_str"], tweet["user"]["screen_name"])
    exit()


# Create job queue
# May not need job queue
q = queue.Queue()
twitter_listener = StreamListener(q)
db = database.DBHelper()

# Start listening. Needs to be in thread.
threading.Thread(target=start_listener, args=(twitter_listener, None)).start()


# Number of API errors
error_count = 0


while True:
    try:
        # Look for tweet
        tweet = q.get()

        try:
            save_tweet(db, tweet)
            print("saved")
        except Exception as e:
            print("Save error", e)
            error_count += 1


    except queue.Empty:
        time.sleep(2)
        continue

    
