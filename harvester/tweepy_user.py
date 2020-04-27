import tweepy
import config
import database
import sys
import time

def search_user(api, db, user_id):


    results = []

    if not db.scraped_user(user_id):

        # Get tweets from different date ranges
        tweets_old = tweepy.Cursor(api.user_timeline, id=user_id, \
            since_id=config.TWEET_DEC2018, max_id=config.TWEET_APR2019).items(config.SEARCH_LIMIT)

        for i in tweets_old:
            results.append(i._json)


        tweets_new = tweepy.Cursor(api.user_timeline, id=user_id, \
            since_id=config.TWEET_DEC2019).items(config.SEARCH_LIMIT)

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

    
    print(f"{user_id}: {count}\n")


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
                    sys.exit()


        except queue.Empty:
            time.sleep(10)
            continue