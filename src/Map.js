import JsonListReturn from "./components/recordList";
import { LogMongo } from "./components/Log";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  PopoverAnchor,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  Center,
  Radio,
  RadioGroup,
  useBoolean,
  useDisclosure
} from '@chakra-ui/react'; 
import { HamburgerIcon, PhoneIcon, ChatIcon } from "@chakra-ui/icons";
import { FaLocationArrow, FaCarAlt,FaTimes,FaCommentAlt, FaCalendar, FaCloud, FaEyeSlash, FaEye, FaBlind, FaServer} from 'react-icons/fa'
import './App.css'
import './Map.css'
import { useRef, useState, useMemo, useEffect} from 'react'
import RequestMap from "./Request";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import React from 'react';
import LightPic from './images/Satellite.png';
import DarkPic from './images/Dark.svg';
import OutsidePic from './images/Outdoors.png';
import Streetic from './images/darkMode2.png';
import RedMarker from './marker-icons/mapbox-marker-icon-red.svg';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
var UserLat; 
var UserLng; 
var userInput; //used for comments and requests
//Developed by Aaron Ramirez and Gabriel Mortensen

  //This function returns records from the MongoDB database 
  async function MongoRecords() {
    const example = await JsonListReturn();
    return example;
  }
  
//assign full JSON results from MongoDB to result variable 
const result = MongoRecords();
  
