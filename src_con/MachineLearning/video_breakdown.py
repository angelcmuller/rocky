# Project Rocky Road
# Desc:
#   Python code to break up video into snapshots for analysis
#   additionally names photos with respective gps coordinates


# Importing all necessary libraries
import cv2
import os

# main funtion used to call video converter function
def Convert(user_video, user_csv):
        
    # read the csv provided by user 
    INSdata = read_csv(user_csv)

    # convert columns of csv to list
    realtime_INS = INSdata['dt'].tolist()
    longitude_INS = INSdata['field.longitude'].tolist()
    latitude_INS = INSdata['field.latitude'].tolist()
    # break down video
    VideoBreakdown(user_video, realtime_INS, longitude_INS, latitude_INS)
    
# returns GPS Coordinates of images
def Coordinates(realtime_INS, longitude_INS, latitude_INS, time):

    # finds realtime value with most similarity using time with minmum difference
    similar_value = min(realtime_INS,
                        key=lambda realtime: abs(realtime-time))

    # obtain index of realtime
    similar_index = realtime_INS.index(similar_value)

    # use index in GPS coordinates
    latitude = str(latitude_INS[similar_index])
    longitude = str(longitude_INS[similar_index])
    return ("_" + latitude + "_" + longitude)

# breaks provided video down into snapshots
def VideoBreakdown(user_video, realtime_INS, longitude_INS, latitude_INS):

    # declare variables
    framerate = 24  # frame rate
    currentframe = 0  # current frame value
    video = "trax1_FSL_EO_image_rect.mp4"
    file_path = input("Name folder for video data breakdown: ")
    coordinates_image = "a"

    # read the video
    cam = cv2.VideoCapture(user_video)

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

    # change directory to temporary data file
    os.chdir(file_path)

    print("Processing Video...")

    # cycle through the video
    while(True):

        # reading the frame
        ret, frame = cam.read()

        # if frame exists create image
        if (ret and currentframe < 102):

            coordinates_image = Coordinates(
                realtime_INS, longitude_INS, latitude_INS, current_seconds)

            # name the videos based off off frame and coordinates
            name = "frame" + str(currentframe) + coordinates_image + '.jpg'

            # writing the extracted images
            if(cv2.imwrite(name, frame)):
                print('Creating...' + name)
            else:
                print("Unable to create " + name)

            # increasing counter so that it will
            # show how many frames are created
            currentframe += 1
            # increment tracking of time with variable
            current_seconds = current_seconds + frametime

        else:
            print("Video breakdown complete")
            break

    # Release all space and windows once done
    cam.release()
    cv2.destroyAllWindows()