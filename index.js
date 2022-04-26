const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { query } = require('express');
require('dotenv').config()

const ObjectId = require('mongodb').ObjectId;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONNECT TO MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.is406.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// ASYNC FUNCTION
async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        const database = client.db("softzino");
        const userCollection = database.collection("users");
        const productCollection = database.collection("products");


        // CRUD OPERATIONS GOES HERE

        // (POST) FOR USERS
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);

        })

        // (GET) FOR USERS
        app.get('/users', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.json(users);
        })

        // (POST) FOR PRODUCTS
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result);
        })

        // (GET) FOR PRODUCTS
        app.get('/products', async (req, res) => {
            const products = await productCollection.find().toArray();
            res.json(products);
        })

        // (GET) FOR PRODUCTS BY ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.json(product);
        })

        // (PUT) FOR PRODUCTS
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = req.body;
            const result = await productCollection.updateOne(query, {
                $set: {
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    stock: product.stock
                }
            }, { upsert: true });
            res.json(result);
        })



        // (DELETE) FOR PRODUCTS BY ID
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })







    } finally {
        // await client.close();
    }
}
// CALL ASYNC FUNCTION TO EXECUTE
run().catch(console.dir);


// ROUTES
app.get('/', (req, res) => {
    res.send('Hello from my Server')
});

app.listen(port, () => {
    console.log('Listening to', port)
});