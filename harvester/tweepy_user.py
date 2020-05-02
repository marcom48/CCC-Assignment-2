import tweepy
import config
import database
import sys
import time
import ratelimit

def check_status(api):
    rate_exceeded, reset = ratelimit.get_user_status(api)

    # Check if need to sleep for Twitter rate limits
    if rate_exceeded:
        time.sleep(60 + reset - time.time())


def search_user(api, db, user_id):

    
    try:

        results = []

        if not db.scraped_user(user_id):
        
            # for _ in range(5):

            check_status(api)

            tweets_old = tweepy.Cursor(api.user_timeline, id=user_id, \
                since_id=config.TWEET_DEC2018, max_id=config.TWEET_MAY2019).items(config.FIRST_SEARCH_LIMIT)

            for i in tweets_old:
                results.append(i._json)


            tweets_new = tweepy.Cursor(api.user_timeline, id=user_id, \
                since_id=config.TWEET_DEC2019).items(config.FIRST_SEARCH_LIMIT)

            for i in tweets_new:
                results.append(i._json)

            # Have window scraped user
            db.mark_scraped(user_id)
            

        else:
            
            # Get last tweet
            last_tweet = db.last_tweet(user_id)

            if last_tweet:
                tweets = tweepy.Cursor(api.user_timeline, id=user_id, \
                    since_id=last_tweet).items(config.SEARCH_LIMIT)

            for i in tweets:
                results.append(i._json)
            


        count =0 
        for i in results:
            db.add_tweet(i)

            count += 1

    except Exception as e:
        print("Error searching user", user_id)
        print(e)
        # sys.exit()

def main(api, user_queue, error_count):

    
    db = database.DBHelper()


    while True:
        try:
            # Look for tweet
            user = user_queue.get()

            try:

                search_user(api, db, user)
                
            except Exception as e:
                print("User save error", e)
                error_count += 1
                if error_count> 100:
                    # Stops us from being rate limited
                    print("Too many errors")
                    time.sleep(3600 * 3)
                    # sys.exit()


        except queue.Empty:
            time.sleep(10)
            continue