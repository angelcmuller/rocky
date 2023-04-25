#Project Rocky Road
#Author: Tristan Bailey
#DLM (Date Last Modified): 12/16/2022
#Desc:
#   Class code for a python object to handle writing to our
#   Pins MongoDB. Code developed entirely by Tristan

import pandas as pd
import certifi
import pymongo
from bson.objectid import ObjectId

class Data_Manager(object):
    # Class for managing how and when data is pushed to the database
    df = pd.DataFrame(columns=['Lattitude', 'Longitude', 'Altitude', 'MeasurementDate', 'UploadDate', 'Source', 'Classification'])
    tick = 0
    threshold = 10
    db = None

    # Enforces singleton design pattern
    def __new__(cls, user, key):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Data_Manager, cls).__new__(cls)
        return cls.instance

    def __init__(self, user, key):
        client = pymongo.MongoClient("mongodb://"+user+':'+key+
            "@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority",
            tlsCAFile=certifi.where())
        Data_Manager.db = client["pinDatabase"]

        # Create a new collection to store the image data
        #Data_Manager.db.Images.create_index([("_id", pymongo.ASCENDING)])

    def add(self, Lattitude, Longitude, Altitude, MeasurementDate, UploadDate, Source, Classification, Byte_String):
        # Generate a new ObjectId to reference the image document
        while True:
            img_id = ObjectId()

            # Insert the image data into the Images collection
            img_data = {"_id": img_id, "data": Byte_String}
            try:
                Data_Manager.db.Images.insert_one(img_data)
                break
            except pymongo.errors.DuplicateKeyError:
                print(f"Image with _id '{img_id}' already exists in the Images collection.")
                continue

        # Add a new row to the DataFrame with the image ID
        temp = pd.DataFrame([[Lattitude, Longitude, Altitude, MeasurementDate, UploadDate, Source, Classification, img_id]],
            columns=['Lattitude', 'Longitude', 'Altitude', 'MeasurementDate', 'UploadDate', 'Source', 'Classification', 'Img_ObjectId'])
        Data_Manager.df = pd.concat([Data_Manager.df, temp], ignore_index=True)
        
        Data_Manager.tick += 1

        if Data_Manager.tick == Data_Manager.threshold:
            Data_Manager.tick = 0
            self.__upload_to_database()

    def push(self):
        if Data_Manager.tick != 0:
            self.__upload_to_database()
        
    def __upload_to_database(self):
        # Convert the data into a list of dictionaries
        data = Data_Manager.df.to_dict(orient="records")
            
        # Add data to the database
        Data_Manager.db.Pins.insert_many(data)

        # Clear the DataFrame and reset the index
        Data_Manager.df = pd.DataFrame(columns=Data_Manager.df.columns)
        
    def user_check(self):
        # iterate over every record in the collection
        for record in    Data_Manager.db.Contributors.find():
            # check if the "Name" field is present in the record
            if 'Username' in record:
                # do something with the "Name" field, e.g. print it
                print(record['Username'])
            else:
                # handle the case where the "Name" field is missing
                print('Username field is missing')
