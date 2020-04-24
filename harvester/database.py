import couchdb

import time

import config
import processor

class DBHelper:
    def __init__(self) -> None:
        self.server = couchdb.Server("http://%s:%s@127.0.0.1:5984/" % (config.COUCHDB_USER, config.COUCHDB_PASSWORD))
        self.id = config.NODE_ID

        self.tweetProcessor = processor.TweetProcessor()
        # Assert databases initialised.
        try:
            self.db_tweets = self.server["tweets"]
        except:
            self.server.create("tweets")
            self.db_tweets = self.server["tweets"]

        try:
            self.db_users = self.server["users"]
        except:
            self.server.create("users")
            self.db_users = self.server["users"]

    
    def add_tweet(self, tweet) -> None:
        # Remove duplicates
        if not self.db_tweets.get(tweet["id_str"]):

            data = self.tweetProcessor.process_tweet(tweet)

            if data:
                self.db_tweets[tweet["id_str"]] = data


    def add_user(self, user_id, user_handle, last_tweet) -> None:
        
        user_doc = self.db_users.get(user_id)
        if not user_doc:
            data = {
                '_id': user_id,
                'screenName': user_handle,
                "harvestTime": int(time.time()),
                "harvestNode": self.id,
                "lastTweet": last_tweet,
                "tweetCount": 0
            }

            self.db_users[user_id] = data

        else:
            user_doc["lastTweet"] = last_tweet
            user_doc["tweetCount"] = user_doc["tweetCount"] + 1
            self.db_users.save(user_doc)


        

        
