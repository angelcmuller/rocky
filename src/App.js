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
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaCalendar, FaCloud, FaEyeSlash } from 'react-icons/fa'
import './App.css'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: 39.5437, lng: -119.8142}

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAoEmPPMmB44ozXVRVb486UMHGiDrMJo64",
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

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
      <Box position= 'absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            mapId:"d64a5c88eb83dabd"
          }}
          onLoad={map => setMap(map)}
        >
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
            <Button colorScheme='yellow' type='submit' onClick={calculateRoute}>
              Directions
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />

            <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isSquare
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
          {/* need to add a calendar function here */}
          <IconButton
            aria-label='change date'
            icon={<FaCalendar />}
            isSquare
            onClick={Input}
          />
          <IconButton
            aria-label='check weather'
            icon={<FaCloud />}
            isSquare
            onClick={Input}
          />
          {/* need to add a calendar function here */}
          <IconButton
            aria-label='hide other user comments'
            icon={<FaEyeSlash />}
            isSquare
            onClick={Input}
          />

          </ButtonGroup>
        </HStack> 
      </Box>
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
    </Flex>
    
  )
}

export default App