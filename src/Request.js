import JsonListReturn from "./components/recordList";
import {
 FormControl,
 FormLabel,
 FormErrorMessage,
 FormHelperText,
 Input,
 Button,
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
function RequestMap(){
    const [addCommentbtn, setcommentbtn] = useState(false);
    const [markerPosition, setmarkerpos] = useState();
    const [isShownComment, setIsShownComment] = useState(false);
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
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAoEmPPMmB44ozXVRVb486UMHGiDrMJo64",
        libraries: ['places'],
      })
      const [map, setMap] = useState(/** @type google.maps.Map */ (null))

    return(
    <div className="container">
      <div className="controls">
      <h1>Service Request Form</h1>
      <h2>Please fill out this form as well as add a marker on the map on to notify us about the location that you wish to be serviced.</h2>
    <FormControl color = 'white' >
    <FormLabel>Description</FormLabel>
    <Input fill = 'white' colorScheme='blue' size= 'lg' type='text' />
    <FormHelperText>Please describe the area.</FormHelperText>
    </FormControl>
    <Button colorScheme='Gray' onClick = {markerClick}>Add Marker</Button>
        </div>
        <div className="map">
        <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              mapId:"f7844d0f315f8d35"
            }}
            onLoad={map => setMap(map)}
            onClick={markerClick}
          mapContainerClassName="map-container"
        >
        { isShownComment &&(
            
            <Marker
            position={markerPosition}>
            </Marker>
  
            )}
        </GoogleMap>
        </div>
        </div>



    )
}
export default RequestMap