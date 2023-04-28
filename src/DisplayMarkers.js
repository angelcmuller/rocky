import { Like } from "./like_dislike.js";
import mapboxgl from 'mapbox-gl';

//Gabriel Mortensen Pin Display functions below 
//Waiting for data from MogoDB
//Uses the result variable 
export async function displayMarkers(pinData, commentData) {
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
    const popupContent = '<div class="popup-content">' +
    '<h1 style="color:black; font-size:18px; text-align:center; font-weight: bold">' + 'Description <br/>"' + pinData[i].Classification +
    '"<br /><br />' +
    '<h3 class="popup-button open-info" style="color:white; font-size: 15px; text-align:center"><button id="more-info-btn" style="text-decoration:underline">See more Information</button></h3>' + 
    '</div>';
  
        const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([pinData[i].Longitude, pinData[i].Lattitude])
        .setPopup(new mapboxgl.Popup({ offset: 25, closeOnClick: true, closeButton: true })
        .setHTML(popupContent))
        .addTo(map);
  
        const moreInfoButton = marker._popup._content.querySelector('#more-info-btn');
        moreInfoButton.addEventListener('click', function() {
            setPinInformation(true);
            console.log("HERE", pinInformation);
            pinCoordinatesForInfoDisplayLong = pinData[i].Longitude;
            pinCoordinatesForInfoDisplayLat = pinData[i].Lattitude;
            thisIsTheOne = i;
            console.log(pinCoordinatesForInfoDisplayLong, pinCoordinatesForInfoDisplayLat, thisIsTheOne)
        });
  
        // add click listener to marker
        marker.getElement().addEventListener('click', () => {
            markerClicked = true;
        });
  
        // 'hover' over pins and see immediate information - changed it to 'click'
        marker.getElement().addEventListener('click', () => {
            marker.togglePopup();
        });
        
        // marker.getElement().addEventListener('click', () => {
        //   marker.togglePopup();
        // });
    }
    
    for (let i = 0; i < commentData.length; i++) {
        const marker = new mapboxgl.Marker({ color: '#e7eaf6' })
        .setLngLat([commentData[i].Longitude, commentData[i].Lattitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(` <h3 style="color: black; font-size: 18px;">${commentData[i].Comment}</h3><p style="color: gray; font-size: 14px;">by ${commentData[i].User}</p> </br> <div class="popup-buttons-container"> <button id="like-btn-${i}" class="popup-button display-button">Like</button> <button id="dislike-btn-${i}" class="popup-button display-button">Dislike</button> </div>   `))
        .addTo(map);
    
        // add the marker to the markers array
        markers.push(marker);
  
        // add click listener to marker to ensure make comment/request popup doesn't appear
        // when user clicks on these pins
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
            // Swal.fire({
            //   title: "Comment liked!",
            //   icon: "success",
            //   timer: 2000,
            //   showConfirmButton: false
            // });
        });
        //need to add one:true to keep pop up from liking multiple times in one click
        }, { once: true });
  
    } 
}