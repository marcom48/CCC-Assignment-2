import os

COUCHDB_USER = os.getenv("COUCHDB_USER")
COUCHDB_PASSWORD = os.getenv("COUCHDB_PASSWORD")

SUBURB_GET = "curl http://%s:%s@127.0.0.1:5984/located_tweets/_design/suburb_stats/_view/get_suburb_sentiment?group=true > data.json" % (COUCHDB_USER, COUCHDB_PASSWORD)
USER_GET = "curl http://%s:%s@127.0.0.1:5984/tweets/_design/user_stats/_view/user_count?group=true > data.json" % (COUCHDB_USER, COUCHDB_PASSWORD)

