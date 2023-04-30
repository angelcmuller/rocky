import axios from 'axios';



// this function grabs an image from the database corresponding to the ID provided
// Gabriel Mortensen 
export function GrabImage(id) {

 


  return axios.post ('http://localhost:3000/imageForPins', { id: id })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
