import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from './Map.js'
import './App.css';
import logo from './Logo.png'
import { ChakraProvider } from '@chakra-ui/react'
import { Button, ButtonGroup, Wrap, WrapItem } from '@chakra-ui/react'
import { Switch, FormControl, FormLabel, Stack } from '@chakra-ui/react'

// Main class where the React App starts
// Landing Page
class App extends React.Component {
  render () {
    return (
        // Using ChakraProvider for components
        <ChakraProvider>
          <div id='body'>
            <br />
            <br />
            <br />
            <h1 id='welcome'> Welcome to Rocky Road Project </h1>
            <br /><br />
            <Introduction />
            <br /><br />
            <Form />
            <ColorB />
          </div>
        </ChakraProvider>
      )
  }
}

// Displayment of Logo and Intro description of what Rocky Road is about
const Introduction = (props) => {
  return(
    <div>
      <img src={logo} id='Logo'/>
      <br /><br /><br />
      <p> Rocky Road is here to provide useful information that will prevent road based
        inconveniences, injuries, and fatalities.
      </p>
      <p>
      Thank you for joining us in this project.
      </p>
    </div>
  )
}

// Events related to the Button
const Form = (props) => {
  const [mapisShown, setmapIsShown] = useState(false);

  const [homepageShown, sethomepageisShown] = useState(true);
  
  const showMap= event => {
    setmapIsShown(current => !current);
    sethomepageisShown(current => !current);
  };
  
  const navigate = useNavigate();

  const [showResults, setShowResults] = React.useState(true)

  const navigatetoMap = () => {
    setShowResults(current => !current);
    navigate('Map.js')
  }
  
  return(
    <div>
      <Button colorScheme='teal' size='lg' onClick={navigatetoMap}>
        Start your Journey..
      </Button>
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

  return(
    <div id='colorblind'>
      <br />
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='email-alerts' mb='0'>
          Color Blind
        </FormLabel>
        <Switch id='color-blind' size='lg' colorScheme='orange'
        onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}/>

        {isHovering && <p id='auxToggle'>B&W Map option for Color Blind disability</p>}
      </FormControl>
    </div>
  )
}

export default App