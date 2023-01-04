# Importing all necessary libraries
import cv2
import os


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
        name = file_path + '/frame' + str(currentframe) + '.jpg'
        print('Creating...' + name)

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
