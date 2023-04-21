// Imports needed for this page
import React from 'react';
// Components from other sources
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import { Button, Menu, MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react'
import {
  MenuButton,
  IconButton
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';

// Files from within our directory
import './App.css';
import logo from './images/Logo.png';
import About from './About.js';
import HowTo from './HowTo.js';
import SubmitRequest from './SubmitRequest.js';

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

  const navigatetoSubmitRequest = () => {
    setShowResults(current => !current);
    navigate('/SubmitRequest')
  }

  const navigatetoHowTo = () => {
    setShowResults(current => !current);
    navigate('/HowTo')
  }

  // const variable to manage the collapsible menu
  const { isOpen, onOpen, onClose} = useDisclosure()
  const [placement, setPlacement] = React.useState('right')
  const [setOpen] = useState(false)

  return (
    <div id='page'>
      {
        // JS for lading page and its Components
        // drawer events from chakra-ui
        showResults && (
          <div id='body'>
            <div id='menu'>
              <Menu>
                <MenuButton as={IconButton} position="absolute" top="2" right="2" aria-label='Options' icon={<HamburgerIcon />} bg='#80cbc4'></MenuButton>
                  <MenuList minWidth='180px'>
                    <MenuItem onClick = {navigatetoAbout} id='aboutUs'> About </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick = {navigatetoHowTo} id='aboutUs'> Instructions </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick = {navigatetoContact} id='contactUs'> Contact Us </MenuItem>
                  </MenuList>
              </Menu>
            </div>
            <br />
            <h1 id='welcome'> Welcome to Rocky Road Project </h1>
            <br />
            <Introduction />
            
            <Button size='lg' colorScheme='teal' variant='solid'>
              Start your Journey
            </Button>
            <br/><br/>
          </div>
        )
      }
      <div>
        <Routes>
          {/* <Route path="/Map" element={<Map/>} /> */}
          <Route path="/About" element={<About/>} />
          <Route path="/SubmitRequest" element={<SubmitRequest/>} />
          <Route path="/HowTo" element={<HowTo/>} />
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
    </div>
  )
}

export default App;