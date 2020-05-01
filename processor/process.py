import couchdb
import numpy as np
from tqdm import tqdm
from collections import Counter, defaultdict
import traceback
import os
import config
import json
import time

def getSents(sents):
    stk = []
    for i in sents:
        stk.append(i)
    ret = []
    while(len(stk)):
        curr = stk[-1]
        stk.pop()
        if type(curr) == list:
            for i in curr:
                stk.append(i)
        else:
            ret.append(curr)
    return ret


def updateDB(database, command):

    server = couchdb.Server("http://%s:%s@127.0.0.1:5984/" % (config.COUCHDB_USER, config.COUCHDB_PASSWORD))

    try:
        db = server[database]
    except:
        try:
            server.create(database)
        except:
            pass
        db = server[database]


    bins = [i for i in range(1, 11)]
    count = 0

    os.system(command)

    with open("data.json", 'r') as file:
        data = json.load(file)

    data = data['rows']
    full_data = defaultdict(dict)
    import sys
    #print(len(data))
    for i in tqdm(data):
        try:
            #print(i['key'][0])
            #sys.exit()
            suburb = i['key'][0]
            if not full_data.get(suburb):
                full_data[suburb] = {'_id': suburb}
            year = i['key'][1]
            month = i['key'][2]
            dict_key = str(year) + '-' + str(month)
            sents = getSents(i['value'])

            sents = list(map(lambda a: a*5 + 5, sents))
            

            inds = np.digitize(sents, bins)
            month_ave = np.mean(inds)
            inds = list(map(str, inds))
            c = Counter(inds)

            month_data = {"average": month_ave, "count": len(sents), 'sentiments_bins': dict(c)}

            full_data[suburb][dict_key] = month_data

        except Exception as e:
            traceback.print_exc()
            print(e)
            count += 1
            pass

    save_count = 0


    for i in tqdm(full_data):
        try:
            if not db.get(i):
                db.save(full_data[i])
            else:
                doc = db[i]
                for j in full_data[i]:
                    doc[j] = full_data[i][j]
                db.save(doc)

        except:
            save_count += 1
            pass

    print(count, save_count)

def main():

    while True:
        try:
            updateDB('website_suburb', config.SUBURB_GET)
        except:
            pass
        try:
            updateDB('users', config.USER_GET)
        except:
            pass
        time.sleep(3600 * 6)
        

if __name__ == "__main__":
    main()


