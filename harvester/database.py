import couchdb

import time

import config

class DBHelper:
    def __init__(self) -> None:
        self.server = couchdb.Server("http://%s:%s@127.0.0.1:5984/" % (config.COUCHDB_USER, config.COUCHDB_PASSWORD))
        self.id = config.NODE_ID

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

        metadata = {
            "harvestTime": int(time.time()),
            "harvestNode": self.id,
            "processed": False
        }

        # Process tweet here.
        
        data = {
            '_id': tweet["id_str"],
            'rawTweet': tweet,
            'metadata': metadata
        }

        # Remove duplicates
        if tweet["id_str"] not in db_tweets:
            self.db_tweets[tweet["id_str"]] = data


    def add_user(self, user_id, user_handle) -> None:

        metadata = {
            "harvestTime": int(time.time()),
            "harvestNode": self.id,
            "processed": False
            # Add flag for their last harvest
            # "lastHarvest":
        }

        # Process tweet here.
        
        data = {
            '_id': user_id,
            'userHandle': user_handle,
            'metadata': metadata

            # Need to add in flag to indicate when they were last scraped.
        }

        if user_id not in db_users:
            self.db_users[user_id] = data
