import React from 'react'
import {Route, Link, Routes, useNavigate, redirect} from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import './About.css';
import teampic from './images/IMG_9033-1.jpg';
import UNRpic from './images/UNR.png';
import CollabOne from './images/EmilyHand.jpg';
import CollabTwo from './images/AlirezaTavakkoli.jpg';
import CollabThree from './images/AndySmith.png';

import App from './App';

function About() {
    const navigate = useNavigate();
    const [showResults, setShowResults] = React.useState(true)

    const navigatetoApp = () => {
        setShowResults(current => !current);
        navigate('/')
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
            <p id='book'>Ayyadevara, V., & Reddy, Y. (2020). Modern computer vision with pytorch: Explore deep learning concepts and implement over 50 real-world image applications. Packt Publishing Ltd.</p>
            <br/>
            <p id='bookinfo'> This problem domain book will help educate the reader on how to use machine learning techniques to analyze graphical images. The team chose this book because some chapters highlight the use of classifying objects in images, real world application of image processing, and using pytorch to create neural networks which align with the back end architecture of Rocky Road.  </p>

            <br/>

            <h2 id="subtopic"> Websites </h2>
            <a id='booklink'  href="https://www.transportation.gov/briefing-room/fhwa-delivers-largest-federal-highway-apportionment-decades-part-bipartisan"> <u> Federal Department of U.S Transportation </u> </a>
            <br/>
            <p id='bookinfo'> This is a website article from the Federal Department of U.S Transportation. The article elaborates on how funding to improve road infrastructure in 2022 will be larger than that of 2021 due to the passing of the Bipartisan Infrastructure Law. Funds used by this law are directed towards improving the safety and stability of road health.  </p>
           
            <br/>

            <a id='booklink'  href="https://www.dot.state.wy.us/files/live/sites/wydot/files/shared/Highway_Safety/_Crash%20Data/Publications/Report%20on%20Traffic%20Crashes/Report%20on%20Traffic%20Crashes%202021.pdf "> <u>  State of Wyoming Report </u> </a>
            <br/>
            <p id='bookinfo'>  This website article is a report about traffic crashes in 2021 in the state of Wyoming. More specifically on page 70 there is a report about fatalities and injuries caused by faulty road conditions. This information serves as an example of how severe road conditions can be to individuals on the road.   </p>

            <br/>

            <a id='booklink'  href="https://aaafoundation.org/wp-content/uploads/2021/04/21-1101-AAAFTS-American-Driving-Survey-Fact-Sheet_v3.pdf   "> <u>  AAA Insurance Report  </u> </a>
            <br/>
            <p id='bookinfo'>  This website article is a survey made by the AAA insurance company to update their understanding and better calibrate future predictions for traffic risks. In this report it is noted that most of the respondents spent roughly an hour behind the wheel every day. This information is important for this report as it may indicate what the typical target audience may be like.    </p>

            <br/>

            <a id='booklink'  href="https://www.statefarm.com/simple-insights/auto-and-vehicles/the-winter-hazard-nobody-sees-coming-black-ice  "> <u> State Farm Report  </u> </a>
            <br/>
            <p id='bookinfo'>  This website article is from the State Farm insurance agency. This article goes into detail of what black ice is and how drivers can avoid mishaps on the road when black ice is present. This information is useful because it details how dangerous black ice can be and supports the rationale for it being added as a potential object in project Rocky Road.  </p>

            <br/>

            <h2 id="subtopic"> Research Publications </h2>
            <p id='book'>G. B. R., C. C., S. B. Rao M., S. M., K. E. and S. J., "Deep Learning Based Pothole Detection and Reporting System," 2020 7th International Conference on Smart Structures and Systems (ICSSS), 2020, pp. 1-6, doi: 10.1109/ICSSS49621.2020.9202061. </p>
            <br/>
            <p id='bookinfo'> This research publication is an IEEE work that details using convolutional neural networks to detect potholes in the road. More specifically, the paper mentions how Kirchoff's theory and the k-nearest neighbor algorithm were used to validate the data obtained from the neural network. This information is important for this project because it provides the team with more information of which algorithms could be utilized to best test and validate the data.  </p>

            <br/>

            <p id='book'>Khan, M. N., & Ahmed, M. M. (2022). Weather and surface condition detection based on road-side webcams: Application of pre-trained Convolutional Neural Network. International Journal of Transportation Science and Technology, 11(3), 468–483. https://doi.org/10.1016/j.ijtst.2021.06.003  </p>
            <br/>
            <p id='bookinfo'> This research publication concerns the detection of weather elements pertaining to both the road and the actual forecast (weather conditions) of the area. The team focused on predicting “dry, snowy and wet/slushy” roads using a convolutional neural network. Ultimately this research was established to optimize information on route time destinations and improve the efficiency of road service companies or “maintenance vehicles”. This publication is important to this project because it proposes one method of machine learning the team can utilize to analyze road patterns. </p> 

            <br/>

            <p id='book'>Dong, D., & Li, Z. (2021). Smartphone sensing of road surface condition and defect detection. Sensors, 21(16), 5433. https://doi.org/10.3390/s21165433  </p>
            <br/>
            <p id='bookinfo'>In this research publication the authors gathered information from GPS and accelerometer sensors in smartphones to quickly gather vast amounts of driving data. From this they utilized power spectral density analysis along with k-means anomaly detection to determine road surface conditions, in Ireland, with an update granularity of a few hours. They achieved an accuracy rating of 84% with this machine learning approach. This information is useful because it provides the team with new algorithm ideas for implementation.  </p> 




            {/* Return home button  */}
            </div>
            <div id='button'>
                <br/> <br/>
                <Button colorScheme='pink' onClick={ navigatetoApp }>Back</Button>
                <br/> <br/>
            </div>
            <div>
                <Routes>
                    <Route path="/App" element={<App/>} />
                </Routes>
            </div>
        </div>
        
    );
}

export default About
