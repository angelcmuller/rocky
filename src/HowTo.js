import React from 'react';
import {Route, Link, Routes, useNavigate, redirect} from 'react-router-dom';
import { Heading, Box, Text, Button, Center, Progress } from '@chakra-ui/react';
import { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import App from './App';

function HowTo() {
    const navigate = useNavigate();
    const [showResults, setShowResults] = React.useState(true)

    const navigatetoApp = () => {
        setShowResults(current => !current);
        navigate('/')
        document.location.reload();
    }

    // Functions to handle the progress of the tutorial
    const [tabIndex, setTabIndex] = useState(0)
    const handleSliderChange = (event) => {
        setTabIndex(parseInt(event.target.value, 10))
    }
    
    const handleTabsChange = (index) => {
        setTabIndex(index)
    }

    return (
        <div>
            <br/><br/>
            <Center>
            <Box maxW='100rem' padding='6' boxShadow='lg' bg='white' textAlign='center'>
                <Heading mb={5} fontSize='50px' fontFamily='serif' font> How to Use Rocky Road </Heading>
                <Tabs index={tabIndex} onChange={handleTabsChange}>
                    <TabList>
                    <Tab> Routing to Destination </Tab>
                    <Tab> Make a Comment </Tab>
                    <Tab> Request a Location Scan </Tab>
                    </TabList>
                    <TabPanels>
                    <TabPanel>
                        <p> Explanation of how Routing will work. </p>
                    </TabPanel>
                    <TabPanel>
                        <p> Explanation of how a user can make a Comment. </p>
                    </TabPanel>
                    <TabPanel>
                        <p> Explanation of how to request a Scan. </p>
                    </TabPanel>
                    </TabPanels>
                </Tabs>
                <br/>
                <Button colorScheme='green' onClick={ navigatetoApp } > Back </Button>
                <br/><br/>
                <Progress size='xs' colorScheme='green' type='range' min='0' max='2' value={tabIndex} onChange={handleSliderChange}/>
            </Box>
            </Center>
            <div>
                <Routes>
                    <Route path="/App" element={<App/>} />
                </Routes>
            </div>
        </div>
    );
}

export default HowTo;