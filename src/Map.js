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
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes,FaCommentAlt, FaCalendar, FaCloud, FaEyeSlash, FaExclamation, FaStream, FaServer} from 'react-icons/fa'
import './App.css'
 import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
 } from '@react-google-maps/api'
import { useRef, useState, useMemo} from 'react'
 const center = { lat: 39.5437, lng: -119.8142}
const markers = [
  {
    id: 1,
    name: "huge pothole",
    position: { lat: 39.5480, lng: -119.8199 }
  },
  {
    id: 2,
    name: "Big dip in the road",
    position: { lat: 39.5470, lng: -119.8119 }
  },
  {
    id: 3,
    name: "Black Ice",
    position: { lat:  39.5420, lng: -119.8109 }
  },
  {
    id: 4,
    name: "Please check, theres a huge pothol",
    position: { lat:  39.5450, lng: -119.8129 }
  }
];
 function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAoEmPPMmB44ozXVRVb486UMHGiDrMJo64",
    libraries: ['places'],
  })
  const [isShown, setIsShown] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [roadLink, setRoadLink] = useState(false);
  const [isShownComment, setIsShownComment] = useState(false);
 
  const [activeMarker, setActiveMarker] = useState(null);
   const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
   /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destRef = useRef()
  const markerRef = useRef()
   if (!isLoaded) {
    return <SkeletonText />
  } 
  let markerPos = null
  const markerClick = event => {
    // 👇️ toggle shown state
    setClicks(current => !current);
    markerPos = event.latLng
    console.log("latitude = ", event.latLng.lat());
    console.log("longtitude = ", event.latLng.lng());
    console.log(markerPos.lat());
    console.log(markerPos.lng());
    setIsShownComment(current => !current);
    
  };

   async function calculateRoute() {
    if (originRef.current.value === '' || destRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    })
    setDirectionsResponse(results)
    //Need to change this into picking the most optimal route
    setIsShown(current => !current);
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text) 
  }
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destRef.current.value = ''
  }
   return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position= 'absolute' h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            mapId:"d64a5c88eb83dabd"
          }}
          onLoad={map => setMap(map)}
          onClick={markerClick}
          >
          { isShownComment && (
          <Marker
          position={markerPos}
          >
            </Marker>
          )}
          {markers.map(({ id, name, position }) => (
        <Marker
          key={id}
          position={position}
          onClick={() => handleActiveMarker(id)}
        >
          {activeMarker === id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{name}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
          {directionsResponse && (
          <div>
            <DirectionsRenderer
            directions={directionsResponse}
            routeIndex = {0}
             />
             <DirectionsRenderer
            directions={directionsResponse}
            routeIndex = {1}
             />
            </div>
          )}
        </GoogleMap>
      </Box>
      <Box
        position = 'absolute'
        p={2}
        borderRadius='lg'
        m={4}
        bgColor='White'
        shadow='base'
        minW='container.md'
        zIndex='1'
        top={5}
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1} >
            <Autocomplete>
              <Input type='text' placeholder='Origin'ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destRef}
              />
            </Autocomplete>
          </Box>
          <ButtonGroup>
            <Button colorScheme='yellow' type='submit' onClick={calculateRoute} >
              Directions
            </Button>
            <Menu>
            <MenuButton
    as={IconButton}
    aria-label='Options'
    icon={<FaServer/>}
    variant='outline'
  />
    <MenuList>
    <MenuItem icon={<FaLocationArrow />} command='⌘C' onClick = {() => {
              map.panTo(center)
              map.setZoom(15)
            }}>
      Center
    </MenuItem>
    <MenuItem icon={<FaCalendar />} command='⌘D'>
      Date
    </MenuItem>
    <MenuItem icon={<FaCloud />} command='⌘W'>
      Weather
    </MenuItem>
    <MenuItem icon={<FaEyeSlash />} command='⌘H'>
      Hide other user comments
    </MenuItem>
    <MenuItem icon={<FaCommentAlt />} command='⌘C'>
      Add comment
    </MenuItem>
  </MenuList>
           </Menu>
        <Popover>
        <PopoverTrigger>
          <Button colorScheme='gray'>Roadside Assitance</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverBody>
            <p>Please enter your insurance provider</p>
            <Input          type='text'
                placeholder='Insurance Provider' />
            </PopoverBody>
        </PopoverContent>
      </Popover>
          </ButtonGroup>
        </HStack>
      </Box>
      {isShown && (
      <Box
        position = 'absolute'
        p={2}
        borderRadius='lg'
        m={0}
        background = '#000000'
        color =  '#fff'
        shadow='base'
        minW= "sm"
        zIndex='1'
        bottom = {150}
        left = {20}
      >
        <h1>This box only appears when calculate route is clicked </h1>
        <h1>The style on this box needs to be changed </h1>
        <h1>Distance: {distance}</h1>
        <h1>Duration: {duration}</h1>
          <h1>Route Descriptions: </h1>
          <p>The route is blocked by a pothole and your travel time will be</p>
          <img className = "pothole" src = "/pothole.jpeg"
          alt = "pothole"
          height = '100'
          width = '250'
          />
    </Box>
      )}
    </Flex>
   
  )
}
 export default App

