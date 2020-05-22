'''
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
'''

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
            try:
                self.server.create("tweets")
            except:
                pass
            self.db_tweets = self.server["tweets"]

        try:
            self.db_users = self.server["users"]
        except:
            try:
                self.server.create("users")
            except:
                pass
            self.db_users = self.server["users"]

        try:
            self.db_located = self.server["located_tweets"]
        except:
            try:
                self.server.create("located_tweets")
            except:
                pass
            self.db_located = self.server["located_tweets"]

        try:
            self.db_website = self.server["website"]
        except:
            try:
                self.server.create("website")
            except:
                pass
            self.db_website = self.server["website"]

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
    
    def store_located(self, data) -> None:

        located_data = {}
        for i in ['harvestTime', '_id', 'location','created_at','text','sentiment','user']:
            located_data[i] = data[i]


        self.db_located[located_data['_id']] = located_data


    def add_tweet(self, tweet) -> bool:
        # Remove duplicates
        if not self.db_tweets.get(tweet["id_str"]):

            data, has_location = self.tweetProcessor.process_tweet(tweet)
            
            if data:
                self.db_tweets[tweet["id_str"]] = data

                if has_location and not self.db_located.get(tweet["id_str"]):

                    self.store_located(data)


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

        

    

    
