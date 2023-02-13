export default async  function JsonListReturn(){
  
  // This method fetches the records from the database.
  // This method was implemented by Gabriel and uses knowlege from the MongoDB Mern tutotial to return a JSON response of the database contents 
    
  //Connect to database 
  const response = await fetch(`http://localhost:3000/record/`);

  //Wait for database 
  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  //return results from database 
  const records = await response.json();
  return records
}
