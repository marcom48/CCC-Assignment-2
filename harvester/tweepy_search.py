import tweepy
import config
import database
import harvest
import sys
import time



def main(api, tweet_queue, error_count):

    while True:
        for i in range(150):
            for tweet in api.search(geocode=config.VICTORIA_RADIUS, count=100, since_id = config.TWEET_DEC2019):

                # Look for tweet
                tweet_queue.put(tweet._json)


        time.sleep(20 * 60)
# api = harvest.get_auth()
# for tweet in api.search(geocode=config.VICTORIA_RADIUS, count=1, since_id = config.TWEET_DEC2019):
#     print(tweet._json)

