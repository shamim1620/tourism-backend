const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwf59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tourismDb");
        const service_collection = database.collection("service");
        const cartCollection = database.collection("PakegeCollection");
        // create a document to insert

        app.get('/services', async (req, res) => {
            const packages = await service_collection.find({}).toArray();
            // console.log("inside ", packages)
            res.json(packages);
        });

        // Get single services;
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await service_collection.findOne(query);
            res.json(service);
        });

        // cart information
        app.get('/myorder', async (req, res) => {
            const cursor = cartCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        app.post('/addService', async (req, res) => {
            const package = req.body;
            const result = await service_collection.insertOne(package);
            res.json(result);
        });

        //post api

        app.post('/addtocart', async (req, res) => {
            const package = req.body;
            const result = await cartCollection.insertOne(package);
            res.json(result);
        });

        //UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedPakege = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {

                    name: updatedPakege.title,
                    description: updatedPakege.description,
                    price: updatedPakege.price,
                    image_url: updatedPakege.image_url,

                },
            };
            const result = await service_collection.updateOne(filter, updateDoc, options)
            console.log('updating', id);
            res.json(result);
        });

        //delete oder

        app.delete('/deleteCart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.json(result);
        });
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism server is running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
// user nsme:shamimDb
// LCjN8eDZE0mZfcMN