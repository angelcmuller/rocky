// Imports needed for this page
import React from 'react';
// Components from other sources
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { useState } from 'react';
// Files from within our directory
import Map from './Map.js';
import './App.css';
import logo from './images/Logo.png';


// Main Landing Page function
function App () {
  // const variables to manage the navigation to other Pages (/Map)
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(true)
  const navigatetoMap = () =>{
    setShowResults(current => !current);
    navigate('/Map')
  }

  return (
    <div>
      {
        showResults && (
          <div id='body'>
            <br />
            <br />
            <h1 id='welcome'> Welcome to Rocky Road Project </h1>
            <br /><br />
            <Introduction />
            <br /><br />
            <Button size='lg' colorScheme='teal' variant='solid' onClick = {navigatetoMap}>
              Start your Journey
            </Button>
            <ColorB />
          </div>
        )
      }
      <div>
        <Routes>
          <Route path=":Map" element={<Map/>} />
        </Routes>
      </div>
    </div>
  );
}

// Displayment of Logo and Intro description of what Rocky Road is about
const Introduction = (props) => {
  return(
    <div>
      <img src={logo} id='Logo' alt='rockylogo'/>
      <br />
      <br />
      <p id='introtext'> Rocky Road is here to provide useful information
        that will prevent road based inconveniences, injuries, and fatalities.
        Thank you for joining us in this project.
      </p>
    </div>
  )
}

// Color Blind switch and events related to it
const ColorB = (props) => {
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    setIsHovering(true);
  }

  const handleMouseOut = () => {
    setIsHovering(false);
  }
  const setMapID = () =>{
    let mapID = '735a32cd73f3a468'
  

  }

  return(
    <div id='colorblind'>
      <br />
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='email-alerts' mb='0'>
          Color Blind
        </FormLabel>
        <Switch id='color-blind' size='lg' colorScheme='orange'
        onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onChange = {setMapID}/>

        {isHovering && <p id='auxToggle'>B&W Map option for Color Blind disability</p>}
      </FormControl>
    </div>
  )
}

export default App;