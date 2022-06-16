const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = 5000;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// middleware
app.use(express.json());
app.use(cors());

async function run() {
  try {
    await client.connect();
    const database = client.db("car_mechanic");
    const servicesCollection = database.collection("services");

    // post application programming interface
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // find api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get a single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting a id", id);
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });

    // delete a service
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } catch {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Sever");
  console.log("Hello Developer Sifat");
});

app.listen(port, () => {
  console.log(`Listening to the ${port} successfully`);
});
