import axios from 'axios';


// this function grabs an image from the database corresponding to the ID provided
// Gabriel Mortensen 
export function GrabImage(id) {
  return axios.post ('http://localhost:3000/imageForPins', { id: id })
    .then(function (response) {
      if (typeof response.data === 'string') {
        // response data is a string
        console.log('Response data is a string:', response.data);
      } else {
        // response data is not a string
        console.log('Response data is not a string');
      }
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
