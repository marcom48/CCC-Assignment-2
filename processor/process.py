import couchdb
from tqdm import tqdm
from collections import defaultdict
import traceback
import datetime
import os
import config
import time
import sys
import requests
from requests.auth import HTTPBasicAuth 

def saveDB(database, data):

    save_count = 0
    server = couchdb.Server("http://%s:%s@127.0.0.1:5984/" % (config.COUCHDB_USER, config.COUCHDB_PASSWORD))
    
    try:
        db = server[database]
    except:
        try:
            server.create(database)
        except:
            pass
        db = server[database]


    for i in tqdm(data):
        try:
            if not db.get(i):
                db.save(data[i])
            else:
                doc = db[i]
                for j in data[i]:
                    doc[j] = data[i][j]
                db.save(doc)

        except:
            save_count += 1
            pass

    return save_count

def addSent(data, dict_key, sentiment):

    if not data.get(dict_key):
        data[dict_key] = {}
        data[dict_key]['sentiments'] = defaultdict(int)
    
    data[dict_key]['sentiments'][sentiment] += 1


def updateDB(database, command):

    count = 0

    # Request data from database
    data = requests.get(command, auth = HTTPBasicAuth(config.COUCHDB_USER, config.COUCHDB_PASSWORD))
    data = data.json()['rows']

    # Results dictionary
    full_data = defaultdict(dict)
    melbourne = False
    
    # Save full city data too
    if database == 'users':
        melbourne = True
        melbourne_data = defaultdict(dict)

    for i in tqdm(data):
        try:

            _id = i['key'][0]
            if not full_data.get(_id):
                full_data[_id] = {'_id': _id}

            # Date details
            year = i['key'][1]
            month = i['key'][2] + 1
            sentiment = str(i['key'][-1])
            dict_key = str(year) + '-' + str(month)

            addSent(full_data[_id], dict_key, sentiment)

            if melbourne:
                addSent(melbourne_data, dict_key, sentiment)

        except Exception as e:
            traceback.print_exc()
            print(e)
            count += 1
            pass
    
    # Compute average and count for weeks
    for i,j in full_data.items():
        for week in j:
            try:
                sents = j[week]['sentiments']
                j[week]['count'] = sum(sents.values())
                j[week]['average'] = sum([int(x)*y for x,y in sents.items()]) / sum(sents.values())
            except:
                pass

    saveDB(database, full_data)
    
    if melbourne:
        for i,j in melbourne_data.items():
            try:
                melbourne_data[i]['_id'] = i
                sents = j['sentiments']
                j['count'] = sum(sents.values())
                j['average'] = sum([int(x)*y for x,y in sents.items()]) / sum(sents.values())
            except:
                pass

        saveDB('melbourne', melbourne_data)



def main():

    while True:
        try:
            updateDB('website_suburb', config.SUBURB_GET)
        except Exception as e:
            print(e)
            pass
        try:
            updateDB('users', config.USER_GET)
        except Exception as e:
            print(e)
            pass
        time.sleep(3600 * 6)
        

if __name__ == "__main__":
    main()


