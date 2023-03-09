
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.preprocessing import image
from tensorflow.keras.optimizers import RMSprop
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os
from MachineLearning.contributor_pins import add_cpin

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
    dir_path = input("Please enter the path of the file containing your testing information: ")

    for i in os.listdir(dir_path):
        img = image.load_img(dir_path + '\\' + i, target_size=(200, 200, 3))
        
        X = image.img_to_array(img)
        X = np.expand_dims(X, axis=0)
        images = np.vstack([X])
        val = model.predict(images)
        if val == 0:
            print("Bad road... adding pin to web application")
                        
            # Extract latitude and longitude from string
            values = img.split("_")[1:3]  # Split string at underscores and take second and third elements
            lat = float(values[0])  # Convert latitude string to float
            lng = float(values[1])  # Convert longitude string to float
            Udate = int(time.time()) #get current time in unix 
            classification = "Bad Rode (Binary Classification)" #obtain current classification 
            add_cpin(classification, lat, lng, Mdate, Udate, author)
            
        else:
            print("Good road :)")