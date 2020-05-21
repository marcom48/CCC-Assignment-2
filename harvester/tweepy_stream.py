'''
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
'''

import os
import tweepy
import database
import json
import queue
import threading
import time
from config import VICTORIA
import sys

from typing import *


class StreamListener(tweepy.StreamListener):

    def __init__(self, _tweet_queue: queue.Queue()):
        
        # Queue for jobs to process
        self.tweet_queue = _tweet_queue

        super().__init__()

    # Method called when listener gets data. I think its called from on_data
    def on_status(self, status):
        self.tweet_queue.put(status._json)

    # Method called when an error occurs
    def on_error(self, status_code):
        print("Listener error")
        if status_code == 420:

            # Rate limited
            return False
        # Reconnect
        return True



def start_listener(api, twitter_listener):
    try:
        tweepy_stream = tweepy.Stream(api.auth, twitter_listener)

        # Set location. Must have filter for it to start. This is VICTORIA
        tweepy_stream.filter(locations = VICTORIA)
        # tweepy_stream.filter(track="coronavirus")

    except Exception as e:
        print("Start stream Error:", e)



def save_tweet(db, tweet, user_queue):

    # Check if user tweets with location on
    valid_user = db.add_tweet(tweet)

    # Add user with location to queue
    if valid_user:

        user_queue.put(tweet["user"]["id_str"])


def main(api, tweet_queue, user_queue, error_count):

    
    
    db = database.DBHelper()
    
    twitter_listener = StreamListener(tweet_queue)
    
    # Start listening
    threading.Thread(target=start_listener, args=(api, twitter_listener,)).start()


    while True:
        try:
            # Look for tweet
            tweet = tweet_queue.get()

            try:

                save_tweet(db, tweet, user_queue)
                
            except Exception as e:
                print("Stream save error", e)
                error_count += 1
                if error_count> 100:
                    # Stops us from being rate limited
                    print("Too many errors")
                    time.sleep(3600 * 3)

        except queue.Empty:
            time.sleep(5)
            continue

