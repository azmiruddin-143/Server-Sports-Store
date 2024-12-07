const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors())
app.use(express.json())

// mongodb setup//

const uri = `mongodb+srv://${process.env.DB_SPORTSUSSER}:${process.env.DB_SPORTSPASS}@cluster0.phy8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db("productsDB");
    const sportsCollection = database.collection("sportsCollection");

    app.post('/sports', async (req, res) => {
      const sportsbody = req.body
      const result = await sportsCollection.insertOne(sportsbody);
      res.send(result)

    })
    app.get('/sportslimit', async (req, res) => {
      const cursor = sportsCollection.find().sort({ createdAt: -1 }).limit(6);  // Sort by creation date in descending order
      const result = await cursor.toArray();  // Convert the cursor into an array
      res.send(result);  // Send the result to the client
    });

    
    app.get('/sportsall', async (req, res) => {
      const cursor = sportsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/sportSort', async (req, res) => {
      const cursor = sportsCollection.aggregate([
        {
          $addFields: {
            price: { $toDouble: "$price" }  
          }
        },
        {
          $sort: { "price": 1 }  
        }
      ]);
    
      const result = await cursor.toArray();
      res.send(result);
    });
    

    app.get("/sportsall/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.findOne(query);
      res.send(result)
    })




    app.get('/myequipment', async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }
      const query = { email: email };
      const result = await sportsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/myequipment/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.deleteOne(query);
      res.send(result)
    })


    app.get("/myequipment/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.findOne(query);
      res.send(result)
    })

    app.put("/myequipment/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const upBody = req.body
      const updateDoc = {
        $set: {
          image: upBody.image,
          productName: upBody.productName,
          category: upBody.category,
          price: upBody.price,
          rating: upBody.rating,
          selectedDate: upBody.selectedDate,
          email: upBody.email,
          userName: upBody.userName

        }
      }

      const result = await sportsCollection.updateOne(filter, updateDoc, options);
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



app.get('/', (req, res) => {
  res.send("Hlw I'm Azmir Uddin")
})

app.listen(port, () => {
  console.log(`Server is running`, port);
})
