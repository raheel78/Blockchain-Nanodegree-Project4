# Project 3 - RESTful Web API with Node.js Framework

This project will help establish a RESTful version of Web API whereby a client will be able to call REST end points for reading (GETing) and adding (POSTing) new blocks in the blockchain. A framework (levelDB) will enable the permanent storage persistance of block data with all necessary formalities (block hashing, height and chaining previous hash etc.). Project has been coded using Node JS libraries.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

1. Download or clone this repo to a local folder on your machine
    - git clone https://github.com/raheel78/Blockchain-Nanodegree-Project3.git
2. Open terminal (MAC/linux) or command prompt (windows variants) on your desktop
3. Run `npm install` to install dependencies from package.json
4. Run `node app.js`
5. Server should listen on port 8000 (make sure this port should remain free to test this)

### Prerequisites

You need to have setup following softwares/frameworks on your machine before running this project:

```
- crypto-js@3.1.9-1
- body-parser@1.18.3
- express@4.16.4
- level@4.0.0
```

### Installing

**Note**: 
Below instructions are assuming that you have already *node js* and *npm* installed on your machine


>1. You can first check if node js is already installed on your machine by running **node --version**. The output should be something like:
    v8.12.0
>2. After cloning/downloading the repository, run `npm install` in the folder where all project files are sitting
>3. This will install all the dependencies from `package.json` file
>4. In order to determine if all frameworks are successfully installed, inspect the current folder and you should find an additional folder created with the name **node_modules**

>5. If all above steps have been executed without any issue, then you should be ready to run this framework. Give it a try and run:  `node app.js`, you should see some lines as following:

        inside constructor ..... 
        Server Listening for port: 8000
        Blockchain DB is empty. Creating new Blockchain with 1 genesis block...
        chain length = 0, return null instead of block
        block saved
        index is:   0

>6. Till this point, you are good to go and can start calling REST endpoints for GET and POST (See next sections)


## Running the tests

Testing of this project is mainly constitute of sending and receiving request and responses via GET and POST. In the subsequent sections, you will find few examples as how to test both successful and failed responses which are expecting out of this RESTful framework. Testing can make use of either '*curl*' which is a command line tool. Or you can go for more sophisticated GUI based tool, such as; *Postman*.

Below given instructions are only catering using curl command line tool as this tool is relatively easy to use. All you need is to make sure that `curl` is installed on your machine. Follow the instructions given on link (https://help.ubidots.com/how-to-with-ubidots/learn-how-to-install-run-curl-on-windowsmacosxlinux).


Remember that:
- Base Path for API is '/'
- Content-Type header for all requests is *application/json*
- Port 8000 will be used for this service to listen for requests


### GET /block/{blockHeight}

This will allows to read block information through its height which is nothing but a numeric value presenting at what position the block is sitting in the blockchain. 

An example would be:

##### REQUEST
```
curl -X GET \
  http://localhost:8000/block/0 \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
```
Above example command will help retrieve the block at position 0 (the genesis block) from the chain, the response from above command would be similar to below (yours might be bit different):

##### RESPONSE
```
{
    "hash": "f3a9d0254f3d9ee6a4a207755fcc4804d5b38e28ba16ce42f144d8ed619fbebb",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1540705789",
    "previousBlockHash": ""
}
```

### POST /block/

POST request will be used to add a new block to the blockchain. You can use curl command (similar to above one) for adding a block. A sample curl command for POST is given below:

##### Request
```
curl -X POST \
  http://localhost:8000/block/ \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -D '{"data":"some sample block"}'
```
The above command should produce below output:

##### Response - Success
```
Body Data is:   Some data block
chain length is 1, return previous block
block saved
```

##### RESPONSE - Failure Rrequest
If the data is missing in the curl command, such as:
```
curl -X POST \
  http://localhost:8000/block/ \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -D ''
```

then the response would be something like below:
```
{"error":"Bummer: Missing 'data' key in POST Request"}
```

Make sure that no block will be created in the chain if the data is missing to POST request.


### Link to Project Review from Udacity

[Review: RESTful Web API with Node.js Framework](https://review.udacity.com/?utm_campaign=ret_000_auto_ndxxx_submission-reviewed&utm_source=blueshift&utm_medium=email&utm_content=reviewsapp-submission-reviewed&bsft_clkid=8bea6c4f-4dc4-472e-9da1-11f055327751&bsft_uid=7e10c4ef-b590-4ef2-8f90-4d141154ce37&bsft_mid=3b0b7eae-65d8-441e-ab95-91101e759325&bsft_eid=6f154690-7543-4582-9be7-e397af208dbd&bsft_txnid=c8f05308-596e-400e-9266-7cdd91a9eb14#!/reviews/1533230)

