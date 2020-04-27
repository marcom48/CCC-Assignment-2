import tweepy
import config
import database
import harvest
import sys
import time



def main(api, tweet_queue, error_count):

    while True:
        for tweet in api.search(geocode=config.VICTORIA_RADIUS, count=100, since_id = config.TWEET_DEC2019):
            try:
                # Look for tweet
                tweet_queue.put(tweet._json)

            except queue.Empty:
                time.sleep(10)
                continue
        
        time.sleep(1800)
# api = harvest.get_auth()
# for tweet in api.search(geocode=config.VICTORIA_RADIUS, count=1, since_id = config.TWEET_DEC2019):
#     print(tweet._json)

