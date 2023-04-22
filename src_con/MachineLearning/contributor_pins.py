from pymongo import MongoClient
import csv
import os
import ssl
import certifi
from bson.objectid import ObjectId

# add contributor pin to database 
def add_cpin(classification, lat, lng, Mdate, Udate, author, byte_string):

    # connect to database
    client = MongoClient("mongodb://tristanbailey:RockyRoadKey2022@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority",
            tlsCAFile=certifi.where())

    # select the database and collection
    db = client['pinDatabase']
    collection = db['Cpins']

    # Add new contributor pin to database with info in parameters 
    document = {"Lattitude": lat, "Longitude": lng, "MeasurementDate": Mdate, "UploadDate": Udate, "Source": author, "Classification": classification, "Img_Byte_String": byte_string}
    result = collection.insert_one(document)
    if result.acknowledged:
        print(classification, " pin (GPS:", lat, ",", lng, ") created successfully")
