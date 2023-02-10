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

      return(records)
 
    // const MongoClient = require('mongodb').MongoClient;
    // const uri = "mongodb+srv://tristanbailey:RockyRoadKey2022@cluster0.fpy1pqs.mongodb.net/?retryWrites=true&w=majority";
    // const client = new MongoClient(uri, { useNewUrlParser: true });
    // client.connect(err => {
    //   const db = client.db("pinDatabase");
    //   const collection = db.collection("Pins");
    //   collection.find({}).toArray(function(err, items) {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       console.log(JSON.stringify(items));
    //     }
    //     client.close();
    //   });
// });

}
