const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors())
app.use(express.json())

// mongodb setup//

const uri = `mongodb+srv://${process.env.DB_SPORTSUSSER}:{${process.env.DB_SPORTSPASS}@cluster0.phy8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
        
    //    Start //


    const database = client.db("Sports");
    const sportsCollection = database.collection("SportsData");


    app.post('/sports', async (req, res) => {
        const sportsBody = req.body
        const result = await sportsCollection.insertOne(sportsBody);
        res.send(result)
    })
     



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req,res) =>{
    res.send("Hlw I'm Azmir Uddin")
})

app.listen(port, () =>{
    console.log(`Server is running`,port);
})
