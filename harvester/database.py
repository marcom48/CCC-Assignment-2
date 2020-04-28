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

    def scraped_user(self, user_id) -> bool:
        try:
            return self.db_users[user_id]['scraped']
        except:
            return False
        
    def mark_scraped(self, user_id) -> None:

        try:
            doc = self.db_users[user_id]
            doc['scraped'] = True
            self.db_users[user_id] = doc

        except:
            pass


    def last_tweet(self, user_id) -> str:
        try:
            return self.db_users[user_id]['lastTweet']
        except:
            return None


    def update_user(self, user_id, last_tweet) -> None:

        try:
            doc = self.db_users[user_id]
            doc['lastTweet'] = last_tweet

            doc['tweetCount'] = 1 + int(doc['tweetCount'])

            self.db_users[user_id] = doc
        except:
            pass


    def add_tweet(self, tweet) -> bool:
        # Remove duplicates
        if not self.db_tweets.get(tweet["id_str"]):

            data, has_location = self.tweetProcessor.process_tweet(tweet)
            
            if data:
                self.db_tweets[tweet["id_str"]] = data

                # Record user
                user_id = tweet["user"]["id_str"]

                if not self.db_users.get(user_id):
                    self.add_user(user_id, tweet["user"]["screen_name"], tweet["id_str"])

                else:

                    self.update_user(user_id, tweet["id_str"])


                return True
            else:
                print("Couldn't add tweet")



        return False


    def add_user(self, user_id, user_handle, last_tweet) -> None:

        # Add in processor method
        data = {
            '_id': user_id,
            'screenName': user_handle,
            "harvestTime": int(time.time()),
            "harvestNode": self.id,
            "lastTweet": last_tweet,
            "tweetCount": 1,
            "scraped": False
        }

        self.db_users[user_id] = data

        

    

    
