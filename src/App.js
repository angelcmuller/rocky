// Imports needed for this page
import React from 'react';
// Components from other sources
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { useState } from 'react';
import { Sling as Hamburger } from 'hamburger-react'
import { useDisclosure } from '@chakra-ui/react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
// Files from within our directory
import Map from './Map.js';
import './App.css';
import logo from './images/Logo.png';
import About from './About.js';

// Main Landing Page function by Angel C. Muller
function App () {
  // const variables to manage the navigation to other Pages (/Map)
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(true)
  const navigatetoMap = () => {
    setShowResults(current => !current);
    navigate('/Map')
  }

  const navigatetoAbout = () => {
    setShowResults(current => !current);
    navigate('/About')
  }

  const navigatetoContact = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSff_rPAGKkdMLYkDDCkXMyrl-wzdikLA3MBAI-2Hr9IW3ktiQ/viewform?usp=sf_link');
  }

  // const variable to manage the collapsible menu
  const { isOpen, onOpen, onClose} = useDisclosure()
  const [placement, setPlacement] = React.useState('right')
  const [setOpen] = useState(false)

  return (
    <div>
      {
        // JS for lading page and its Components
        // Used the burger menu from https://hamburger-react.netlify.app/
        // and the drawer events from chakra-ui
        showResults && (
          <div id='body'>
            <div id='menu'>
              <Hamburger onToggle={onOpen} size={30} direction="right"
              duration={0.5} distance="lg" color="#008151" easing="ease-in"
              rounded label='Show Menu'/>
              <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                  <DrawerHeader borderBottomWidth='2px' id='menuSettings'> Menu </DrawerHeader>
                  <DrawerBody id='menuSettings2'>
                    <p onClick = {navigatetoAbout} id='aboutUs'> About </p>
                    <p onClick = {navigatetoContact} id='contactUs'> Contact Us </p>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </div>
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
          <Route path="/Map" element={<Map/>} />
          <Route path="/About" element={<About/>} />
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
      <p id='introtext'>
        Rocky Road is here to provide useful information
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

export default App;