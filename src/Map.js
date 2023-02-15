import JsonListReturn from "./components/recordList";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  ButtonGroup,
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
} from '@chakra-ui/react'
import { HamburgerIcon, PhoneIcon } from "@chakra-ui/icons";
import { FaLocationArrow, FaCarAlt,FaTimes,FaCommentAlt, FaCalendar, FaCloud, FaEyeSlash, FaEye, FaBlind, FaServer} from 'react-icons/fa'
import './App.css'
import './Map.css'
import { useRef, useState, useMemo, useEffect} from 'react'
import RequestMap from "./Request";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import React from 'react';
import LightPic from './images/Light.svg';
import DarkPic from './images/Dark.svg';
import OutsidePic from './images/Outdoors.svg';
import Streetic from './images/Streets.svg';
import RedMarker from './marker-icons/mapbox-marker-icon-red.svg';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';



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

  //Araon Ramirez Map Loading Procedures Below 

  mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3JvYWR1bnIiLCJhIjoiY2xkbzYzZHduMHFhdTQxbDViM3Q0eHFydSJ9.mDgGzil5_4VS6tFaYSQgPw';

  const mapContainer = useRef(null);
 
  //const map = useRef(null);
  const [lng, setLng] = useState(-119.8138027);
  const [lat, setLat] = useState(39.5296336);
  const [zoom, setZoom] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Initialize Map only once
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12?optimize=true',
      center: [lng, lat],
      zoom: zoom
    });


    const directions = new MapboxDirections({
      accessToken: 'pk.eyJ1Ijoicm9ja3JvYWR1bnIiLCJhIjoiY2xkbzYzZHduMHFhdTQxbDViM3Q0eHFydSJ9.mDgGzil5_4VS6tFaYSQgPw',
      unit: 'metric',
      profile: 'mapbox/driving'
    });

    map.addControl(directions, 'top-left');

    var userInput;
    map.on('click', function(e) {
      // Obtain coordinates on userinput 
      var lngLat = e.lngLat;
      console.log("Longitude: " + lngLat.lng + " Latitude: " + lngLat.lat);
    
      // If previous userinput exists, remove it 
      if (userInput){
        userInput.remove();
      }
    
      // Displaying a made up marker onto map
      var markerSVG = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#ff0000"/></svg>';
      var markerElement = document.createElement('div');
      markerElement.innerHTML = markerSVG;
      userInput = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([ lngLat.lng , lngLat.lat])
        .addTo(map);
    });
    

    
   



    // Adding the FullScreen Control to Map
    map.addControl(new mapboxgl.FullscreenControl());

    // Controlling the Color Blind Modes and changing the Map Styles
    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');
    
    for (const input of inputs) {
      input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
      };
    }

  
    //Gabriel Mortensen Pin Display functions below     
    //Waiting for data from MogoDB 
    result.then(data => {
  
    // Loop through the marker data and create markers
    for (var i = 0; i < data.length; i++) {
      console.log(typeof  data[i].Classification);
      var marker = new mapboxgl.Marker()
        .setLngLat([data[i].Longitude, data[i].Lattitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3  style="color: black; font-size: 18px;"> ' + data[i].Classification + '</h3>'))
        .addTo(map);
    }
  });  

   
    return () => {
      map.remove();
    };
  });





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

  return (
    
    <Flex position= 'fixed' height = '100vh' w='100vw' display = 'vertical' color='white'>
      <Center  position = 'relative'  h='15vh' bg='rgba(185, 222, 203, 100);'>
        <div id="menu">
          <input id="streets-v12" type="radio" name="rtoggle" value="streets"/>
          <label for="streets-v12"> <img src={LightPic} alt="street"/>  <span>Light</span> </label>
          <input id="light-v11" type="radio" name="rtoggle" value="light" />
          <label for="light-v11">   <img src={DarkPic} alt="street"/> <span>Dark</span> </label>
          <input id="dark-v11" type="radio" name="rtoggle" value="dark"/>
          <label for="dark-v11">   <img src={Streetic} alt="street"/> <span>Street</span></label>
          <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors"/>
          <label for="outdoors-v12">   <img src={OutsidePic} alt="street"/> <span>Outdoors</span> </label>
        </div>
        <WithPopoverAnchor/>
        <Menu variant='roundleft'>
          <MenuButton as={IconButton} aria-label='Options'  style={{ backgroundColor: "white" }} icon={<HamburgerIcon />} variant='outline' position='relative' float='right'/>
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
              <MenuItem style={{ color: "black" }}> Request Location </MenuItem>
              <MenuItem style={{ color: "black" }}> Make a Comment </MenuItem>
            </MenuList>
        </Menu> 
      </Center>
      

      {/* Gabriel worked on format of map and description location  */}
      <HStack spacing = '0' > // space between map and description box 
        <Box bg='green.300' h = '100vh' w = '30%'> <p id="Description">Descriptions</p> </Box> // description size 
        
        <div ref={mapContainer} className="map-container" style={{width: '100%', height: '100vh'}}/>

       
      </HStack>

    </Flex>
  );
}

export default Map