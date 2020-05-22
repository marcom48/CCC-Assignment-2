'''
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
'''

from shapely.geometry import shape, Point, polygon
import json
import random
from config import VICTORIA

class SuburbProcessor():
    def __init__(self):

        self.suburbDict = self.getSurburbs()

    def getSurburbs(self) -> dict:
    
        suburbDict = {}

        with open('data/melbourne.geojson') as file:
            file_data = json.load(file)

            for i in file_data['features']:

                _id = i['id']

                name = i['properties']['SA2_NAME16']
                
                suburbDict[_id] = {}
                
                suburbDict[_id]['name'] = name
                
                if i['geometry']['type'] == 'Polygon':

                    suburbDict[_id]['type'] = 'Polygon'

                    coordinate_list = i['geometry']['coordinates'][0]

                    suburbDict[_id]['Polygon'] = polygon.Polygon([(x,y) for x,y in coordinate_list])
                    
                else:
                    suburbDict[_id]['type'] = 'MultiPolygon'

                    suburbDict[_id]['polygons'] = []

                    for coordinates in i['geometry']['coordinates']:

                        suburbDict[_id]['polygons'].append(polygon.Polygon([(x,y) for x,y in coordinates[0]]))


        return suburbDict


    def get_location_details(self, tweet):
        try:

            if tweet["coordinates"]:

                longitude = tweet["coordinates"]["coordinates"][0]
                latitude = tweet["coordinates"]["coordinates"][1]
            else:
                
                return None, None, None
            
            location = Point(longitude, latitude)
 

            return longitude, latitude, self.find_suburb(location)

        except Exception as e:
            print(e)
            return None, None, None

    def find_suburb(self, location):

        for sub in self.suburbDict.keys():

            if self.suburbDict[sub]['type'] == 'Polygon':
                if self.suburbDict[sub]['Polygon'].contains(location):
                    return self.suburbDict[sub]["name"]
            else:
                for polygon in self.suburbDict[sub]['polygons']:

                    if polygon.contains(location):
                        return self.suburbDict[sub]["name"]
        return None