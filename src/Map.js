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
} from '@chakra-ui/react'
import { FaLocationArrow, FaCarAlt,FaTimes,FaCommentAlt, FaCalendar, FaCloud, FaEyeSlash, FaEye, FaBlind, FaServer} from 'react-icons/fa'
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
import RequestMap from "./Request";
const center = { lat: 39.5437, lng: -119.8142}


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
  let mapIDx = "f7844d0f315f8d35";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAoEmPPMmB44ozXVRVb486UMHGiDrMJo64",
    libraries: ['places'],
  })
  const [isShown, setIsShown] = useState(false);
  const [isShownComment, setIsShownComment] = useState(false);
  const [markerPosition, setmarkerpos] = useState();
  const [addCommentbtn, setcommentbtn] = useState(false);
  const [commentWindow, setcommentwindow] = useState(false);
  const [showRequest, setRequestMap] = useState(false);
  const [colorBlind, setColorBlind] = useState('f7844d0f315f8d35');

  
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
    if(addCommentbtn){
      console.log(addCommentbtn);
      markerPos = event.latLng
      console.log("latitude = ", event.latLng.lat());
      console.log("longtitude = ", event.latLng.lng());
      console.log(markerPos.lat());
      console.log(markerPos.lng());
      setmarkerpos(event.latLng);
      setIsShownComment(current => !current);
      setcommentbtn(false);
    }
  };
  const commentMarkerWindow= event => {
    // 👇️ toggle shown state
    setcommentwindow(current => !current);
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
  const showRequestMap = event => {
    setRequestMap(current => !current);

  }
  const changeMap = event => {
    mapIDx = "735a32cd73f3a468";
    setColorBlind("735a32cd73f3a468");
    console.log(colorBlind);
    console.log(mapIDx);

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

      {/* Developed by Aaron Ramirez*/}
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          tilt={45} 
          key = {changeMap}
          options={{
            mapId: {colorBlind}
          }}
          onLoad={map => setMap(map)}
          onClick={markerClick}
          >
          { isShownComment &&(
            
          <Marker
          position={markerPosition}
          onClick = {commentMarkerWindow}
          icon = {{
            url: './comment.png',
            scaledSize:  new window.google.maps.Size(30,30)
          }}
          >
            { commentWindow &&(
              <InfoWindow>
                <p>This is a comment</p>
              </InfoWindow>

            )}

          </Marker>

          )}
          {/* Developed by Aaron Ramirez and Gabriel Mortensen*/}
{x.map(({ Pid, Classification, Lattitude, Longitude}) => (
        <Marker
          key={Pid}
          position = {new window.google.maps.LatLng(parseFloat(Lattitude),parseFloat(Longitude))}
          onClick={() => handleActiveMarker(Pid)}
          icon = {{
            url: './marker.png',
            scaledSize:  new window.google.maps.Size(30,30)
          }}
        >
          {activeMarker === Pid ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{Classification}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
      {/* Developed by Aaron Ramirez using tutorials from Leigh Halliday*/}
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
        { showRequest && (
        <RequestMap/>
        )
        }
      </Box>
      <Box
        position = 'absolute'
        p={2}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
        top={5}
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1} >
            <Autocomplete>
              <Input type='text'color='teal' backgroundColor='white' placeholder='Origin'ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                color='teal'
                backgroundColor='white'
                ref={destRef}
              />
            </Autocomplete>
          </Box>
          <ButtonGroup>
            <Button colorScheme='yellow' type='submit' onClick={calculateRoute} >
              Directions
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              color='teal'
              onClick={clearRoute}
            />
            <IconButton
              aria-label='center back'
              icon={<FaEye />}
              onClick={changeMap}
            />
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
    <MenuItem icon={<FaCalendar />} command='⌘D' type="datetime-local">
      Date
    </MenuItem>
    <MenuItem icon={<FaCloud />} command='⌘W'>
      Weather
    </MenuItem>
    <MenuItem icon={<FaCarAlt />} command='⌘W' onClick = {showRequestMap}>
     Request Service Location
    </MenuItem>
    <MenuItem icon={<FaEyeSlash />} command='⌘H'>
      Hide other user comments
    </MenuItem>
    <MenuItem icon={<FaCommentAlt />} command='⌘C'  onClick = {() => {
              setcommentbtn(true);
            }} >
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
 export default Map