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

function Submit() {
    const navigate = useNavigate();
    const [showResults, setShowResults] = React.useState(true)
    // const information = get_info(); 

    const navigatetoApp = () => {
        setShowResults(current => !current);
        navigate('/')
        document.location.reload();
      }

    // const get_info = () =>{
    //   const form = document.getElementById("login-form");
    //   form.addEventListener("submit", function(event) {
    //     event.preventDefault();
    //     const username = document.getElementById("username").value;
    //     const password = document.getElementById("password").value;
    //     if (username === "admin" && password === "password") {
    //       alert("Login successful!");
    //     } else {
    //       alert("Login failed. Incorrect username or password.");
    //     }
    //   });
    // }
      

    return(

        

        <form id="login-form">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"/>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"/>
            </div>
            <button type="submit" onClick={ navigatetoApp }>Login</button>
            <button type="submit" onClick={ navigatetoApp }>Back</button>
        </form>
     
      
    );
}

export default Submit
