// Files and CSS imports
import JsonListReturn from "./components/recordList";
import { LogMongo } from "./components/Log";
import { Route } from "./Routing.js";
import { Like } from "./like_dislike.js";
import { GrabImage } from "./image_grabber.js";
import MapboxTraffic from "./mapbox-gl-traffic.js";
import './App.css';
import './Map.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import "./mapbox-gl-traffic.css";

// Components imports
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Button, Flex, HStack, Heading,
  IconButton, Input, Text, Menu, MenuButton, MenuList, MenuItem, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Radio, RadioGroup, Switch, useDisclosure,
  Divider, Image, Tooltip, VStack, Checkbox, Select, Stack } from '@chakra-ui/react'; 
import { HamburgerIcon, PhoneIcon, SettingsIcon } from "@chakra-ui/icons";

// React imports
import './App.css';
import './Map.css';
//import { displayMarkers, markerClicked, markers} from "./DisplayMarkers";
import { BrowserRouter as Router, useNavigate, Routes, useLinkClickHandler } from 'react-router-dom';
import { useRef, useState, useEffect} from 'react';
import React from 'react';

// Images imports
import LightPic from './images/Satellite.png';
import OutsidePic from './images/Outdoors.png';
import Streetic from './images/darkMode2.png';
import Logo from './images/compressedLogo.png';
import RedPin from './images/red.png';
import PurplePin from './images/purple.png';
import BluePin from './images/blue.png';
import GreenPin from './images/green.png';

// Mapbox imports
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import { cyan } from "@mui/material/colors";
import * as turf from '@turf/turf';
import { object_filter } from "./Object_Filter";

//node --harmony-top-level-await map.js
// import Swal from 'sweetalert2';
var markerClicked = false
export var markers = [] // Array to store markers currently on the map

// Used to store lattitude and Longitud
//radius_global: in miles
var radius_global = 5
var comment_bool = false

var UserLat; 
var UserLng; 
// Used for comments and requests
var userInput;
// Used to display Directions API
var directions = createDirections();
// Used to store Mapbox theme
var mapStyle = 'mapbox://styles/mapbox/outdoors-v12?optimize=true';
// Used to check if the DescriptionBox is displayed on screen
var boxState = false;

//================================
// Used for pinCoordinatesforInfoDisplay
var pinCoordinatesForInfoDisplayLong;
var pinCoordinatesForInfoDisplayLat;
var pinSource; 
var pinAlt;
var pinClass;
var DataLinkImage; 
var pinMdate;
var pinUdate;
//================================
var comment_request_pinListener;
// Used to store the index of the pin from above pin for further display
var thisIsTheOne;

// Used to check if button Comment/Request are being used



// Boolean to check if button Comment/Request are being used
var buttonCommentRequest = false;

async function MongoRecords(link) {
  const pinInfo = await JsonListReturn(link);
  return pinInfo
}

// Loop through the markers array and add each marker to the map
//Author: Tristan Bailey
export function displayMarkers(map, markers_list = markers){
  markers_list.forEach((marker) => {
    marker.addTo(map);
  });
}
export function removeMarkers(map) {
  markers.forEach(marker => {
    marker.remove();
  });
  markers = [];
}

//Author: Tristan Bailey
var radius_layer = {}
function activateRadius(longitude, lattitude){
  const center = [longitude, lattitude];
   // Use Turf.js to create a circle with the given radius in meters.
   const circle = turf.circle(center, radius_global * 1609.34, {
    steps: 100,
    units: 'meters'
  });
  radius_layer = {
    id: 'circle-layer',
    type: 'fill',
    source: {
      type: 'geojson',
      data: circle
    },
    paint: {
      'fill-color': '#007cbf',
      'fill-opacity': 0.6
    }
  };
}
//Author: Tristan Bailey
function displayRadius(map) {
  if (Object.keys(radius_layer).length !== 0) {
    map.addLayer(radius_layer);
  }
}

//Author: Tristan Bailey
export function deactivateRadius(map) {
  if (map.getLayer(radius_layer.id)) {
    map.removeLayer(radius_layer.id);
  }
}

