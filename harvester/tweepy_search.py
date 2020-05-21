'''
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
'''

import tweepy
import config
import database
import harvest
import sys
import time



def main(api, tweet_queue, error_count):

    # Sleep 1 window when restarting
    time.sleep(20 * 60)

    # Scrape all tweets in last week VIC.
    # Assume all people in this scrape are Melbournians due to travel bans.
    while True:
        try:
            for i in range(170):
                for tweet in api.search(geocode=config.VICTORIA_RADIUS, count=100, since_id = config.TWEET_DEC2019):

                    # Look for tweet
                    tweet_queue.put(tweet._json)
        except Exception as e:
            print("Search error")
            print(e)
            # sys.exit()
            pass


        time.sleep(16 * 60)


