import React from 'react'
import {Route, Link, Routes, useNavigate, redirect} from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import './About.css';
import teampic from './images/IMG_9033-1.jpg';
import UNRpic from './images/UNR.png';
import CollabOne from './images/EmilyHand.jpg';
import CollabTwo from './images/AlirezaTavakkoli.jpg';
import CollabThree from './images/AndySmith.png';


function About() {
    const navigate = useNavigate();
    const goBack = () => {
		navigate(-1);
        document.location.reload();
	}

    return(
        
        <div>
            {/* UNr Logo */}
             <div class="container">
                    <img id='UNRPicture' src={UNRpic}/>
                    <div id="tinyText">
                        <p  class="top-margin"> University of Nevada Reno  </p>
                        <p>Computer Science and Engineering</p>
                        <p>Spring 2023, CS 426</p>
                    </div>
            </div>

            <br/>
          
            {/* Photo and Title */}
            <div>
                <p id='title'> Rocky Road Senior Project</p>
                <img id='groupPicture' src={teampic}/>
                <br/>
                <p id='team'>Team 09</p>
            </div>
            
            {/*Explanation of Project*/}
            <div id='body-margin'>
                <h1 id='meetTeam'> Who Are We? </h1>
               
                <p id='description'> Team 09 "Project Rocky Road" is formed by Computer Science and Engineering
                students from the University of Nevada Reno. At some point in their student life, they
                shared moments in the classroom and ended up creating this team to learn and try to solve
                a real life problem. </p>
                <br/>

                <h1 id='meetTeam'> Description </h1>

                <p id='description'> The goal of project Rocky Road is to present information concerning road
                obstructions in hopes of preventing potential road based inconveniences, injuries, and
                fatalities. Rocky Road will achieve this goal using the distribution of information, through
                a web application, to bring better awareness of road conditions and hazards. Another way the
                project will accomplish its objectives is by informing infrastructure management organizations
                of road conditions to allow them to optimize their approaches to addressing these conditions.
                By making this project open source users will be allowed to contribute to the map, creating a
                global network of road conditions and thus making the world a safer place. In support of this
                goal, the Sierra Nevada Corporation contributed data and personnel resources which act as the
                foundation for this system.</p>
                <br/>


                <h1 id='meetTeam'> Collaborators </h1>
              
                <h2 id="subtopic"> External Collaborators </h2>
                
                <div class="container">
                    
                    <img id='UNRPicture' src={CollabThree}/>
                    <div id="PersonText">
                        <p  class="top-margin"> Dr. Andy Smith   </p>
                    </div>
                    <div id='s_description'>
                        <p>Dr. Smith is a representative of the Sierra Nevada Corporation. Using the company's automous platform for driving, he will be delivering the data the team needs to classify roads within greater nevada. </p>
                    </div>

                    <a href="https://www.sncorp.com/" target="_blank" rel="noopener noreferrer">
                    
                    <br/>
                    
                    <div id = "button1">
                    <Button colorScheme='blue'> SNC Information </Button>
                    </div>
                </a>

                </div>
            
                <br/>    

                <h2 id="subtopic"> Internal Collaborators </h2>
                <div class="container">
                    
                    <img id='UNRPicture' src={CollabOne}/>
                    <div id="PersonText">
                        <p  class="top-margin">   Dr. Emily Hand   </p>
                    </div>
                    <div id='s_description'>
                        <p>Teaching machine learning at the University, Dr. Hand is guiding the team towards considering effective algorithims and deep learning strategies to best classify the set of provided road data. </p>     
                    </div>

                    

                </div>
    
                <br/>
                <br/>     
    
                <div class="container">
                    
                    <img id='UNRPicture' src={CollabTwo}/>
                    <div id="PersonText">
                        <p  class="top-margin">    Dr. Alireza Tavakkol   </p>
                    </div>
                    <div id='s_description'>
                        <p>Experienced in big data, Dr. Tavakkol wil allow team 09 to recieve gudiance on how to optimize the road pin database. </p>
                    </div>

                </div>
              
                <br/>
                <br/>
                <h1 id='meetTeam'> The Team </h1>
                <p id='names'> Aaron Ramirez </p>
                <p id='description'> Aaron's text</p>
                <br/>
                <p id='names'> Angel Carranco Muller </p>
                <p id='description'> Angel Carranco Muller was born and raised in Oaxaca, Mexico. His family business
                was arcade videogame locations throuhout the city which is were he got his love for computers, and digital
                machines. Angel moved to Reno, Nevada in 2013. Here Angel got his Associates in Science at Truckee Meadows
                Community College. He joined the Army to continue his studies and now he is on the right track
                to graduate with a Bachelors in Computer Science and Engineering, with a minor in Mathematics. 
                Angel's interests are now Virtual Reality and Machine Learning amongst others. </p>
                <br/>
                <p id='names'> Gabriel Mortensen </p>
                <p id='description'>Gabriel was born local here in Reno. His hobbies include writing, reading, and going on camping trips. His primary topics of study include machine learning and big data. He hopes to one day use these interests to progress the efficiency of medicine and hospital operations. After this semester Gabriel will continue with school where he will get a master’s degree in CSE in Spring 2024 and an MBA in Spring 2025.</p>
                <br/>
                <p id='names'> Tristan Bailey </p>
                <p id='description'> Tristan's text</p>

            <br/>
            

            <h1 id='meetTeam'> Reasources  </h1>

            <h2 id="subtopic"> Problem Domain Book </h2>
            <p id='book'>Ayyadevara, V., & Reddy, Y. (2020). Modern computer vision with pytorch: Explore deep learning concepts and implement over 50 real-world image applications. Packt Publishing Ltd.
 </p>
            <br/>
            <p id='bookinfo'> This problem domain book will help educate the reader on how to use machine learning techniques to analyze graphical images. The team chose this book because some chapters highlight the use of classifying objects in images, real world application of image processing, and using pytorch to create neural networks which align with the back end architecture of Rocky Road.  </p>

            {/* Go here to finish up website  */}
            https://docs.google.com/document/d/1hVY_aEbbyb14HE31kDm9zVZTlpZMBePLBC01DU3XJWQ/edit#heading=h.wo7dpxtkjo6o

            </div>
            
                <div id='button'>
                    <br/> <br/>
                    <Button colorScheme='pink' onClick={ goBack }>Back</Button>
                    <br/> <br/>
                </div>

            <br/>



        </div>
        
    );
}

export default About
