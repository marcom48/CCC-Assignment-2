import os
import tweepy
import database
import json
import queue
import threading
import config
import processor
import sys

from typing import *


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

            # Rate limited
            return False
        # Reconnect
        return True


def get_auth():
    auth = tweepy.OAuthHandler(config.TWITTER_CONSUMER_KEY, config.TWITTER_CONSUMER_SECRET)
    auth.set_access_token(config.TWITTER_ACCESS_TOKEN, config.TWITTER_ACCESS_TOKEN_SECRET)
    return tweepy.API(auth)
    

def start_listener(twitter_listener):
    try:
        tweepy_stream = tweepy.Stream(api.auth, twitter_listener)

        # Set location. Must have filter for it to start. This is victoria
        tweepy_stream.filter(locations = config.victoria)
        # tweepy_stream.filter(track="coronavirus")

    except Exception as e:
        print("Error:", e)


def search_user(user_id):
    # Search user

    # Get tweets from different date ranges
    tweets_old = tweepy.Cursor(api.user_timeline, id=user_id, \
        since_id=config.TWEET_DEC2018, max_id=config.TWEET_APR2019).items(config.SEARCH_LIMIT)

    tweets_new = tweepy.Cursor(api.user_timeline, id=user_id, \
        since_id=config.TWEET_DEC2019, max_id=config.TWEET_APR2020).items(config.SEARCH_LIMIT)

    # Save tweets or ADD TO QUEUE?
    count =0 
    for i in tweets_old:
        db.add_tweet(i._json)
        count += 1

    for i in tweets_new:
        db.add_tweet(i._json)
        count += 1

    print(f"{user_id}: {count}\n")

def save_tweet(tweet, q):

    # Check if user tweets with location on
    valid_user = db.add_tweet(tweet)

    # Check if seen user before
    if valid_user and not db.has_user(tweet["user"]["id_str"]):

        db.add_user(tweet["user"]["id_str"], tweet["user"]["screen_name"], tweet["id_str"])

        # Can only get 200 tweets from a user at a time. Add for loop to increase.
        # for i in range(5):
        search_user(tweet["user"]["id_str"])

def main():

    # Create job queue
    # May not need job queue
    q = queue.Queue()

    global api
    api = get_auth()

    global db
    db = database.DBHelper()
    
    twitter_listener = StreamListener(q)
    
    # Start listening
    threading.Thread(target=start_listener, args=(twitter_listener,)).start()

    # Start thread to do a search for users who tweeted recently in Melb with location, add to quueue

    # Number of API errors
    # Move this into the listener?
    error_count = 0

    while True:
        try:
            # Look for tweet
            tweet = q.get()

            try:

                save_tweet(tweet, q)
                
            except Exception as e:
                print("Save error", e)
                error_count += 1
                if error_count> 100:
                    # Stops us from being rate limited
                    print("Too many errors")
                    sys.exit()


        except queue.Empty:
            time.sleep(2)
            continue

        

if __name__ == "__main__":
    main()