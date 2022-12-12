export default async  function JsonListReturn(){
  
  // This method fetches the records from the database.
  
      
      const response = await fetch(`http://localhost:3000/record/`);
  
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const records = await response.json();

      return(records)
  
}
