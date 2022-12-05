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
    Tag,
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTimes, FaCalendar, FaCloud, FaEyeSlash, FaCommentAlt, FaServer} from 'react-icons/fa'
  import './App.css'
  
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
    InfoWindow,
    DrawingManager,

  } from '@react-google-maps/api'
  import { useRef, useState, useMemo} from 'react'


  //Map center on initialization
  const center = { lat: 39.5437, lng: -119.8142}
  //array for the random markers in the map
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
    },
    {
      id: 5,
      name: "Pin sent through backend",
      position: { lat:  39.55014917660471, lng: -119.80719694373661 }
    }
  ];
  
  function App() {
    const google = window.google;
    //api key
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries: ['places', 'drawing'],
    })
    //Components with state
    const [isShown, setIsShown] = useState(false);
    const [clicks, setClicks] = useState([]);//test
    const [roadLink, setRoadLink] = useState(false);//test
    // markers
    const [activeMarker, setActiveMarker] = useState(null);
  //function to show infowindow on a marker on click
    const handleActiveMarker = (marker) => {
      if (marker === activeMarker) {
        return;
      }
      setActiveMarker(marker);
    };
  
  //Map states and states and components for distance and duration
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
  
    /** @type React.MutableRefObject<HTMLInputElement> */
    //Takes the origin value in the search bar
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    //takes the destination value
    const destRef = useRef()
  //If map doesn't load
    if (!isLoaded) {
      return <SkeletonText />
    }  
    /** 
    let markerPos = { 
      lat: 0, 
      lng: 0}
    const markerClick = event => {
      // 👇️ toggle shown state
      setClicks(current => !current);
      markerPos = {lat: event.latLng.lat, long: event.latLng.long}
      // 👇️ or simply set it to true
      // setIsShown(true);
    };
    */
  //drawing manager
  /** 
    const onLoad = drawingManager => {
        console.log(drawingManager)
      }
      
      const onPolygonComplete = polygon => {
        console.log(polygon)
      }
  */
  //calculate route function
    async function calculateRoute() {
      if (originRef.current.value === '' || destRef.current.value === '') {
        return
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      //render directions
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
    //Clear route button function
    function clearRoute() {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
      originRef.current.value = ''
      destRef.current.value = ''
    }
  
    return (
      //render
      //Flex is the whole screen, acts like a div
      <Flex
        position='relative'
        flexDirection='column'
        alignItems='center'
        h='100vh'
        w='100vw'
      >
      {/*Box or div for the whole map */}
        <Box position= 'absolute' h='100%' w='100%'>
          {/* Google Map Box */}
          {/*Render the map*/}
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              mapId:"d64a5c88eb83dabd"
            }}
            onLoad={map => setMap(map)}
            onClick={(e) => {
              console.log("latitude = ", e.latLng.lat());
              console.log("longtitude = ", e.latLng.lng());
          }}
            >
                <DrawingManager
        options={{
        drawingControl: true,
        drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.MARKER]
        },
      }}
    />
        {/*Render markers around the map*/}
            {markers.map(({ id, name, position }) => (
          <Marker
            key={id}
            position={position}
            onClick={() => handleActiveMarker(id)}
          >
            {/*Change active marker on click and show the infowindow */}
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
                Calculate Route
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
      <MenuItem icon={<FaCommentAlt />} command='⌘D'>
        Add Comment
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
              <Input type='text'placeholder='Insurance Provider' />
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