//Developed by Aaron Ramirez & Gabriel Mortensen 
function Map() {

  //Araon Ramirez Map Loading Procedures Belo
  mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3JvYWR1bnIiLCJhIjoiY2xkbzYzZHduMHFhdTQxbDViM3Q0eHFydSJ9.mDgGzil5_4VS6tFaYSQgPw';

  const mapContainer = useRef(null);
 
  //const map = useRef(null);
  //sets start to RENO area
  const [lng, setLng] = useState(-119.8138027);
  const [lat, setLat] = useState(39.5296336);
  const [zoom, setZoom] = useState(12);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const [ReqName, setReqName] = useState("Request Location");
  const [ComName, setComName] = useState("Make a Comment");
  const [requestState, setRState] = useState(false);
  const [commentState, setCState] = useState(false);

  function LimitFunctionality(Name){
    if (commentState === false && requestState === true ){
      Toggle("Request")
    }
    else if (requestState === false && commentState === true ){
      Toggle("Comment")
    }        
  }
  
  function Toggle(Name){
    //If request button pressed toggle 
    if(Name === "Request"){
      setRState(!requestState);
      if (ReqName === "Request Location") {
        setReqName("Turn off Request");
        //Turn of comment if activated
        if (commentState) {
          setCState(false);
          setComName("Make a Comment");
        }
      } else {
        setReqName("Request Location");
      }
    }
    //Engage comment functionality 
    else{
      setCState(!commentState);
      if (ComName === "Make a Comment") {
        setComName("Disregard Comment");
      } else {
        setComName("Make a Comment");
      }
      //Turn off request if activated
      if (requestState) {
        setRState(false);
        setReqName("Request Location");
      }
    }
  };

  useEffect(() => {
    //Initialize the Map with current lng and lat
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12?optimize=true',
      center: [lng, lat],
      zoom: zoom
    });
     // Creates new directions control instance
     const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
    });

    // Integrates directions control with map
    map.addControl(directions, 'top-left');
  
    // Adding Source and Layer onto the map
    // to display live traffic lines for congestion areas
    map.on('load', () => {
      map.addSource('traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1'
      });
  
      map.addLayer({
        id: 'traffic-layer',
        type: 'line',
        source: 'traffic',
        'source-layer': 'traffic',
        paint: {
          'line-color': [
            'interpolate',
            ['linear'],
            ['get', 'density'],
            0, 'rgb(0, 255, 0)', // No traffic
            0.2, 'rgb(150, 255, 0)',
            0.3, 'rgb(255, 255, 0)',
            0.6, 'rgb(255, 150, 0)',
            0.8, 'rgb(255, 0, 0)',
            1, 'rgb(150, 0, 0)' // Worst traffic
          ],
          'line-width': 1
        }
      });
    });
  
    // Adding Source and Layer onto the map
    // to display live traffic lines for congestion areas
    map.on('load', () => {
      map.addSource('traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1'
      });
  
      map.addLayer({
        id: 'traffic-layer',
        type: 'line',
        source: 'traffic',
        'source-layer': 'traffic',
        paint: {
          'line-color': [
            'interpolate',
            ['linear'],
            ['get', 'density'],
            0, 'rgb(0, 255, 0)', // No traffic
            0.2, 'rgb(150, 255, 0)',
            0.3, 'rgb(255, 255, 0)',
            0.6, 'rgb(255, 150, 0)',
            0.8, 'rgb(255, 0, 0)',
            1, 'rgb(150, 0, 0)' // Worst traffic
          ],
          'line-width': 1
        }
      });
    });
  
    // Adding the FullScreen Control to Map
    map.addControl(new mapboxgl.FullscreenControl());
  
    // Adding NavigationControl to Map
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-right');
  
    // Controlling the Color Blind Modes and changing the Map Styles
    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');
  
    for (const input of inputs) {
      input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
      };
    }

    //This function returns records from the MongoDB database
    async function MongoRecords(link) {
      const pinInfo = await JsonListReturn(link);
      return pinInfo
    }

    //Gabriel Mortensen Pin Display functions below 
    //Waiting for data from MogoDB
    //Uses the result variable 
    async function displayMarkers() {
      // Wait for data from MongoDB
      const [pinData, commentData] = await Promise.all([MongoRecords(`http://localhost:3000/record/`), MongoRecords(`http://localhost:3000/crecord/`)]);

      // Angel C. Muller loop through the marker data and create markers
      // depending on the classification of road deficiency
      for (let i = 0; i < pinData.length; i++) {
        let markerColor = '#f5c7f7'; // Default color
        if (pinData[i].Classification === 'loose surface' || pinData[i].Classification === 'speed divit' || pinData[i].Classification === 'tar snake') {
          markerColor = '#fcff82'; // Set color for a specific description
        } else if (pinData[i].Classification === 'worn road' || pinData[i].Classification === 'pothole') {
          markerColor = '#dc2f2f'; // Set color for another specific description
        }

        const marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([pinData[i].Longitude, pinData[i].Lattitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 style="color: black; font-size: 18px;">${pinData[i].Classification}</h3>`))
          .addTo(map);

          // Hover over pins and see immediate information
          marker.getElement().addEventListener('mouseover', () => {
            marker.togglePopup();
          });
        
          marker.getElement().addEventListener('mouseout', () => {
            marker.togglePopup();
          });
      }
    
      for (let i = 0; i < commentData.length; i++) {
        const marker = new mapboxgl.Marker({ color: '#e7eaf6' })
          .setLngLat([commentData[i].Lng, commentData[i].Lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 style="color: black; font-size: 18px;">${commentData[i].Comment}</h3><p style="color: gray; font-size: 14px;">by ${commentData[i].User}</p>`))
          .addTo(map);
      }
    }

    // Function to add event listener for marking pins
    function addPinListener() {
      map.on('click', function(e) {
        // Obtain coordinates on user input 
        var lngLat = e.lngLat;
    
        // If previous user input exists, remove it 
        if (userInput) {
          userInput.remove();
        }

        // Add a title to the marker if commentState is true
        userInput = new mapboxgl.Marker({
          color: (commentState ? '#006400' : '#ff0000')
          }).setLngLat([lngLat.lng, lngLat.lat])
          .addTo(map);

        UserLng = lngLat.lng;
        UserLat = lngLat.lat;
      });
    }

    // Call functions to display markers and add pin listener
    displayMarkers();
    if (requestState || commentState) {
      addPinListener();
    }
  
    return () => {
      map.remove();
    };
  }, [requestState, commentState]);

  //function to select Map Style Angel C. Muller
  function WithPopoverAnchor() {
    const [isEditing, setIsEditing] = useBoolean()
    const [color, setColor] = React.useState('')

    return (
      <Popover
        isOpen={isEditing}
        onOpen={setIsEditing.on}
        onClose={setIsEditing.off}
        closeOnBlur={false}
        isLazy
        lazyBehavior='keepMounted'
      >
  
        <PopoverContent>
          <PopoverBody  bg='gray'>
            Select a new Map Style:
            <RadioGroup value={color} onChange={(newColor) => setColor(newColor)}>
              <Radio value='streets' id='streets-v12' colorScheme='orange'> Streets </Radio>
              <Radio value='light' id='light-v11'> Light </Radio>
              <Radio value='dark' id='dark-v11'> Dark </Radio>
              <Radio value='outdoors' id='outdoors-v12'> outdoors </Radio>
            </RadioGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }
  

// Function sends comment or request to database  
function SendUserInfo(){

  // if no coordinates selected do nothing
  if (typeof UserLat === 'undefined' || typeof UserLng === 'undefined' ) {
    if(requestState){
      alert("Please click on map to select area to scan.")
    }
    else{
      alert("Please click on map to select area to comment.")  
    }
  } 
  // otherwise....
  else {
    //turn text box info into a string 
    const Element = document.getElementById("input");
    const inputString = Element.value.toString();

    //submit data to MongoDB
    console.log('map.js rstate:', typeof requestState)
    LogMongo(requestState, "auto", inputString, UserLat, UserLng );
    
    // Reset text box and toggle off request 
    Element.value = "";

    if(requestState){
      Toggle("Request")
    }
    else{
      Toggle("Comment")
    }
  }
}

  // Comment functionality 
  function commentFunctionality(){
    // if no coordinates selected do nothing
    if (typeof UserLat === 'undefined' || typeof UserLng === 'undefined' ) {
      alert("Please click on map to select area to comment.")
    } 
    // otherwise....
    else {

      //turn text box info into a string 
      const RequestElement = document.getElementById("input");
      const requestString = RequestElement.value.toString();

      //submit data to MongoDB
      LogMongo("auto", requestString, UserLat, UserLng );
      
      // Reset text box and toggle off request 
      RequestElement.value = "";
      Toggle("Request")
    }
  }


  return (
    
    <Flex position= 'fixed' height = '100vh' w='100vw' display = 'vertical' color='white'>
      <Flex  position=""  h='13vh' bg='#31C4AE'>
        {/* Menu for dispaly options */}
        <div id="menu">
          <input id="satellite-streets-v12" type="radio" name="rtoggle" value="streets"/>
          <label for="satellite-streets-v12"> <img src={LightPic} alt="street"/>  <span> Satellite </span> </label>
          <input id="dark-v11" type="radio" name="rtoggle" value="dark"/>
          <label for="dark-v11">   <img src={Streetic} alt="street"/> <span> &nbsp;Dark </span></label>
          <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors"/>
          <label for="outdoors-v12">   <img src={OutsidePic} alt="street"/> <span> Outdoors </span> </label>
        </div>

        {/* Request Location Buttons  */}
        <Button colorScheme={requestState ? 'orange' : 'blue'} position='absolute' mt={5} right='260' onClick={() => Toggle("Request")}>
          {ReqName}
        </Button>

        <Button colorScheme={commentState ? 'orange' : 'blue'} position='absolute' mt={5} right='90' onClick={() => Toggle("Comment")} > 
          {ComName}
        </Button>


        {/* Hamburger Menu  */}
        <WithPopoverAnchor style={{display: "flex"}}/>
        <Menu variant='roundleft' _hover={{ bg: "gray.100" }}>
          <MenuButton as={IconButton} position="absolute" top="5" right="10" aria-label='Options'icon={<HamburgerIcon />} variant='outline'
          style={{ backgroundColor: "#0964ed"}}/>
            <MenuList>
              <MenuItem onClick={onOpen} style={{ color: "black" }}> Contact Road Side Assistance </MenuItem>
                <Modal isOpen={isOpen} onClose={onClose} useInert='false'>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader> Road Assistance </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Accordion defaultIndex={[0]} allowMultiple>
                      <AccordionItem>
                     

                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                AAA
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={10}>
                            <a>800-400-4222 </a>
                            <a href="tel:8004004222" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});">
                            <IconButton
                                colorScheme='teal'
                                aria-label='Call Segun'
                                size='sm'
                                icon={<PhoneIcon />}
                                href="tel:+8004004222"
                              />
                              </a>
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                Progressive
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={10}>
                            <a>800-776-4737 </a>
                            <a href="tel:8007764737" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});">
                            <IconButton
                                colorScheme='teal'
                                aria-label='Call Segun'
                                size='sm'
                                icon={<PhoneIcon />}
                                href="tel:+8007764737"
                              />
                              </a>
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                StateFarm
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={10}>
                            <a>855-259-8568 </a>
                            <a href="tel:5558920234" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});">
                            <IconButton
                                colorScheme='teal'
                                aria-label='Call Segun'
                                size='sm'
                                icon={<PhoneIcon />}
                                href="tel:+8552598568"
                              />
                              </a>
                          </AccordionPanel>
                          <br/>
                          <h2>Type your insurance below to do a Google Search:</h2>
                        <form action="https://www.google.com/search?q=phone+number+">
                          <input type="text" name="q"/>
                          <input type="submit" value="Google Search"/>
                        </form>
                        </AccordionItem>
                      </Accordion>
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
            </MenuList>
        </Menu> 
        <br/>
      </Flex>
      

      {/* Gabriel worked on format of map and description location  */}
      <HStack spacing = '0' > // space between map and description box 
        <Box bg='green.300' h = '100vh' w = '30%'  display='flex' flexDirection='column'  alignItems='center'>
          
          {/* Description box title  */}
          <p id="Description">Descriptions</p>
        
        {/* Is visable only when user turns on Request */}
        {(requestState || commentState) ? (
          <Box bg='white' h = '40%' w = '90%'  display='flex' flexDirection='column'  alignItems='center'>
           
            {/* User text box that appears when user clicks scan request */}
            <label for="input" class="black-text">
            {requestState ? 'Request Reason' : 'Comment Reason'}
            </label>
            
            <input type="text" id="input" class="stretch-box black-text" />
            
            <br/>
            {/* Makes Submit Location Button appear when Request is on (Chat GPT) */}
          
              <Button colorScheme='purple' mr={3} onClick={SendUserInfo}>
                Submit 
              </Button>
          </Box>
         ) : null}


        </Box> // description size 
        
        <div ref={mapContainer} className="map-container" style={{width: '100%', height: '100vh'}}/>

       
      </HStack>

    </Flex>
  );
}

export default Map