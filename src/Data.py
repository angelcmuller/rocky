import numpy as np
from tensorflow import keras
import tensorflow as tf
import matplotlib.pyplot as plt


#AddData(data, account)
#  This method will take in aggregated road condition data.
#  It will lookup the account in the user database and get its UID.
#  Then it will upload data to the pin database under this UID.
#  Then add it to the database using the user’s specific account data for traceability purposes.


# ReadROS(Data)
# This method will take in ROS data, extrapolate a segment of the ros data, convert the ros data into parameter, i.e. a gps location integer, a file path for a picture, for use in further functions.
# It then classifies that data segment using ClassifyDataSegment.
# Then it calls CheckSimilar and if CheckSimilar is false, it uploads the aggregated data to the database using AddData.
# If CheckSimilar is true then it calls LatestData to return the data segment with the most recent timestamp.
# After performing these checks the most recent data segment is added to the map.
# This function loops until all data segments have been processed.
# There is no particular return segment for this function.


# ClassifyDataSegment(dataSeg)
# This function will take in an ROS data segment.
# Determines if the given segment of data has any road conditions.
# Classifies those road conditions, and then aggregates them with GPS data and other helpful metadata which it will promptly return.

# CheckSimilar(dataSeg)
# This function takes in a data segment made from the ClassifyDataSegment function.
# During its execution, the function will use the location from the data segment provided to search the pre-existing data on RockyRoad.
# If the pre-existing network exists then this function returns true, otherwise it returns false.


#LatestData(dataseg1, dataseg2)
# This method takes in two data segments and returns the data segment with the most recent timestamp.


# TestPin()
# This method returns a GPS locatuion, image, and description to the front end
