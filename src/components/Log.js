import axios from 'axios';


// This function submits data to the databse using the LogMongo.js script which was made with the help of chatGPT 
// Gabriel Mortensen 
export function LogMongo(requestState, stringVariable1, stringVariable2, floatVariable1, floatVariable2,  opt, cond) {
   
  
  let value_cond = parseInt(cond); 

  console.log('Log.js rstate:', typeof requestState)
  console.log('Log.js rstate:',  requestState)
  axios.post ('http://localhost:3000/request', {
      requestState: Boolean(requestState),
      stringVariable1: stringVariable1,
      stringVariable2: stringVariable2,
      floatVariable1: floatVariable1,
      floatVariable2: floatVariable2,
      opt: opt,
      cond: value_cond
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
