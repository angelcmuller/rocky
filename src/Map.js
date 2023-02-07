import JsonListReturn from "./components/recordList";
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
  PopoverCloseButton,
  PopoverBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  AlertDialog,
  Center,
} from '@chakra-ui/react'
import { FaLocationArrow, FaCarAlt,FaTimes,FaCommentAlt, FaCalendar, FaCloud, FaEyeSlash, FaEye, FaBlind, FaServer} from 'react-icons/fa'
import './App.css'
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

  return (
    <Flex  position= 'fixed' height = '100vh' w='100vw' display = 'vertical' color='white'>
      <Center  position = 'relative' h='100' bg='green.500'>
        <Text>Box 1</Text>
      </Center>
      
      <HStack spacing = '0' >
        <Box bg='red' h ='100' w = '20%'> Descriptions</Box>
        
        <div ref={mapContainer} className="map-container" style={{width: 'auto', height: 'auto'}}/>
      </HStack>
    </Flex>
  );
}

export default Map