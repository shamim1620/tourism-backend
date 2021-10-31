const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = 5000

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
        // create a document to insert

        app.get('/services', async (req, res) => {
            const packages = await service_collection.find({}).toArray();
            // console.log("inside ", packages)
            res.json(packages);
        });

        app.post('/addService', async (req, res) => {
            const package = req.body;
            const result = await service_collection.insertOne(package);
            res.json(result);
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
// user nsme:shamimDb
// LCjN8eDZE0mZfcMN