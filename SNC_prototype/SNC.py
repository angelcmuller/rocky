# Project Rocky Road
# Author: Gabriel Mortensen
# DLM (Date Last Modified): 1/3/2023
# Desc:
#   Python code to break up video into snapshots for analysis
#   additionally names photos with respective gps coordinates


# Importing all necessary libraries
import cv2
import os
from pandas import *


# main funtion used to call video converter function


def main():
    print("========Converting Video ========")

    # read the csv
    INSdata = read_csv("SNC_prototype\INS_topic.csv")

    # convert columns of csv to list
    realtime_INS = INSdata['dt'].tolist()
    longitude_INS = INSdata['field.longitude'].tolist()
    latitude_INS = INSdata['field.latitude'].tolist()
    # break down video
    VideoBreakdown(realtime_INS, longitude_INS, latitude_INS)

# returns GPS Coordinates of image


def Coordinates(realtime_INS, longitude_INS, latitude_INS, time):

    # finds realtime value with most similarity using time with minmum difference
    similar_value = min(realtime_INS,
                        key=lambda realtime: abs(realtime-time))

    # obtain index of realtime
    similar_index = realtime_INS.index(similar_value)

    # use index in GPS coordinates
    latitude = str(latitude_INS[similar_index])
    longitude = str(longitude_INS[similar_index])
    return ("|" + latitude + "," + longitude)


# breaks provided video down into snapshots
def VideoBreakdown(realtime_INS, longitude_INS, latitude_INS):
    # ======================================
    # declare variables
    framerate = 0  # frame rate
    currentframe = 0  # current frame value
    video = "SNC_data\\trax1_FSL_EO_image_rect.mp4"
    file_path = "SNC_data\\data"
    # read the video
    cam = cv2.VideoCapture(video)

    # obtain framerate of video
    framerate = cam.get(cv2.CAP_PROP_FPS)

    # break down to real time
    frametime = 1/framerate
    current_seconds = 0

    try:
        # creating a folder to store images
        if not os.path.exists(file_path):
            os.makedirs(file_path)

    # if not created raise error
    except OSError:
        print('Error: Directory error for data file. Try changing file_path variable.')

    # cycle through the video
    while(True):

        # reading the frame
        ret, frame = cam.read()

        # if frame exists create image
        if ret:

            # name the videos based off of # of second in video (currentframe/framerate)
            # add cor
            name = file_path + '/frame' + str(currentframe) + Coordinates(
                realtime_INS, longitude_INS, latitude_INS, current_seconds) + '.jpg'
            print('Creating...' + name)

            # increment tracking of time with variable
            current_seconds = current_seconds + frametime

            # writing the extracted images
            cv2.imwrite(name, frame)

            # increasing counter so that it will
            # show how many frames are created
            currentframe += 1

        else:
            print(str(currentframe) + " images created...")
            break

    # # Release all space and windows once done
    cam.release()
    # cv2.destroyAllWindows()


# main function guarente
if __name__ == "__main__":
    main()
