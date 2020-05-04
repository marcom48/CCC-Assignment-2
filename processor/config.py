import os

COUCHDB_USER = os.getenv("COUCHDB_USER")
COUCHDB_PASSWORD = os.getenv("COUCHDB_PASSWORD")

SUBURB_GET = "http://127.0.0.1:5984/located_tweets/_design/test/_view/test?group_level=4"
USER_GET = "http://127.0.0.1:5984/tweets/_design/floattest/_view/floattest?group_level=4"

