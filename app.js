// 1st Rubric Point:   Node.js framework - Express.js
// Importing Express.js module
const express = require('express');
// Importing BodyParser.js module
const bodyParser = require('body-parser');
// Importing Blockchain class (aka simpleChain.js in Project2)
const BlockchainService = require('./Blockchain');
// Importing Blockchain service
const BlockController = require('./BlockController.js');
// Importing BlockDB class to be used as wrapper for writing on level DB
const BlockDB = require('./BlockDB.js');

// Insantiating ExpressJS to get an active 'app'
const app = express();
const port = 8000;

// Insantiating classes - Creating NVC patterns for chaining
let blockDb = new BlockDB('./mydb');
let blockchainService = new BlockchainService(blockDb);
let blockController = new BlockController(blockchainService);

// setting the port
app.set("port", port);

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/block/:blockIndex', blockController.getBlockByIndex.bind(blockController));
app.post('/block', blockController.postNewBlock.bind(blockController));

// 2nd Rubric Point:    API Service Port Configuration - use port 8000 with localhost URL
app.listen(app.get("port"), () => {
	console.log(`Server Listening for port: ${app.get("port")}`);
});
