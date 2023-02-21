import React from 'react';
import {Route, Link, Routes, useNavigate, redirect} from 'react-router-dom';
import { Heading, Box, Text, Button, Center, VStack, HStack,
        StackDivider, Checkbox, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import App from './App';

function SubmitRequest() {

    //navigate hook to help navigate to (/) the landing page
    const navigate = useNavigate();
    const [showResults, setShowResults] = React.useState(true)

    const navigatetoApp = () => {
        setShowResults(current => !current);
        navigate('/')
        document.location.reload();
    }
    
    // variables that will be saved in a form to be sent out to Database
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState(null);

    // checking if checkbox is checked
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      };

    // Handle Submit event to make sure fields are filled out as needed
    const handleSubmit = (event) => {
        event.preventDefault();

        // Check whether the user has checked the checkbox
        if (!isChecked) {
            alert('Please check the box before submitting!');
            return;
        }
    
        // Do something else if the checkbox is checked
        alert('Checkbox is checked!');

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("file", file);

        console.log(formData)

        // Call API to send user data to database
    };

    // Function to handle the type of file submited by user
    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
    
        if (selectedFile.type === 'video/mp4') {
          console.log('Selected file is an MP4 video file.');
        } else if (selectedFile.type === 'text/csv') {
          console.log('Selected file is a CSV file.');
        } else {
          console.log('Selected file is not an MP4 or CSV file.');
          return;
        }
      }

  return (
    <div>
        <br/><br/>
        <Center>
        <Box maxW='50rem' padding='6' boxShadow='lg' bg='white' textAlign='center'>
            <Heading mb={5} fontSize='50px' fontFamily='serif' font> Submit Request Data Scan </Heading>
            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                align='stretch'
                >
                <Text fontSize='2xl'> Fill in required fields to submit Data Scan Request request </Text>
                <Center>
                    <FormControl isRequired>
                        <Checkbox colorScheme='red' alignContent='center' ml={100} mr={100} bg='gray.100' checked={isChecked} onChange={handleCheckboxChange}>
                            <FormLabel>
                                Note: When checking this box, user understands that the media will be studied and processed
                                to help with the development of this application with the sole purpose of improving
                                its accuracy and performance. 
                            </FormLabel>
                        </Checkbox>
                    </FormControl>
                </Center>
                <HStack spacing='25px'>
                    <FormControl isRequired>
                        <FormLabel> User Name </FormLabel>
                        <Input placeholder='UserName' size='md' value={name} onChange={(e) => setName(e.target.value)}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel> Email </FormLabel>
                        <Input placeholder='Email' size='md' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </FormControl> 
                </HStack>
                <HStack>
                    <FormControl isRequired>
                        <FormLabel> CSV/MP4 File Required </FormLabel>
                        <Input placeholder='CSV/MP4 File Required' type="file" onChange={handleFileChange} />
                    </FormControl>
                </HStack>
            </VStack>
            <br/>
            <Button colorScheme='orange' type="submit" onClick={handleSubmit}> Submit </Button> <a/> <a/> <a/>
            <Button colorScheme='green' onClick={ navigatetoApp } > Back </Button>
            <br/><br/>
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

export default SubmitRequest