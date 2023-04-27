import axios from 'axios';


// This function submits data to the databse using the LogMongo.js script which was made with the help of chatGPT 
// Gabriel Mortensen 
export function Like(lat, lng , update_value) {
   

  axios.post ('http://localhost:3000/updateComment', {
        lat: lat,
        lng: lng,
        update_value: update_value 
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

    alert(update_value)
}
