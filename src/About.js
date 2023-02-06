import React from 'react'
import {Route, Link, Routes, useNavigate, redirect} from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import './About.css';
import teampic from './images/IMG_9033-1.jpg';

function About() {
    const navigate = useNavigate();
    const goBack = () => {
		navigate(-1);
        document.location.reload();
	}

    return(
        <div>
            <div>
                {/* Page Title */}
                <br/>
                <p id='title'> Rocky Road Project </p>
                <p id='team'> Team 09 </p>
                <br/>
            </div>
                <img id='groupPicture' src={teampic}/>
                <br/>
                <br/>
            <div>
            {/* Body */}
            <div id='body-margin'>
                <h1 id='meetTeam'> About Us </h1>
                <p id='description'> Team 09 "Project Rocky Road" is formed by Computer Science and Engineering
                students from the University of Nevada Reno. At some point in their student life, they
                shared moments in the classroom and ended up creating this team to learn and try to solve
                a real life problem. </p>
                <br/>
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
                <h1 id='meetTeam'> Collaboration </h1>
                <p id='description'> Team Rocky Road proudly announces its collaboration with Sierra Nevada
                Corporation - SNC. Dr. Andy Smith has helped the team with incredible amounts of data used 
                for clasifying road videos and images. </p>
                <br/>
                <a id='button1' href="https://www.sncorp.com/" target="_blank" rel="noopener noreferrer">
                    <Button colorScheme='cyan'> Go to sncorp.com </Button>
                </a>
                <br/><br/>
                <h1 id='meetTeam'> Meet the Team </h1>
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
                <p id='description'> Gabriel's text</p>
                <br/>
                <p id='names'> Tristan Bailey </p>
                <p id='description'> Tristan's text</p>
            </div>
            </div>
            <div id='button'>
                <br/> <br/>
                <Button colorScheme='pink' onClick={ goBack }>Back</Button>
                <br/> <br/>
            </div>
        </div>
        
    );
}

export default About
