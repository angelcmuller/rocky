# use libraries for CNNs and ML traning
import numpy as np
# from tensorflow import keras
# import tensorflow as tf
# import matplotlib.pyplot as plt
import csv
import pandas as pd
import pymongo
import requests
import certifi


def main():
    print("========Welcome to ROS Backend========")

    addPinData()


def addPinData():

    # Obtain the the data from CSV file
    df = pd.read_csv('src\Data.csv', usecols=[
        'Lattitude', 'Longitude', 'Classification', 'Degree'])

    print(df)

    # Convert the data into a series of records
    data = df.to_dict(orient="records")
    print(data)

    # Connecting to the databse
    client = pymongo.MongoClient("mongodb://tristanbailey:RockyRoadKey2022@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority",  tlsCAFile=certifi.where())

    # Make a database
    db = client["pinDatabase"]

    # Add data to the database
    # Note Pins is a custom name for the connection (you can rename it)
    db.Pins.insert_many(data)
    print("Pin cordinates added to database")


if __name__ == "__main__":
    main()
