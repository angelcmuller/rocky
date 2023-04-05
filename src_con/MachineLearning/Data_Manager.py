#Project Rocky Road
#Author: Tristan Bailey
#DLM (Date Last Modified): 12/16/2022
#Desc:
#   Class code for a python object to handle writing to our
#   Pins MongoDB. Code developed entirely by Tristan

import pandas as pd
import certifi
import pymongo

class Data_Manager(object):
    #Class for managing how and when data is pushed to the database
    df = pd.DataFrame(columns=['Pid', 'Lattitude', 'Longitude', 'Altitude', 'MeasurementDate', 'UploadDate', 'Source', 'Cid','Classification', 'Degree'])
    tick = 0
    threshold = 10
    db = None

    #enforces singleton design pattern
    def __new__(cls, user, key):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Data_Manager, cls).__new__(cls)
        return cls.instance

    def __init__(self, user, key):
        client = pymongo.MongoClient("mongodb://"+user+':'+key+
            "@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority",
            tlsCAFile=certifi.where())
        Data_Manager.db = client["pinDatabase"]

    def add(self, Pid, Lattitude, Longitude, Altitude, MeasurementDate, UploadDate, Source, Cid, Classification, Degree):
        Data_Manager.tick += 1
        temp = pd.DataFrame([[Pid, Lattitude, Longitude, Altitude, MeasurementDate, UploadDate, Source, Cid, Classification, Degree]],
            columns=['Pid', 'Lattitude', 'Longitude', 'Altitude', 'MeasurementDate', 'UploadDate', 'Source', 'Cid','Classification', 'Degree'])
        Data_Manager.df = pd.concat([Data_Manager.df, temp], ignore_index = True)
        
        if(Data_Manager.tick == Data_Manager.threshold):
            Data_Manager.tick = 0
            self.__upload_to_database()

    def push(self):
        if(Data_Manager.tick != 0):
            self.__upload_to_database()
        
    def __upload_to_database(self):
        # Convert the data into a series of records
        data = Data_Manager.df.to_dict(orient="records")
            
        # Add data to the database
        Data_Manager.db.Pins.insert_many(data)
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