import JsonListReturn from "./components/recordList";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
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
  AlertDialog,
  Center,
  Radio,
  RadioGroup,
  useBoolean,
} from '@chakra-ui/react'
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaLocationArrow, FaCarAlt,FaTimes,FaCommentAlt, FaCalendar, FaCloud, FaEyeSlash, FaEye, FaBlind, FaServer} from 'react-icons/fa'
import './App.css'
import './Map.css'
import { useRef, useState, useMemo, useEffect} from 'react'
import RequestMap from "./Request";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import React from 'react';

import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

//Developed by Aaron Ramirez and Gabriel Mortensen
// alert(markers)
let x = null;
async function fun(){
  x = await JsonListReturn();
  console.log(x);
  return x;
}
x = fun();
console.log(x);

//Developed by Aaron Ramirez
function Map() {

  mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3JvYWR1bnIiLCJhIjoiY2xkbzYzZHduMHFhdTQxbDViM3Q0eHFydSJ9.mDgGzil5_4VS6tFaYSQgPw';

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-119.8138027);
  const [lat, setLat] = useState(39.5296336);
  const [zoom, setZoom] = useState(8);

  //Initialize Map only once
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12?optimize=true',
      center: [lng, lat],
      zoom: zoom
    });

    map.addControl(new mapboxgl.FullscreenControl());

    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');
    
    for (const input of inputs) {
      input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
      };
    }

    //displaying marker onto map
    const marker = new mapboxgl.Marker()
      .setLngLat([-119.81, 39.529],
        [-119.81, 40], [-119.81, 43],
        [-119.81, 39.529], [-119.81, 39.529])
      .addTo(map);

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
        <HStack>
          <PopoverAnchor>
            <Input
              color={color}
              w='auto'
              display='inline-flex'
              isDisabled={!isEditing}
              defaultValue='Color Blind?'
            />
          </PopoverAnchor>
  
          <PopoverTrigger>
            <Button h='40px' colorScheme='orange'>
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </PopoverTrigger>
        </HStack>
  
        <PopoverContent>
          <PopoverBody>
            Select a new Map Style:
            <RadioGroup value={color} onChange={(newColor) => setColor(newColor)}>
              <Radio value='red'> Streets </Radio>
              <Radio value='blue'> Light </Radio>
              <Radio value='green'> Dark </Radio>
              <Radio value='purple'> outdoors </Radio>
            </RadioGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Flex  position= 'fixed' height = '100vh' w='100vw' display = 'vertical' color='white'>
      <Center  position = 'relative' h='50' bg='green.300'>
        <div id="menu">
          <input id="streets-v12" type="radio" name="rtoggle" value="streets"/>
          <label for="streets-v12"> streets </label>
          <input id="light-v11" type="radio" name="rtoggle" value="light" />
          <label for="light-v11"> light </label>
          <input id="dark-v11" type="radio" name="rtoggle" value="dark"/>
          <label for="dark-v11"> dark </label>
          <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors"/>
          <label for="outdoors-v12"> outdoors </label>
        </div>
        <Text>
          Box1
        </Text>
        <WithPopoverAnchor/>
        <Menu>
          <MenuButton as={IconButton} aria-label='Options' icon={<HamburgerIcon />} variant='outline'/>
            <MenuList>
              <MenuItem> Contact Road Side Assistance </MenuItem>
              <MenuItem> Something else </MenuItem>
              <MenuItem> Make a Comment </MenuItem>
            </MenuList>
        </Menu>
      </Center>
      
      <HStack spacing = '0' >
        <Box bg='red' h ='100' w = '20%'> Descriptions</Box>
        
        <div ref={mapContainer} className="map-container" style={{width: 'auto', height: 'auto'}}/>

      </HStack>
    </Flex>
  );
}

export default Map