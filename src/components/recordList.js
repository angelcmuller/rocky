export default async  function GeoJsonListReturn(){
  
  // This method fetches the records from the database.
  // This method was implemented by Gabriel and uses knowlege from the MongoDB Mern tutotial to return a JSON response of the database contents 
      
  const response = await fetch(`http://localhost:3000/record/`);

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

    const records = await response.json();



    return records
 

}
