
# import tensorflow as tf
# from tensorflow import keras
# from tensorflow.keras.preprocessing.image import ImageDataGenerator
# from tensorflow.keras.preprocessing import image
# from tensorflow.keras.optimizers import RMSprop
import numpy as np
import os
from contributor_pins import add_cpin
from Data_Manager import Data_Manager
import time 

import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import torchvision.models as models
import cv2
import csv
import re

import tqdm

import matplotlib
matplotlib.use('Agg')  # Use the Agg backend
import matplotlib.pyplot as plt

from PIL import Image
import base64

########################################################################
#Visualization code for testing/debug purposes


def test_load_gps_dict(data_dir, gps_file):
    gps_lookup = load_gps_dict(data_dir, gps_file)
    itt = 0
    for key, value in gps_lookup.items():
        if(itt < 10):
            print(str(key)+" "+value.str())
            itt +=1

def save_img_being_processed(grayscale_image_data):
    print("Plotting")
    # Check if the image data is grayscale or RGB
    if grayscale_image_data.ndim == 2:
        cmap = 'gray'
        print("2d")
    elif grayscale_image_data.ndim == 3:
        cmap = None
    else:
        raise ValueError('Invalid image data dimensions')

    # Display the image
    plt.imshow(grayscale_image_data, cmap=cmap)
    plt.savefig('output_image.png')

def save_img_byte_string(image_as_byte_string):
    # Open a file in write mode and write the string to the file
    with open("byte_string.txt", "w") as f:
        f.write(image_as_byte_string)
########################################################################


def main():
    print("Uncomment code in main to run test")
    # Classify("Code_Test", 1239231) 

# Classifies images into categories
def Classify(author, Mdate):
    #rescaling image data window as done in youtube tutorial 
    train = ImageDataGenerator(rescale=1/255)
    validation = ImageDataGenerator(rescale=1/255)

    # resize images and assign label
    # given to neural network 3 images a time (batch size)
    train_dataset = train.flow_from_directory(
        'training', target_size=(200, 200), batch_size=3, class_mode='binary')
    validation_dataset = train.flow_from_directory(
        'validation', target_size=(200, 200), batch_size=3, class_mode='binary')

    # make the CNN
    # need to write how many filters (16) size of those filters (3,3) and activation functoin
    model = tf.keras.models.Sequential([tf.keras.layers.Conv2D(16, (3, 3), activation='relu', input_shape=(200, 200, 3)), tf.keras.layers.MaxPool2D(2, 2),
                                        #
                                        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(
                                            200, 200, 3)), tf.keras.layers.MaxPool2D(2, 2),
                                        #
                                        tf.keras.layers.Conv2D(64, (3, 3), activation='relu', input_shape=(
                                            200, 200, 3)), tf.keras.layers.MaxPool2D(2, 2),
                                        #
                                        tf.keras.layers.Flatten(),
                                        #
                                        tf.keras.layers.Dense(
        512, activation='relu'),
        # do softmix for multi classification
        tf.keras.layers.Dense(
        1, activation='sigmoid')
    ])

    model.compile(loss='binary_crossentropy', optimizer=RMSprop(
        lr=0.001), metrics=['accuracy'])

    # train the model
    model_fit = model.fit(train_dataset, steps_per_epoch=3,
                          epochs=30, validation_data=validation_dataset)

    # test the practice data set
    dir_path = "testing"

    variable_used_for_waiting = input("Move to next step, adding contributor data: ")
    
    for i in os.listdir(dir_path):
        if os.path.isfile(os.path.join(dir_path, i)):
            img = image.load_img(os.path.join(dir_path, i), target_size=(200, 200, 3))

        X = image.img_to_array(img)
        X = np.expand_dims(X, axis=0)
        images = np.vstack([X])
        val = model.predict(images)

        if val == 0:
            print("Bad road... adding pin to web application")

            specific_image = str(i)
            print(i)
            print(specific_image)
            # Extract latitude and longitude from string
            values = specific_image.split("_")[1:3]  # Split string at underscores and take second and third elements
            lng = float(values[1].split(".")[0])  # Convert longitude string to float, ignoring file extension
            lat = float(values[0])
            Udate = int(time.time()) #get current time in unix 
            classification = "Bad Rode (Binary Classification)" #obtain current classification 
            add_cpin(classification, lat, lng, Mdate, Udate, author)

            
        else:
            print("Good road :)")

