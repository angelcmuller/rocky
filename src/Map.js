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


import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3JvYWR1bnIiLCJhIjoiY2xkbzYzZHduMHFhdTQxbDViM3Q0eHFydSJ9.mDgGzil5_4VS6tFaYSQgPw';

const center = { lat: 39.5439, lng: -119.8142}


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

 const mapContainer = useRef(null);
const map = useRef(null);
const [lng, setLng] = useState(-70.9);
const [lat, setLat] = useState(42.35);
const [zoom, setZoom] = useState(9);
 
useEffect(() => {
if (map.current) return; // initialize map only once
map.current = new mapboxgl.Map({
container: mapContainer.current,
style: 'mapbox://styles/mapbox/streets-v12',
center: [lng, lat],
zoom: zoom
});
});
 
useEffect(() => {
if (!map.current) return; // wait for map to initialize
map.current.on('move', () => {
setLng(map.current.getCenter().lng.toFixed(4));
setLat(map.current.getCenter().lat.toFixed(4));
setZoom(map.current.getZoom().toFixed(2));
});
});
 
return (
<Flex  position= 'fixed' height = '100vh' w='100vw' display = 'vertical' color='white'>
    <Center  position = 'relative' h='100' bg='green.500'>
      <Text>Box 1</Text>
    </Center>
      <HStack spacing = '0' >
      <Box bg='red' h ='100' w = '20%'> Descriptions</Box>
      
       <div ref={mapContainer} className="map-container" />
      
      </HStack>
</Flex>
);
}
 export default Map