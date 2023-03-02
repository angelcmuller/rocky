from pymongo import MongoClient
import numpy as np
# from tensorflow import keras
# import tensorflow as tf
# import matplotlib.pyplot as plt
import csv
import requests
import pandas as pd
import os
from dotenv import load_dotenv
from Data_Manager import Data_Manager
import ssl
import certifi
from bson.objectid import ObjectId

#main function used to check MongoDB collection 
def main():
    
    
    
    #connect to database 
    client = MongoClient("mongodb://tristanbailey:RockyRoadKey2022@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority",
            tlsCAFile=certifi.where()) 
    
    # select the database and collection
    db = client['pinDatabase']
    collection = db['Contributors']

    
    #declare video and csv empty paths 
    video = ''
    csv = ''
    
    ans = input("New user? (Y/N)") 
    if (ans == "Y"):
       new_user(collection)
    
    elif (ans == "N"):
        #check username and pass
        video, csv = obtain_info(collection)
        
        #if valid push to database 
        if (video == "False" and csv == "False"):
            print("Invalid identification, please try again")
        else:
            print("Pushing information to database, please wait as calculations performed...")
            analyze_and_push(video, csv)
    
    else:
        print("Invalid Input")
        
        
def analyze_and_push(video, csv):
    print("vid: " + video + " | csv: " + csv)
    

#check if a username already exists in database 
def existing_check(username, collection):
    query = {"Username": {"$eq": username}}
    match = collection.find_one(query)
    
    #true if match exists else false 
    if(match == None):
        return False
    else:
        return True

#add new user to the database 
def new_user(collection):
    #boolean to make sure user likes user and passs 
    confirmed = False

    #make a new user and pass 
    while (confirmed == False):
        #get user information 
        username = input("Make Username (no spaces): ").strip(' ')
        password = input("Make Password (no spaces): ").strip(' ')

        #Close any spaces in username or password 
        username = "".join(username.split())
        password = "".join(password.split())

        if (input("You want your username as '" + username + "' and your password as '" + password + "'... Is this correct? (Y/N)") == "Y"):
            if(existing_check(username, collection) == False):
                confirmed = True
            else:
                print("Username already exists, please try again...")

   # Add new user and pass to database 
    document = { "Username": username, "Password": password }
    result = collection.insert_one(document)
    if result.acknowledged:
        print("Account created successfully")
    else:
        print("Account creation failed")

    
#Obtain info from existing users on video and csv    
def obtain_info(collection):
 
    # get information from user 
    print("Type: username, password, path to video, path to csv")
    Userinput = input("<Project Rocky Road>")
    
    # split users response into different categories 
    Userlist = Userinput.split(',')
    
    # check if user name is valid (found in for loop)
    valid = False

    # iterate over every record in the collection
    for record in collection.find():
        # check if the Username field is present in the record
        if 'Username' in record:
            # Check Username and Password
            if(Userlist[0] == record['Username'] and Userlist[1] == record['Password']):
                valid = True 
        else:
            # handle the case where the Username field is missing
            print('Username field is missing for particular record')

    if (valid == False):
        return "False", "False"
    else:
        return Userlist[2], Userlist[3]
    
# main guard
if __name__ == "__main__":
    main()
