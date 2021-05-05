const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfj8i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const app = express()
const port = process.env.PORT || 5055


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error',err)
  const eventCollection = client.db("volunteer").collection("events");

app.get('/events',(req, res) =>{
  eventCollection.find()
  .toArray((err, items)=>{
    res.send(items)
  })
})


app.post('/addEvent',(req,res) =>{
  const newEvent = req.body;
  console.log('adding new event',newEvent)
  eventCollection.insertOne(newEvent)
  .then(result =>{
    console.log('inserted count',result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})

app.delete('deleteEvent/:id',(req, res) =>{
  const id = ObjectID(req.params.id)
  console.log('deleted',id);
  eventCollection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value))
})

  // client.close();
});


app.listen(port)