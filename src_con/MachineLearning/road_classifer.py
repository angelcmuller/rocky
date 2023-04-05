
# import tensorflow as tf
# from tensorflow import keras
# from tensorflow.keras.preprocessing.image import ImageDataGenerator
# from tensorflow.keras.preprocessing import image
# from tensorflow.keras.optimizers import RMSprop
import numpy as np
import os
from contributor_pins import add_cpin
import time 

import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import cv2
import csv

def main():
    print("Uncomment code in main to run test")
    # Classify("Code_Test", 1239231) 

# Classifies images into categories
# def Classify(author, Mdate):
#     #rescaling image data window as done in youtube tutorial 
#     train = ImageDataGenerator(rescale=1/255)
#     validation = ImageDataGenerator(rescale=1/255)

#     # resize images and assign label
#     # given to neural network 3 images a time (batch size)
#     train_dataset = train.flow_from_directory(
#         'training', target_size=(200, 200), batch_size=3, class_mode='binary')
#     validation_dataset = train.flow_from_directory(
#         'validation', target_size=(200, 200), batch_size=3, class_mode='binary')

#     # make the CNN
#     # need to write how many filters (16) size of those filters (3,3) and activation functoin
#     model = tf.keras.models.Sequential([tf.keras.layers.Conv2D(16, (3, 3), activation='relu', input_shape=(200, 200, 3)), tf.keras.layers.MaxPool2D(2, 2),
#                                         #
#                                         tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(
#                                             200, 200, 3)), tf.keras.layers.MaxPool2D(2, 2),
#                                         #
#                                         tf.keras.layers.Conv2D(64, (3, 3), activation='relu', input_shape=(
#                                             200, 200, 3)), tf.keras.layers.MaxPool2D(2, 2),
#                                         #
#                                         tf.keras.layers.Flatten(),
#                                         #
#                                         tf.keras.layers.Dense(
#         512, activation='relu'),
#         # do softmix for multi classification
#         tf.keras.layers.Dense(
#         1, activation='sigmoid')
#     ])

#     model.compile(loss='binary_crossentropy', optimizer=RMSprop(
#         lr=0.001), metrics=['accuracy'])

#     # train the model
#     model_fit = model.fit(train_dataset, steps_per_epoch=3,
#                           epochs=30, validation_data=validation_dataset)

#     # test the practice data set
#     dir_path = "testing"

#     variable_used_for_waiting = input("Move to next step, adding contributor data: ")
    
#     for i in os.listdir(dir_path):
#         if os.path.isfile(os.path.join(dir_path, i)):
#             img = image.load_img(os.path.join(dir_path, i), target_size=(200, 200, 3))

#         X = image.img_to_array(img)
#         X = np.expand_dims(X, axis=0)
#         images = np.vstack([X])
#         val = model.predict(images)

#         if val == 0:
#             print("Bad road... adding pin to web application")

#             specific_image = str(i)
#             print(i)
#             print(specific_image)
#             # Extract latitude and longitude from string
#             values = specific_image.split("_")[1:3]  # Split string at underscores and take second and third elements
#             lng = float(values[1].split(".")[0])  # Convert longitude string to float, ignoring file extension
#             lat = float(values[0])
#             Udate = int(time.time()) #get current time in unix 
#             classification = "Bad Rode (Binary Classification)" #obtain current classification 
#             add_cpin(classification, lat, lng, Mdate, Udate, author)

            
#         else:
#             print("Good road :)")

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
    def __init__(self, lat, long):
        self.lat = lat
        self.long = long
    def lat(self):
        return self.lat
    def long(self):
        return self.long
    def str(self):
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
            coords = lat_long(lat=latitude, long=longitude)
            gps_lookup[image_number] = coords
    return gps_lookup

def tes_load_gps_dict():
    gps_lookup = load_gps_dict(data_dir, gps_file)

    for key, value in gps_lookup.items():
        print(str(key)+" "+value.str())

def Classify_pytorch(author, data_dir, gps_file, Mdate):

    # variable_used_for_waiting = input("Move to next step, adding contributor data: ")

    # for i in os.listdir(dir_path):
    #     if os.path.isfile(os.path.join(dir_path, i)):
    #         img = cv2.imread(os.path.join(dir_path, i))
    #         img = cv2.resize(img, (200, 200))
    #         img = np.transpose(img, (2, 0, 1))
    #         img = torch.from_numpy(img).float()
    #         img.unsqueeze_(0)
    #         outputs = model(img)
    #         val = outputs.detach().numpy()[0][0]

            # main guard
if __name__ == "__main__":
    Classify_pytorch("me", "data", "gps.csv", "")
    #main()
