# use libraries for CNNs and ML traning
import numpy as np
# from tensorflow import keras
# import tensorflow as tf
# import matplotlib.pyplot as plt
import csv
import pandas as pd
import pymongo


def main():

    # Obtain the the data from CSV file
    df = pd.read_csv('src\Data.csv', usecols=[
        'Lattitude', 'Longitude', 'Classification', 'Degree'])

    # Convert the data into a series of records
    data = df.to_dict(orient="records")

    # Connecting to the databse
    client = pymongo.MongoClient(
        "mongodb+srv://tristanbailey:RockyRoadKey2022@cluster0.fpy1pqs.mongodb.net/?retryWrites=true&w=majority")
    # Make a database
    db = client["pinDatabase"]
    print(db)

    # Add data to the database
    # Note Pins is a custom name for the connection (you can rename it)
    db.Pins.insert_many(data)


if __name__ == "__main__":
    main()
