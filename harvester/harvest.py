'''
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
'''

import tweepy
import tweepy_stream
import tweepy_user
import tweepy_search
from queue import Queue
import threading
import config

def get_auth():
    auth = tweepy.OAuthHandler(config.TWITTER_CONSUMER_KEY, config.TWITTER_CONSUMER_SECRET)
    auth.set_access_token(config.TWITTER_ACCESS_TOKEN, config.TWITTER_ACCESS_TOKEN_SECRET)
    return tweepy.API(auth)
    

def main():
    
    api = get_auth()
    error_count = 0
    tweet_queue = Queue()
    user_queue = Queue()

    # Start harvesting threads
    threading.Thread(target=tweepy_stream.main, args=(api, tweet_queue, user_queue, error_count,)).start()
    threading.Thread(target=tweepy_user.main, args=(api, user_queue, error_count,)).start()
    threading.Thread(target=tweepy_search.main, args=(api, tweet_queue, error_count,)).start()

if __name__ == "__main__":
    main()