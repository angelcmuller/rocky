import axios from 'axios';

// This function submits data to the databse using the LogMongo.js script which was made with the help of chatGPT 
// Gabriel Mortensen 
export function LogMongo(stringVariable1, stringVariable2, floatVariable1, floatVariable2) {

  axios.post('http://localhost:3000/request', {
    stringVariable1: stringVariable1,
    stringVariable2: stringVariable2,
    floatVariable1: floatVariable1,
    floatVariable2: floatVariable2
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
} 