// Imports needed for this page
import React from 'react';

// Components from other sources
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import { Button, Menu, MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';
import { useMemo, useCallback } from 'react';
import { MenuButton, IconButton } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';

// Files from within our directory
import Map from './Map.js';
import './App.css';
import logo from './images/compressedLogo.png';
import About from './About.js';
import HowTo from './HowTo.js';
import SubmitRequest from './SubmitRequest.js';

// Main Landing Page function by Angel C. Muller
function App () {
  // const variables to manage the navigation to other Pages (/Map)
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(true);
  
  const navigatetoMap = useCallback(() => {
    setShowResults(current => !current);
    navigate('/Map')
  }, [navigate]);

  const navigatetoAbout = useCallback(() => {
    setShowResults(current => !current);
    navigate('/About')
  },[navigate]);

  const navigatetoContact = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSff_rPAGKkdMLYkDDCkXMyrl-wzdikLA3MBAI-2Hr9IW3ktiQ/viewform?usp=sf_link');
  }

  const navigatetoHowTo = useCallback(() => {
    setShowResults(current => !current);
    navigate('/HowTo')
  },[navigate]);

  const memNavigationFunctions = useMemo(() => ({
    navigatetoMap,
    navigatetoAbout,
    navigatetoHowTo
  }), [navigatetoMap, navigatetoAbout, navigatetoHowTo]);

  return (
    <div id='page'>
      {
        // JS for lading page and its Components
        // drawer events from chakra-ui
        showResults && (
          <div id='body'>
            <div id='menu'>
              <Menu>
                <MenuButton as={IconButton} position="absolute" top="2" right="2" aria-label='Options'
                    icon={<HamburgerIcon />} bg='#80cbc4' _hover={{ bg: '#4da5ac' }}></MenuButton>
                  <MenuList minWidth='180px'>
                    <MenuItem onClick = {navigatetoAbout} id='aboutUs'> About </MenuItem>
                    <MenuDivider />
                    {/* <MenuItem onClick = {navigatetoHowTo} id='aboutUs'> Instructions </MenuItem>
                    <MenuDivider /> */}
                    <MenuItem onClick = {navigatetoContact} id='contactUs'> Contact Us </MenuItem>
                  </MenuList>
              </Menu>
            </div>
            <br />
            <h1 id='welcome'> Welcome to Rocky Road Project </h1>
            <br />
            <Introduction />
            
            <Button size='lg' colorScheme='teal' variant='solid' onClick={memNavigationFunctions.navigatetoMap}>
              Start your Journey
            </Button>
            <br/><br/>
          </div>
        )
      }
      <div>
        <Routes>
          <Route path="/Map" element={<Map/>} />
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