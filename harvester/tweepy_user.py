import tweepy
import config
import database
import sys

def search_user(user_id):

    print("GOT USER")
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


def main(user_queue, error_count):

    global db
    db = database.DBHelper()


    while True:
        try:
            # Look for tweet
            tweet = user_queue.get()

            try:

                search_user(tweet)
                
            except Exception as e:
                print("Save error", e)
                error_count += 1
                if error_count> 100:
                    # Stops us from being rate limited
                    print("Too many errors")
                    sys.exit()


        except queue.Empty:
            time.sleep(10)
            continue