async function addMarkers(pinData, commentData, map, pinInformation, setPinInformation) {
  // Remove all existing markers from the map
  markers.forEach(marker => marker.remove());
  markers = [];
  await appendMarkers(pinData, commentData, map, pinInformation, setPinInformation);
}
//Gabriel Mortensen Pin Display functions below
//Waiting for data from MogoDB
//Uses the result variable 
export async function appendMarkers(pinData, commentData, map, pinInformation, setPinInformation) {
  //const commentData = await MongoRecords(`http://localhost:3000/crecord/`);
  //const ContributData = await MongoRecords(`http://localhost:3000/conrecord/`);
  //var pinData = await MongoRecords(`http://localhost:3000/record/`);
  //console.log(pinData)
  // Gabriel Mortensen & Angel C. Muller loop through the marker data and create marker colors 
  // depending on the classification of road deficiency
  for (let i = 0; i < pinData.length; i++) {
    let markerColor = '#f5c7f7'; // Default color
      if (pinData[i].Classification === 'bump') {
      markerColor = '#17588a'; // Set color for a specific description
      }
      if (pinData[i].Classification === 'crack' ) {
      markerColor = '#137d1f'; // Set color for another specific description
      }
      if (pinData[i].Classification === 'pot hole' ) {
      markerColor = '#8f130a'; // Set color for another specific description
      }
      if (pinData[i].Classification === 'speed bump' ) {
      markerColor = '#86178a'; // Set color for another specific description
      }

       // Define popup content HTML
    const popupContent = `
    <div class="popup-content">
      <div class="close-button-container">
        <button class="close-button"></button>
      </div>
      <h1 style="color:black; font-size:18px; text-align:center; font-weight: bold">Description <br/>"${pinData[i].Classification}"<br /><br />
      <h3 class="popup-button open-info" style="color:white; font-size: 15px; text-align:center"><button id="more-info-btn" style="text-decoration:underline">See more Information</button></h3>
    </div>`;

    const marker = new mapboxgl.Marker({ color: markerColor })
    .setLngLat([pinData[i].Longitude, pinData[i].Lattitude])
    .setPopup(new mapboxgl.Popup({ offset: 25, closeOnClick: true, closeButton: false })
    .setHTML(popupContent));

      const moreInfoButton = marker._popup._content.querySelector('#more-info-btn');
      moreInfoButton.addEventListener('click', function() {
          setPinInformation(true);
          console.log("HERE", pinInformation);
          pinCoordinatesForInfoDisplayLong = pinData[i].Longitude;
          pinCoordinatesForInfoDisplayLat = pinData[i].Lattitude;
          pinSource = pinData[i].Source;
          pinClass= pinData[i].Classification;
          pinMdate = pinData[i].MeasurementDate;
          pinUdate = pinData[i].UploadDate;
          pinAlt = pinData[i].Altitude;
          DataLinkImage = pinData[i].Img_ObjectId; 
          thisIsTheOne = i;

          console.log(pinCoordinatesForInfoDisplayLong, pinCoordinatesForInfoDisplayLat, thisIsTheOne, pinInformation);
          console.log("Funtimes: " + DataLinkImage);
          // pinInformation_global =  pinInformation 
      });
      // Add event listener for the custom close button
      const closeButton = marker._popup._content.querySelector('.close-button');
      closeButton.addEventListener('click', () => {
        marker.getPopup().remove();
      });

      // add click listener to marker
      marker.getElement().addEventListener('click', () => {
          markerClicked = true;
      });

      // 'hover' over pins and see immediate information - changed it to 'click'
      marker.getElement().addEventListener('click', () => {
          marker.togglePopup();
      });
      markers.push(marker)
      // marker.getElement().addEventListener('click', () => {
      //   marker.togglePopup();
      // });
  }
  for (let i = 0; i < commentData.length; i++) {
  const commentPopupContent = `
    <div class="popup-content">
      <div class="close-button-container">
        <button class="close-button"></button>
      </div>
      <h3 style="color: black; font-size: 18px;">${commentData[i].Comment}</h3>
      <p style="color: gray; font-size: 14px;">by ${commentData[i].User}</p>
      <div class="popup-buttons-container">
        <button id="like-btn-${i}" class="popup-button display-button">Like</button>
        <button id="dislike-btn-${i}" class="popup-button display-button">Dislike</button>
      </div>
    </div>`;

  const marker = new mapboxgl.Marker({ color: '#e7eaf6' })
    .setLngLat([commentData[i].Longitude, commentData[i].Lattitude])
    .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false })
      .setHTML(commentPopupContent));

  // Add event listener for the custom close button
  const commentCloseButton = marker._popup._content.querySelector('.close-button');
  commentCloseButton.addEventListener('click', () => {
    marker.getPopup().remove();
  });

  // ... (rest of the code remains unchanged)
  
  marker.getElement().addEventListener('click', () => {
    markerClicked = true;
  });

  // add click listener to marker
  marker.getElement().addEventListener('click', () => {
    marker.togglePopup();

    // add click listeners to like/dislike buttons
    const likeBtn = document.getElementById(`like-btn-${i}`);
    const dislikeBtn = document.getElementById(`dislike-btn-${i}`);

    likeBtn.addEventListener('click', () => {
      const { lng, lat } = marker.getLngLat();
      const value = 1; // user clicked "like"
      Like(lat, lng, value); 
    });

    dislikeBtn.addEventListener('click', () => {
      const { lng, lat } = marker.getLngLat();
      const value = -1; // user clicked "dislike"
      Like(lat, lng, value); 
    });
    //need to add one:true to keep pop up from liking multiple times in one click
  }, { once: true });
  
  // add the marker to the markers array
  markers.push(marker);
}

}

//Author: Tristan Bailey
async function getInRadius(longitude, lattitude, collection, radius ){
  const url = `http://localhost:3000/inradius?longitude=${longitude}&latitude=${lattitude}&radius=${radius}&collection=${collection}`;
  const pins = await MongoRecords(url);
  return pins
}

// Create a function to create the Mapbox Directions object
function createDirections() {
  return new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'imperial',
    profile: 'mapbox/driving',
    interactive: false,
    alternatives: 'true',
    controls: {
      instructions: true
    }
  });
}

var pinData;
var commentData;

