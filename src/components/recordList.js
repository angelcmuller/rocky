export default async function JsonListReturn(link){
  
  // This method fetches the records from the database.
  // This method was implemented by Gabriel and uses knowlege from the MongoDB Mern tutotial to return a JSON response of the database contents 
  console.log("Attempting to connect to  " + link)
  //Connect to database 
  const response = await fetch(link);
  console.log("Connected to " + link)

  //Wait for database 
  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }
  
  // Parse the response body as JSON
  let records;
  try {
    const text = await response.text();
    console.log(text);
    records = await response.json();
    console.log("verdit: " + records);
  } catch (err) {
    console.log("records:" + records)
    const message = `An error occurred while parsing the response: ${err.message}`;
    console.error("message for Team 9: " + message);
    throw new Error(message); // Throw an error to be caught by the calling function
  }
  
  console.log("We got something..." + records)
  
  //return results from database 
  return records
}