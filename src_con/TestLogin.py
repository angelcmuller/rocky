#Test cases for login by Gabriel Mortensen 
#getting test_new_user to run twice was aided by ChatGPT 

#Libraries Necessary 
import unittest
from unittest.mock import patch
import io
import login
from contextlib import redirect_stdout
from pymongo import MongoClient
import ssl
import certifi
from bson.objectid import ObjectId

class TestLogin(unittest.TestCase):

    #====TEST ONE====
    #invalid input test for login menu 
    @patch('builtins.input', side_effect=['A'])
    def test_invalid_menulogin(self, mock_input):
        expected_output = "Invalid Input"
        with io.StringIO() as out:
            with redirect_stdout(out):
                login.main()
                output = out.getvalue().strip()
                self.assertTrue(expected_output in output)
               
    #====TEST TWO====
    # new user tries to create account
    @patch('builtins.input', side_effect=['Y', 'Unit', 'Tester', 'Y'])
    def test_new_user(self, mock_input):
                
        #if unit tester account already exists, delete it   
        #connect to database 
        client = MongoClient("mongodb://tristanbailey:RockyRoadKey2022@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority",
                tlsCAFile=certifi.where()) 
        
        # select the database and collection
        db = client['pinDatabase']
        collection = db['Contributors']

        account_info = {'Username': 'Unit', 'Password': 'Tester'}

        # search for the unit tester account in the database 
        results = collection.find_one(account_info)

        # If the unit tester account exists, delete it 
        if results is not None:
            result = collection.delete_one(account_info)

        #should be fresh user first time around             
        expected_output = "Account created successfully"

        with io.StringIO() as out:
            with redirect_stdout(out):
                login.main()
                output = out.getvalue().strip()
                self.assertIn(expected_output, output) 
               
    #====TEST THREE====
    # new user tries familar username 
    @patch('builtins.input', side_effect=['Y', 'Rocky', 'Example', 'Y'])
    def test_wrong_new_user(self, mock_input):
        #should be fresh user first time around             
        expected_output = "Username already exists, account invalid"

        with io.StringIO() as out:
            with redirect_stdout(out):
                login.main()
                output = out.getvalue().strip()
                self.assertIn(expected_output, output) 
                   
    #====TEST FOUR====
    #existing user tries to submit data paths        
    @patch('builtins.input', side_effect=['N', 'Pot,Hole,videopath,csvpath', ''])
    def test_old_user(self, mock_input):
        expected_output = "Pushing information to database, please wait as calculations performed..."
        with io.StringIO() as out:
            with redirect_stdout(out):
                login.main()
                output = out.getvalue().strip()
                self.assertIn(expected_output, output)           