async function init_data(){
  var [pinData, commentData] = await Promise.all([MongoRecords(`http://localhost:3000/record/`), MongoRecords(`http://localhost:3000/crecord/`)]);
  return [pinData, commentData]
}
//Developed by Aaron Ramirez & Gabriel Mortensen 
function Map() {
  //Araon Ramirez Map Loading Procedures Belo
  mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3JvYWR1bnIiLCJhIjoiY2xkbzYzZHduMHFhdTQxbDViM3Q0eHFydSJ9.mDgGzil5_4VS6tFaYSQgPw';

  const mapContainer = useRef(null);
  
  // const variables to manage the navigation to other Pages (/Map)
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(true);
  const [pinInfo, setPinInfo] = useState([]);

  const [isRouteChecked, setIsRouteChecked] = useState(false);
  const [isCommentChecked, setIsCommentChecked] = useState(false);
  // State handlers for the checkboxes in Features in Settings Menu
  const [isBumpChecked, setIsBumpChecked] = useState(true);
  const [isSpeedBumpChecked, setIsSpeedBumpChecked] = useState(true);
  const [isCrackChecked, setIsCrackChecked] = useState(true);
  const [isPotholeChecked, setIsPotholeChecked] = useState(true);
  const [isOtherChecked, setIsOtherChecked] = useState(true);
  // State handler for the Select dropdown from Settings Menu
  const [selectedPriority, setSelectedPriority] = useState('');

  //const map = useRef(null);
  //sets start to RENO area
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [zoom, setZoom] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  const [ReqName, setReqName] = useState("Request Location");
  const [ComName, setComName] = useState("Make a Comment");
  const [requestState, setRState] = useState(false);
  const [commentState, setCState] = useState(false);
  const [pinRadiusState, setPinRadiusState] = useState(false);
  const [routeState, setRouteState] = useState(true);
  const [pinInformation, setPinInformation] = useState(false);
  
  // Used to navigate to the Home Page
  const navigatetoLandPage = () => {
    setShowResults(current => !current);
    navigate('/')
    document.location.reload();
  }

  //This function returns records from the MongoDB database
  useEffect(() => {
    async function getPinInfo() {
      const pinInfo = await JsonListReturn('http://localhost:3000/record/');
      setPinInfo(pinInfo);
    }

    getPinInfo();
  }, []);

  // Using cache to reload the previous page from the browser's back button
  useEffect(() => {
    const handlePopstate = () => {
        window.location.reload();
    }
    window.addEventListener('popstate', handlePopstate);

    return () => {
        window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  // function LimitFunctionality(Name){
  //   if (commentState === false && requestState === true ){
  //     Toggle("Request")
  //   }
  //   else if (requestState === false && commentState === true ){
  //     Toggle("Comment")
  //   }        
  // }

  function convertUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return formattedDate;
}

  
  function Toggle(Name){
    setRouteState(false);
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
        setRouteState(true);
        setIsRVisible(false);
        setIsRequestChecked(false);
        setSelectedOption('');
        setConditionOption('');
      }
    }
    //Engage comment functionality 
    else if(Name === "Comment") {
      console.log("CommentState", commentState);
      setCState(!commentState);
      if (ComName === "Make a Comment") {
        setComName("Disregard Comment");
        buttonCommentRequest = false;
        console.log('button has been changed to ', buttonCommentRequest);
      } else {
        setComName("Make a Comment");
        setRouteState(true);
        setIsCVisible(false);
        setIsCommentChecked(false);
        setSelectedOption('');
        setConditionOption('');
      }
      //Turn off request if activated
      if (requestState) {
        setRState(false);
        setReqName("Request Location");
      }
    } else if(Name === "Radius Display"){
      console.log("PinStatebefore", pinRadiusState);
      setPinRadiusState(!pinRadiusState);
    }
  };

  // useEffect to retrieve the user's location with .getCurrentPosition() method
  // and it updates the lng and lat to set the map center to these coordinates
  // if questions ask Angel
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLng(position.coords.longitude);
          setLat(position.coords.latitude);
          setLocationAvailable(true);
        },
        () => {
          console.error('Unable to retrieve your location');
          setLocationAvailable(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setLocationAvailable(false);
    }
  }, []);
  
  // useEffect that verifies if user allows the geolocation
  // to center Map instance to their location. Otherwise,
  // it centers in Reno Downtown
  useEffect(() => {
    if (!locationAvailable) {
      setLng(-119.8114); // longitude of Reno downtown
      setLat(39.5296); // latitude of Reno downtown
    }
  }, [locationAvailable]);

  useEffect(() => {
    //Initialize the Map with current lng and lat
    if(lng && lat){
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [lng, lat],
        zoom: zoom
      });
      if (isRouteChecked){
        const dirs = createDirections();

        map.addControl(dirs, 'top-left');
        map.on('load', () => {

          removeMarkers(map, markers);
          deactivateRadius(map);
          radius_layer = {}
          //use to display input boxes if in routing mode
            //map.removeControl(directions)
            // console.log("Routing");
            // if(flip){
            //   flip = false;
            //   map.setStyle('mapbox://styles/mapbox/streets-v11');
            // }
            // else{
            //   flip = true;
            //   map.setStyle('mapbox://styles/mapbox/outdoors-v12?optimize=true');
            // }
            //map.setStyle(mapStyle);
            //directions = createDirections();
            //map.addControl(directions, 'top-left');
            // console.log("Routingx2");
            Route(map, dirs, selectedPriority,  isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, isCommentChecked, pinInformation, setPinInformation);
        });
      }
      else{
        map.on('load', () => {
          markers.forEach(marker => {
            marker.remove();
          });
          deactivateRadius(map);
          displayMarkers(map, markers);
          displayRadius(map);
        });
      }

      map.on('styledata', () => {
        //use to display input boxes if in routing mode
        if (routeState === true){

          deactivateRadius(map);
          removeMarkers(map);
          map.removeControl(directions)
          // if(flip){
          //   flip = false;
          //   map.setStyle('mapbox://styles/mapbox/streets-v11');
          // }
          // else{
          //   flip = true;
          //   map.setStyle('mapbox://styles/mapbox/outdoors-v12?optimize=true');
          // }
          map.setStyle(mapStyle);
          //directions = createDirections();
          //map.addControl(directions, 'top-left');
          console.log("style changed");
          //Route(map, dirs,   isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, isCommentChecked, pinInformation, setPinInformation);
        }
      });

      // Add geolocate control to the map to show where the user is located
      map.addControl(new mapboxgl.GeolocateControl({
        fitBoundsOptions: {
          maxZoom: 14
        },
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        circleStyle: {
          fillColor: 'rgba(0, 128, 255, 0.4)',
          strokeColor: 'rgba(0, 128, 255, 0.8)',
          strokeWidth: 4
        },
        markerStyle: {
          color: 'rgb(0, 128, 255)'
        }
      }));
      
      // Adding the FullScreen Control to Map
      map.addControl(new mapboxgl.FullscreenControl());

      // Adding NavigationControl to Map
      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'top-right');

      map.addControl(new MapboxTraffic());

      // Controlling the Color Blind Modes and changing the Map Styles
      const layerList = document.getElementById('menu');
      const inputs = layerList.getElementsByTagName('input');
    
      for (const input of inputs) {
        input.onclick = (layer) => {
          const layerId = layer.target.id;
          map.setStyle('mapbox://styles/mapbox/' + layerId);
          mapStyle = 'mapbox://styles/mapbox/' + layerId;
          console.log("Changed Theme");
        };
      }
      // Like(39.56126011912147, -120.04878396803926 , -1);


      // Function to add event listener for marking pins
      function addPinListener() {
        if(!boxState)
        {
          // If previous user input exists, remove it
          if (userInput) {
            userInput.remove();
          }
          
          // Add a title to the marker if commentState is true
          userInput = new mapboxgl.Marker({
            color: (commentState ? '#19e34e' : '#ff0000')
            })
            .setLngLat([comment_request_pinListener.lng, comment_request_pinListener.lat])
            .addTo(map);
        }
      }
      async function loadData(pinData, commentData) {
        [pinData, commentData] = await init_data();
        // Call functions to display markers and add pin listener
        addMarkers(pinData, commentData, map, pinInformation, setPinInformation);
      }
      //OLD_PIN_LOAD
      //loadData(pinData, commentData);
      //alert(JSON.stringify(pinData, null, 2))
      if (requestState || commentState) {
        addPinListener();
        
        // Checking if the Description Box has been triggered ANGEL C. MULLER
        boxState = true;
        // console.log("Box State", boxState, " and ", comment_request_pinListener);
      } else {
        boxState = false;
        // console.log("Box State changed", boxState);
      }
      if(!isRouteChecked){
      // Add a click event listener to the map
        map.on('click', (e) => {
          var lngLat = e.lngLat;
          comment_request_pinListener = e.lngLat;

          if(!boxState){
            // condition to check if the user clicks anywhere else in the Map but on a marker, popup will show up
            if (!markerClicked) {
              // Define custom close button HTML
              const customCloseButton = '<button type="button" class="close-button" aria-label="Close popup"></button>';

              // Define popup content HTML
              const popupContent = '<div class="popup-content">' +
                '<button id="display-btn" class="popup-button display-button">Display in Radius</button>' +
                '<button id="comment-btn" class="popup-button comment-button">Leave a Comment</button>' +
                '<button id="request-btn" class="popup-button request-button">Make a Request</button>' +
                '</div>';
              
              // Create popup
              const popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: false })
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .setMaxWidth('500px')
                .addTo(map);
              
              // Create custom close button element
              const customCloseButtonEl = document.createElement('div');
              customCloseButtonEl.innerHTML = customCloseButton;
              customCloseButtonEl.classList.add('close-button-container');
              customCloseButtonEl.addEventListener('click', () => {
                popup.remove();
              });
              
              // Append custom close button to popup container element
              popup._content.insertBefore(customCloseButtonEl, popup._content.firstChild);
              
              // Add click event listeners to the buttons
              //Author: Tristan Bailey
              document.getElementById('display-btn').addEventListener('click', () => {
                console.log('Display button clicked');
                Toggle("Radius Display");
                popup.remove();
                var longitude = lngLat.lng;
                var lattitude = lngLat.lat;
                activateRadius(longitude, lattitude);
                var contributorData;
                var commentData;
                const contributorMarkersPromise = getInRadius(longitude, lattitude, 0, radius_global);
                if(comment_bool === false){
                  const commentMarkersPromise = getInRadius(longitude, lattitude, 1, radius_global);
                  Promise.all([commentMarkersPromise, contributorMarkersPromise])
                    .then(([commentDataResult, contributorDataResult]) => {
                      contributorData = contributorDataResult;
                      commentData = commentDataResult;
                      //filter the data appropriately
                      contributorData = object_filter(contributorData, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
                      commentData = object_filter(commentData, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
                      addMarkers(contributorData, commentData, map, pinInformation, setPinInformation)
                        .then((markers) => {
                          console.log("Got Markers");
                        })
                        .catch((error) => {
                          console.error('Error fetching markers:', error);
                        });
                      // Call any other functions that need the data here
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
                else{
                  Promise.all([contributorMarkersPromise])
                    .then(([contributorDataResult]) => {
                      contributorData = contributorDataResult;
                      addMarkers(contributorData, commentData, map, pinInformation, setPinInformation)
                        .then((markers) => {
                          console.log("Got Markers");
                        })
                        .catch((error) => {
                          console.error('Error fetching markers:', error);
                        });
                      // Call any other functions that need the data here
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              });
              //end Author: Tristan Bailey

              document.getElementById('comment-btn').addEventListener('click', () => {
                console.log('Comment button clicked');
                setIsCVisible(true);
                Toggle("Comment");
                popup.remove();
                UserLng = lngLat.lng;
                UserLat = lngLat.lat;
              });
              
              document.getElementById('request-btn').addEventListener('click', () => {
                console.log('Request button clicked');
                setIsRequestChecked(true);
                setIsRVisible(true);
                Toggle("Request");
                popup.remove();
                UserLng = lngLat.lng;
                UserLat = lngLat.lat;
              });
              

            } else {
              // if the user is clicking on an existing Marker, new popup won't be displayed
              markerClicked = false;
            }
          }
        });
      }
    
      return () => {
        map.remove();
      };
    }

    // The dependency array is an optional second argument in the useEffect() hook that allows you
    // to control when the effect runs. It consists of a list of variables that the effect depends on.
    // If any of the variables in the dependency array change, the effect will re-run.

  }, [
    requestState, commentState, lng, lat, pinRadiusState, markers,   isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, isCommentChecked, isRouteChecked, selectedPriority
  ]);
  
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
      const ElementName = document.getElementById("input_name");
      const inputString = Element.value.toString();
      const inputStringName = ElementName.value.toString();
      const conditionsRoad = document.getElementById("conditions");
      const optionsRoad = document.getElementById("options");
      const conditionsRoadString = conditionsRoad.value.toString();
      const optionsRoadString = optionsRoad.value.toString();

      let accepted_input = true

      //if in comment mode check if criteria is filled, if not set state so input not pushed to database 
      if (!requestState){
       
        if (inputStringName.trim().length === 0 || inputString.trim().length === 0 || conditionsRoadString === "" || optionsRoadString === "") {
          // string is blank
          alert("Not all criteria is filled, please try again")
          accepted_input = false
        } 
      }

      //if in request mode check if criteria is filled, if not set state so input not pushed to database 
      if (inputStringName.trim().length === 0 || inputString.trim().length === 0 ) {
        // string is blank
        alert("Not all criteria is filled, please try again")
        accepted_input = false
      } 

      if (accepted_input){

        
        // string is not blank
        //submit data to MongoDB
        console.log('map.js rstate:', typeof requestState)
        LogMongo(requestState, inputStringName, inputString, UserLat, UserLng, conditionsRoadString, optionsRoadString);
      
        // Reset text box and toggle off request 
        Element.value = "";

        if(requestState){
          Toggle("Request")
          boxState = false;
          // Resetting values when Request is submitted
          setSelectedOption('');
          setConditionOption('');
          // console.log("Box State changed", boxState)
        } else if (commentState) {
          Toggle("Comment")
          boxState = false;
          // Resetting values when comment is submitted
          setSelectedOption('');
          setConditionOption('');
          // console.log("Box State changed", boxState)
        } else {
          boxState = false;
        }
      }
    }
  }

  // Comment functionality 
  // function commentFunctionality(){
  //   // if no coordinates selected do nothing
  //   if (typeof UserLat === 'undefined' || typeof UserLng === 'undefined' ) {
  //     alert("Please click on map to select area to comment.")
  //   } 
  //   // otherwise....
  //   else {

  //     //turn text box info into a string 
  //     const RequestElement = document.getElementById("input");
  //     const requestString = RequestElement.value.toString();

  //     //submit data to MongoDB
  //     LogMongo("auto", requestString, UserLat, UserLng );
      
  //     // Reset text box and toggle off request 
  //     RequestElement.value = "";
  //     Toggle("Request")
  //   }
  // }

  // variables to control the states of the comments and requests
  const [isCVisible, setIsCVisible] = useState(false);
  const [isRVisible, setIsRVisible] = useState(false);
  
  // functions that handle the events of the buttons as they
  // are used by the users
  const handleCommentClick = (event) => {
    if(isCommentChecked === false){
      setIsCommentChecked(event.target.checked);
      comment_bool = true;
    } else {
      setIsCommentChecked(false);
      comment_bool = false;
    }
  }
  
  const handleRouteClick = (event) => {
    if(isRouteChecked === false){
      setIsRouteChecked(event.target.checked);
    } else {
      setIsRouteChecked(false);
    }
    markers = [];
    radius_layer = {};
  }

  const handleCheckbox1 = (event) => {
    setIsBumpChecked(event.target.checked);
  }
  const handleCheckbox2 = (event) => {
    setIsSpeedBumpChecked(event.target.checked);
  }
  const handleCheckbox3 = (event) => {
    setIsCrackChecked(event.target.checked);
  }
  const handleCheckbox4 = (event) => {
    setIsPotholeChecked(event.target.checked);
  }
  const handleCheckbox5 = (event) => {
    setIsOtherChecked(event.target.checked);
  }

  const handleSelectedChange = (event) => {
    setSelectedPriority(event.target.value);
  }

  const handleReset = () => {
    setIsRouteChecked(false);
    setIsCommentChecked(false);
    setIsBumpChecked(false);
    setIsSpeedBumpChecked(false);
    setIsCrackChecked(false);
    setIsPotholeChecked(false);
    setIsOtherChecked(false);
    setSelectedPriority('');
    setValue('2');
    radius_global = 2;
  }

  const handleRequestClick = (event) => {
    // condition that allows button to be visible only iff
    // the other button is not being used
    if(isRequestChecked == false){
      setIsRequestChecked(event.target.checked);
      if(isCVisible == false){
        setIsRVisible(true);
      }
    } else {
      setIsRequestChecked(false);
      setIsRVisible(false);
    }
  }

  function NumberSelector() {
  
    return (
      <div>
        <label htmlFor="options"></label>
        <select id="options" value={selectedOption} onChange={handleOptionChange}>
          <option value="">&nbsp; Severity</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
        {/* <p>You selected: {selectedOption}</p> */}
      </div>
    );
  }

  function ConditionSelector() {
  
    return (
      <div>
        <label htmlFor="conditions"></label>
        <select id="conditions" value={selectedConditionOption} onChange={handleConditionChange}>
          <option value="">Type</option>
          <option value="pothole">Pothole</option>
          <option value="crack">Crack</option>
          <option value="speed bump">Speedbump</option>
          <option value="bump">Bump</option>
          <option value="other">Other</option>
        </select>
        {/* <p>You selected: {selectedOption}</p> */}
      </div>
    );
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConditionChange = (event) => {
    setConditionOption(event.target.value);
  };

  // function that handles the displaying of the comments onto the map

  function handleShowCommentClick(){
    const opacity = 0;
    console.log("here")
    setMarkerOpacity(opacity);
    markers.forEach(marker => {
      marker.getElement().style.opacity = opacity;
    });
    console.log("opacity:", opacity);
  }

  function RadioExample() {  
    const temp = (
      <RadioGroup onChange={setValue} value={value}>
        <Stack direction='row' pl='22px' spacing='15px'>
          <Radio value='1' size='sm' colorScheme='teal'>1</Radio>
          <Radio value='5' size='sm' colorScheme='teal'>5</Radio>
          <Radio value='10' size='sm' colorScheme='teal'>10</Radio>
          <Radio value='15' size='sm' colorScheme='teal'>15</Radio>
          <Radio value='20' size='sm' colorScheme='teal'>20</Radio>
          <Radio value='25' size='sm' colorScheme='teal'>25</Radio>
        </Stack>
      </RadioGroup>
    )
    radius_global = value;
    return temp
  }

  // State handlers for the Comment/Request/ShowComments Switches
  const [isRequestChecked, setIsRequestChecked] = useState(false);

  // State handler for the values of the radio buttons
  const [value, setValue] = useState('5');

  // State handlers for the checkboxes in Features in Settings Menu
  const [markerOpacity, setMarkerOpacity] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedConditionOption, setConditionOption] = useState("");


  const ConvertedImages = () => {
    const [imageUrl, setImageUrl] = useState(null);
    
    console.log("Globlal: " + DataLinkImage)
    useEffect(() => {
      GrabImage(DataLinkImage)
        .then((imageData) => setImageUrl(imageData))
        .catch((error) => console.error(error));
    }, [DataLinkImage]);
  
    if (!imageUrl) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        <Text color='red.500' fontSize='12px' pl='10px'>
          Classification: {pinClass}
        </Text>
        <Text color='red.500' fontSize='12px' pl='10px'>
          Source: {pinSource}
        </Text>
        <Image src={imageUrl} />
        <Text color='red.500' fontSize='12px' pl='10px'>
          MeasurementDate: {convertUnixTimestamp(pinMdate)}
        </Text>
        <Text color='red.500' fontSize='12px' pl='10px'>
          UploadDate: {convertUnixTimestamp(pinUdate)}
        </Text>
        <Text color='red.500' fontSize='12px' pl='10px'>
          Lat: {pinCoordinatesForInfoDisplayLat}
        </Text>
        <Text color='red.500' fontSize='12px' pl='10px'>
          Lng: { pinCoordinatesForInfoDisplayLong}
        </Text>
        <Text color='red.500' fontSize='12px' pl='10px'>
          Altitude: {pinAlt}
        </Text>
        <Button colorScheme='cyan' verticalAlign='center' size='lg' mt='10px' mb='15px' onClick={() => setPinInformation(false)}>
          Exit
        </Button>
      </>
    );

  };

  function display_info(display){
    console.log(display)
  }

  return (
    <Flex position= 'fixed' height = '100vh' w='100vw' display='vertical' color='white'>
      <Flex className="flex-container" h='10vh' bg='#05998c'>
        {/* Hamburger Menu  */}
        <HStack spacing='5px' justifyContent='flex-start'>
          <Tooltip label="Project Rocky Road">
            <Image src={ Logo } boxSize='55px' ml='25px' bg='white' borderRadius='full'/>
          </Tooltip>
          <Tooltip label="Settings" hasArrow>
            <Button as={IconButton} icon={<SettingsIcon />} onClick={onSettingsOpen} bg='#0964dd' variant='outline' position='absolute'
                    right='100px' width='45px' _hover={{ bg: '#ff763f' }}/>
          </Tooltip>
            <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} useInert='false' size={'sm'}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> Settings </ModalHeader>
                <ModalCloseButton />
                <Divider/>
                <ModalBody>
                  <HStack spacing='170px'>
                    <Text> Routing Mode </Text>
                    <Switch colorScheme='teal' id='comment-alert' isChecked={isRouteChecked} onChange={handleRouteClick}/>
                  </HStack>
                </ModalBody>
                <Divider/>
                <Divider/>
                <ModalBody>
                  <HStack spacing='170px'>
                    <Text> Hide comments </Text>
                    <Switch colorScheme='teal' id='comment-alert' isChecked={isCommentChecked} onChange={handleCommentClick}/>
                  </HStack>
                </ModalBody>
                <Divider/>
                <ModalBody>
                  <VStack spacing='2px' textAlign='left' align='left'>
                    <Text> Features: </Text>
                    <HStack spacing='230px'>
                      <Text pl='20px'> Bump </Text> <Checkbox size='lg' colorScheme="teal" isChecked={isBumpChecked} onChange={handleCheckbox1}/>
                    </HStack>
                    <HStack spacing='185px'>
                      <Text pl='20px'> Speedbump </Text> <Checkbox size='lg' colorScheme="teal" isChecked={isSpeedBumpChecked} onChange={handleCheckbox2}/>
                    </HStack>
                    <HStack spacing='232px'>
                      <Text pl='20px'> Crack </Text> <Checkbox size='lg' colorScheme="teal" isChecked={isCrackChecked} onChange={handleCheckbox3}/>
                    </HStack>
                    <HStack spacing='217px'>
                      <Text pl='20px'> Pothole </Text> <Checkbox size='lg' colorScheme="teal" isChecked={isPotholeChecked} onChange={handleCheckbox4}/>
                    </HStack>
                    <HStack spacing='230px'>
                      <Text pl='20px'> Other </Text> <Checkbox size='lg' colorScheme="teal" isChecked={isOtherChecked} onChange={handleCheckbox5}/>
                    </HStack>
                  </VStack>
                </ModalBody>
                <Divider/>
                <ModalBody>
                  <HStack spacing='150px'>
                    <Text> Priority </Text>
                    <Select placeholder='None' size='md' style={{width: '140px'}} value={selectedPriority} onChange={handleSelectedChange}>
                      <option value='option1'>Bump</option>
                      <option value='option2'>Pothole</option>
                      <option value='option3'>Speedbump</option>
                    </Select>
                  </HStack>
                </ModalBody>
                <Divider/>
                <ModalBody>
                  <VStack spacing='5px' textAlign='left' align='left'>
                    <Text> Radius Distance (Miles) </Text>
                    <RadioExample />
                  </VStack>
                </ModalBody>
                <Divider/>
                <ModalFooter>
                  <HStack spacing={5}>
                    <Button onClick={handleReset} variant='outline'> Clear All </Button>
                    <Button colorScheme='blue' mr={3} onClick={onSettingsClose}>
                      Close
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          <Menu>
            <Tooltip label='Menu' hasArrow>
              <MenuButton as={IconButton} aria-label='Options'icon={<HamburgerIcon />} variant='outline' position='absolute' right={10}
              bg='#0964ed' _hover={{ bg: '#ff763f' }}/>
            </Tooltip>
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
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              AAA
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={10}>
                            <a>800-400-4222 </a>
                            <a href="tel:8004004222" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});">
                              <IconButton colorScheme='teal' aria-label='Call Segun' size='sm' icon={<PhoneIcon />} href="tel:+8004004222" />
                            </a>
                          </AccordionPanel>
                        </AccordionItem>
                        
                        <AccordionItem>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              Progressive
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={10}>
                            <a>800-776-4737 </a>
                            <a href="tel:8007764737" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});">
                              <IconButton colorScheme='teal' aria-label='Call Segun' size='sm' icon={<PhoneIcon />} href="tel:+8007764737" />
                            </a>
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              StateFarm
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={10}>
                            <a>855-259-8568 </a>
                            <a href="tel:5558920234" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});">
                              <IconButton colorScheme='teal' aria-label='Call Segun' size='sm' icon={<PhoneIcon />} href="tel:+8552598568" />
                            </a>
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                          <br/>
                          <h2>Type your insurance below to do a Google Search:</h2>
                          <form action="https://www.google.com/search?q=phone+number+" target="_blank">
                            <input type="text" name="q" />
                            <input type="submit" value="Google Search" />
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
                {/* <MenuItem style={{ color: "black" }}> Make a Comment &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Switch id='comment-alert' isChecked={isCommentChecked}
                          onChange={handleCommentClick}/> </MenuItem>
                <MenuItem style={{ color: "black" }}> Make a Request &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Switch id='request-alert'
                          isChecked={isRequestChecked} onChange={handleRequestClick}/> </MenuItem> */}
                <MenuItem style={{ color: "black" }} onClick={handleShowCommentClick}> Hide Comments </MenuItem>
                <MenuItem style={{ color: "black" }} onClick={navigatetoLandPage}> Home </MenuItem>
              </MenuList>
          </Menu>
        </HStack>
        
        <br/>
      </Flex>
      
      <Tooltip label='Change Theme' openDelay={300}>
        <Box
          p={1}
          borderRadius='lg'
          m={1}
          height='90px'
          width='250px'
          bgColor='rgba(128, 128, 128, 0.8)'
          shadow='base'
          top='11%'
          left = '40%'
          zIndex='1'
          position = 'absolute'
          border='1px solid orange'
          display='flex'
          justifyContent='center'
          alignItems='center' >
          
          <HStack  spacing = {0} justifyContent='space-between'>
            {/* Menu for dispaly options */}
            <div id="menu">
              <input id="satellite-streets-v12" left ="10" type="radio" name="rtoggle" value="streets"/>
              <label htmlFor="satellite-streets-v12"><img src={LightPic} alt="street"/>   <span> Satellite </span> </label>
              <input id="dark-v11" type="radio" name="rtoggle" value="dark"/>
              <label htmlFor="dark-v11"> <img src={Streetic} alt="street"/> <span> &nbsp;&nbsp;&nbsp; Dark &nbsp;&nbsp;&nbsp; </span></label>
              <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors"/>
              <label htmlFor="outdoors-v12">   <img src={OutsidePic} alt="street"/><span> Outdoors </span> </label>
            </div>
          </HStack>
        </Box>
      </Tooltip>
      
      
      {/* Gabriel worked on format of map and description location  */}
      <div ref={mapContainer} className="map-container" style={{width: '100%', height: '100vh'}}/>
      
      {(pinInformation) ? 
        (
          <Box bg='white' h = '54%' w = '20%'  display='flex' flexDirection='column' position='absolute' borderRadius='10px'
          boxShadow='0px 0px 10px rgba(0, 0, 0, 0.2)' left = '4%' top='35%' overflowY='scroll'
          >
            {/* Add a clear heading */}
            <Heading size='md' mb='10px' textAlign='center' color='blue.500' mt='10px'> Additional Information </Heading>
    
            {/* Used to display information for the pins */}
            <ConvertedImages/> 

          </Box>
        ) : null
      }

      {/* Is visable only when user turns on Request */}
      {(requestState || commentState) ?
        (
          <Box bg='white' h = '60%' w = '20%'  display='flex' flexDirection='column' position='absolute' borderRadius='10px'
          boxShadow='0px 0px 10px rgba(0, 0, 0, 0.2)' left = '4%' top='35%' alignItems='center' >
            
            {/* Add a clear heading */}
            <Heading size='md' mb='11px' textAlign='center' color='blue.500' mt='10px'>Request/Comment Form</Heading>
            
            {/* User text box that appears when user clicks scan request */}
            {/* <label for="input" class="black-text">
            {requestState ? 'Request Reason' : 'Comment Reason'}
            </label> */}

            {/* Use a descriptive placeholder */}
            <label htmlFor='input' className='description-text' textAlign='center'>
              {requestState ? 'Please provide your request' : 'Please leave a comment'}
            </label>

            <Input type='text-description' id='input' className='stretch-box-black-text' w='80%'
            placeholder='Type your comment here' borderRadius='6px' textAlign='center'
            border='1px solid gray' mt='2px' style={{ height: '45px', overflow: 'auto' }}
            maxLength={200} size='10px'/>


            
            <HStack spacing='12px' mt='20px'>
              <ConditionSelector />
              <NumberSelector />
            </HStack>

            {/* Makes Submit Location Button appear when Request is on (Chat GPT) */}
            
            <label htmlFor='input_name' className='description-text' textAlign='center' style={{ marginTop: '15px'}}>
              {requestState ? 'Name' : 'Name'}
            </label>
            
            <Input type='text-description' id='input_name' className='stretch-box-black-text' w='50%'
            placeholder='Name here' overflowWrap="break-word" borderRadius='6px' textAlign='center'
            border='1px solid gray' mt='2px' style={{height: '40px'}} size='10px'
            maxLength={200}/>


            {/* Change button text to be more specific */}
            <Button colorScheme='teal' size='md' width='180px' mt='20px' onClick={SendUserInfo}>
              {requestState ? 'Submit Request' : 'Submit Comment'}
            </Button>

            {/* Request Location Buttons  */}
            {isRVisible && (
              <Button colorScheme={requestState ? 'red' : 'blue'} size='md' width='180px' mt='10px' mb='15px' onClick={() => Toggle("Request")}>
                {ReqName}
              </Button>
              )
            }

            {isCVisible && (
              <>
              <Button colorScheme={commentState ? 'red' : 'blue'} size='md' width='180px' mt='10px' mb='15px' onClick={() => Toggle("Comment")}>
                {ComName}
              </Button>
              </>
            )}

          </Box>
          
        ) : null
      }

        <Tooltip label='Legend' openDelay={400} hasArrow>
        <Box
          p={1}
          borderRadius='lg'
          m={1}
          height='100px'
          width='125px'
          bgColor='rgba(128, 128, 128, 0.8)'
          shadow='base'
          bottom='10px'
          right='10px'
          zIndex='1'
          position = 'absolute'
          border='1px solid orange'
          display='flex'
          alignItems='center'>
            <VStack spacing = {0.5} alignItems='flex-start' pl='5px'>
              <HStack>
                <Image src={RedPin} boxSize='20px' />
                <Text fontSize='10px' pb='1px' textAlign='left' as='b'> Potholes </Text>
              </HStack>
              <HStack>
                <Image src={BluePin} boxSize='20px' />
                <Text fontSize='10px' pb='1px' textAlign='left'  as='b'> Speedbump </Text>
              </HStack>
              <HStack>
                <Image src={PurplePin} boxSize='20px' />
                <Text fontSize='10px' pb='1px' textAlign='left' as='b'> Bump </Text>
              </HStack>
              <HStack>
                <Image src={GreenPin} boxSize='20px' />
                <Text fontSize='10px' pb='1px' textAlign='left' as='b'> Cracks </Text>
              </HStack>
            </VStack>

          </Box>
          </Tooltip>
    </Flex>
  );
}

export default Map