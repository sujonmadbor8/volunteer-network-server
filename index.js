const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvuaj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventCollection = client.db("volunteer").collection("events");

  app.get("/events", (req, res) => {
    eventCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    eventCollection.insertOne(newEvent).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("deleteEvent/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log("delete this", id);
    eventCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(!!documents.value));
  });
});

app.listen(port);