def ClassifyandTrain_pytorch(author, data_dir, Mdate):
    #rescaling image data window as done in youtube tutorial 
    train_transforms = transforms.Compose([transforms.Resize((200, 200)), transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
    test_transforms = transforms.Compose([transforms.Resize((200, 200)), transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

    # resize images and assign label
    # given to neural network 3 images a time (batch size)
    train_dataset = datasets.ImageFolder('training', transform=train_transforms)
    validation_dataset = datasets.ImageFolder('validation', transform=test_transforms)

    train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=3, shuffle=True)
    validation_loader = torch.utils.data.DataLoader(validation_dataset, batch_size=3, shuffle=True)

    # make the CNN
    # need to write how many filters (16) size of those filters (3,3) and activation function
    model = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
                          nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
                          nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
                          nn.Flatten(),
                          nn.Linear(64 * 25 * 25, 512), nn.ReLU(),
                          nn.Linear(512, 1), nn.Sigmoid())

    # define loss and optimizer
    criterion = nn.BCELoss()
    optimizer = optim.RMSprop(model.parameters(), lr=0.001)

    # train the model
    for epoch in range(30):
        running_loss = 0.0
        for i, data in enumerate(train_loader, 0):
            inputs, labels = data
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels.float().unsqueeze(1))
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        print('[%d] loss: %.3f' % (epoch + 1, running_loss / len(train_loader)))

    # test the practice data set
    dir_path = "testing"

    variable_used_for_waiting = input("Move to next step, adding contributor data: ")

    for i in os.listdir(dir_path):
        if os.path.isfile(os.path.join(dir_path, i)):
            img = cv2.imread(os.path.join(dir_path, i))
            img = cv2.resize(img, (200, 200))
            img = np.transpose(img, (2, 0, 1))
            img = torch.from_numpy(img).float()
            img.unsqueeze_(0)
            outputs = model(img)
            val = outputs.detach().numpy()[0][0]

class lat_long:
    def __init__(self, lat, long, alt):
        self.lat = lat
        self.long = long
        self.alt = alt
    def get_lat(self):
        return self.lat
    def get_long(self):
        return self.long
    def get_alt(self):
        return self.alt
    def __repr__(self):
        return("(lat: " + str(self.lat) +", long: " +str(self.long)+")")

def load_gps_dict(data_dir, gps_file):
    #load the gps locations
    gps_lookup = {}

    gps_file_path = os.path.join(data_dir, gps_file)
    with open(gps_file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',')
        for row in reader:
            image_number = int(row['image_number'])
            latitude = float(row[' latitude'])
            longitude = float(row[' longitude'])
            altitude = float(row[' altitude'])
            coords = lat_long(lat=latitude, long=longitude, alt=altitude)
            gps_lookup[image_number] = coords
    return gps_lookup

def convert_to_grayscale(image_data):
    grayscale_image = np.mean(image_data, axis=-1)
    return grayscale_image

def convert_nparray_to_bytestring(image_data):
    # Convert to binary string image
    img = Image.fromarray(image_data.astype(np.uint8) * 255)
    bytes = img.tobytes()

    # Encode the byte array as a base64 string
    base64_bytes = base64.b64encode(bytes)
    return str(base64_bytes.decode('utf-8'))

def load_pytorch_model(has_cuda, file_name="condition_model.pth", num_classes=5):
    resnet = models.resnet18(weights=None)
    resnet.fc = nn.Linear(resnet.fc.in_features, num_classes)
    if not has_cuda:
        resnet.load_state_dict(torch.load(file_name, map_location=torch.device('cpu')))
    else:
        resnet.load_state_dict(torch.load(file_name))
    # If using GPU, move the model to GPU
    if has_cuda:
        resnet = resnet.cuda()
    resnet.eval()

    # Add simple transfomr, no augmentation, to test
    # Define the necessary image transformations for the ResNet model
    transform = transforms.Compose([
        transforms.Resize(224),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return resnet, transform

def grayscale_to_rgb(image):
    return Image.merge("RGB", (image, image, image))

def Classify_pytorch(author, data_dir, gps_file, Mdate):
    images_added = 0
    labels_map = {
        0 : "bump",
        1 : "crack",
        2 : "plain",
        3 : "pot hole",
        4 : "speed bump"
    }
    has_cuda = torch.cuda.is_available()
    resnet_model, transform = load_pytorch_model(has_cuda)
    database_manager = Data_Manager("tristanbailey","RockyRoadKey2022")
    #load image file's names
    npy_files = [f for f in os.listdir(data_dir) if f.endswith('.npy')]
    #load the csv gps data file
    gps_dict = load_gps_dict(data_dir, gps_file)
    #use regex to extract image_number for gps location lookup
    pattern_img_number = r'_([0-9]+)\.'
    #use regext to isolate camera id, such as left(l), right(r) and back(b)
    pattern_camera_id = r'([a-zA-Z]+)\_'
    
    # Load each .npy file one by one, to process it individually
    total_files = len(npy_files)
    for npy_file in tqdm.tqdm(npy_files, total=total_files):
        camera_id = str(re.search(pattern_camera_id, npy_file).group(1))
        image_number = int(re.search(pattern_img_number, npy_file).group(1))
        #regex for isolatting image number
        file_path = os.path.join(data_dir, npy_file)
        image_data = np.load(file_path)

        #convert image to grayscale
        if image_data.ndim == 3:
            image_data = convert_to_grayscale(image_data)
        # Create a PIL image from the grayscale_image_data
        pil_image = Image.fromarray(np.uint8(image_data), mode='L')

        # Downsample the grayscale image to 224 x 224, for use with ResNet Architecture
        resized_pil_image = pil_image.resize((224, 224), Image.ANTIALIAS)

        three_channel_image = grayscale_to_rgb(resized_pil_image)

        # Apply the transformations to the image
        input_image = transform(three_channel_image)

        # Add an extra dimension for the batch (required by PyTorch models)
        input_image = input_image.unsqueeze(0)

        # Set the model to evaluation mode
        resnet_model.eval()

        # Make a prediction using the ResNet model
        with torch.no_grad():
            prediction = resnet_model(input_image)

        # Get the class index with the highest score
        _, predicted_class = torch.max(prediction, 1)

        # Get the corresponding label from the label map
        road_condition = labels_map[predicted_class.item()]
        if(road_condition != "plain"):
            images_added += 1
            coords = gps_dict[image_number]
            Udate = int(time.time()) #get current time in unix
            #if a condition is present, convert image to base64 encoded byte string
            image_as_byte_string = convert_nparray_to_bytestring(image_data)
            database_manager.add(coords.get_lat(), coords.get_long(), coords.get_alt(),
                        Mdate, Udate, author, road_condition, image_as_byte_string)

    database_manager.push()
    return images_added
    #         img = cv2.imread(os.path.join(dir_path, i))
    #         img = cv2.resize(img, (200, 200))
    #         img = np.transpose(img, (2, 0, 1))
    #         img = torch.from_numpy(img).float()
    #         img.unsqueeze_(0)
    #         outputs = model(img)
    #         val = outputs.detach().numpy()[0][0]
# main guard
if(__name__ == "__main__"):
    #Classify_pytorch("me", "Bag0", "gps.csv", "")
    main()