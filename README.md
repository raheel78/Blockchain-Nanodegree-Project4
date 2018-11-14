# Project 4 - Build a Private Blockchain Notary Service

Welcome to Project 4: Build a Private Blockchain Notary Service!

In this project, we'll build a Star Registry service that allows users to claim ownership of their favorite star in the night sky.

To do this, we'll add functionality to the Web API you built in Project 3: Web Services. We will connect this web service to our own private blockchain, allowing users to notarize ownership of a digital asset, in this case whichever star they choose.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

1. Download or clone this repo to a local folder on your machine
    - git clone https://github.com/raheel78/Blockchain-Nanodegree-Project4.git
2. Open terminal (MAC/linux) or command prompt (windows variants) on your desktop
3. Run `npm install` to install dependencies from package.json
4. Run `node index.js`
5. Server should listen on port 8000 (make sure this port should remain free to test this project)

### Prerequisites

You need to have setup following frameworks on your machine before running this project:

```
- bitcoinjs-lib@4.0.2
- bitcoinjs-message@2.0.0
- joi@14.0.4
- crypto-js@3.1.9-1
- body-parser@1.18.3
- express@4.16.4
- level@4.0.0
```

### Installing

**Note**: 
Below instructions are assuming that you have already *node js* and *npm* installed on your machine


>1. You can first check if node js is already installed on your machine by running **node --version**. The output should be something like:
    **v10.13.0**
>2. After cloning/downloading the repository, run `npm install` in the folder where all project files are sitting. You should see last 2 lines after installation is done, as shown below:
```
    added 168 packages from 103 contributors and audited 800 packages in 18.154s
    found 0 vulnerabilities
```
>3. In order to determine if all frameworks are successfully installed, inspect the current folder and you should find an additional folder created with the name **node_modules**

>4. If all above steps have been executed without any issue, then you should be ready to run this framework. Give it a try and run:  `node index.js`, you should see some lines as following:

        inside constructor ..... 
        Visit: http://localhost:8000
        Blockchain DB is empty. Creating new Blockchain with 1 genesis block...
        Block Added:: Height is:   0

>5. Till this point, you are good to go and can start calling REST endpoints for GET and POST (See next sections).


## Running the tests

Testing of this project is mainly constitute of sending and receiving request and responses via GET and POST. In the subsequent sections, you will find few examples as how to test both successful and failed responses which are expecting out of this RESTful framework. Testing can make use of either '*curl*' which is a command line tool. Or you can go for more sophisticated GUI based tool, such as; *Postman*.

**NOTE:** 
Below given instructions are only catering using POSTMAN GUI. All you need is to make sure that `POSTMAN` is installed on your machine.


Remember that:
- Base Path for API is '/'
- Content-Type header for all requests is *application/json*
- Port 8000 will be used for this service to listen for requests


#### GET star(s) from the chain
From POSTMAN make a GET request to the following end-point to GET the Genesis block.

GET http://localhost:8000/block/0
The response from the blockchain should be a JSON block object representing the Genesis block:
```
{
"hash": "8583615f16626a274a0af332f7723b7838dfac70264b260d1e12cc1667548be3",
"height": 0,
"body": "First block in the chain - Genesis block",
"time": "1542104377",
"previousBlockHash": ""
}
```

If the second block has not yet been added to the blockchain, then getting the second block should yield a commensurate error message. For example if the followiing command is executed in the REST client before the second block is added:

GET http://localhost:8000/block/1
The server should respond as follows with a 400 Bad Request status code:
```
{
    "status_code": 400,
    "status": "Failed retrieving Resource",
    "reason": "Bad Request. Block with height 1 does not exist"
}
```
If for a certain block height, there exists a star, then the server would respond with the corresponding star object as follows.

```
{
    "hash": "8583615f16626a274a0af332f7723b7838dfac70264b260d1e12cc1667548be3",
    "height": 1,
    "body": {
        "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
        "star": {
            "dec": "-27o 20o",
            "ra": "09h 20m 7.0s",
            "story": "5468697320697320746865207365636f6e642073746172",
            "storyDecoded": "This is the second star"
        }
    },
    "time": "1542104440",
    "previousBlockHash": "507e50f6d4d986cd3ac0559264253ff7e13a712f9e7eda4330afb57f05ca2225"
}
```

#### POST Requests Associated with the Notary Service

From POSTMAN make a POST request to the following end-point to start the validation process of a user request to register a star.

POST http://localhost:8000/requestValidation

Make sure that the request body has a JSON content type and the body of the request contains the address as your wallet address (you can get this address from either bitcoin tesnet or Electrum wallet). A wallet address example is below:
```
{
 "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj"
}
```
The request body example depicted above is a JSON object with a address attribute set to 1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj. With successfull execution of the POST request, the server should respond as follows.

```
{
    "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
    "requestTimeStamp": "1542108428",
    "message": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj:1542108428:starRegistry",
    "validationWindow": 300
}
```

##### Failure Scenario - address missing or not defined properly

In this case, the request will fail with below response from server:

```
{
    "status_code": 400,
    "status": "Input Validation Failed.",
    "reason": "Bad Request. \"address\" is required"
}
```

The following response is obtained from the server when there is a redundant attribute called name in the request body.

```
{
    "status_code": 400,
    "status": "Input Validation Failed.",
    "reason": "Bad Request. \"name\" is not allowed"
}
```

The following response is obtained from the server when the address attribute is not a valid string.

```
{
    "status_code": 400,
    "status": "Input Validation Failed.",
    "reason": "Bad Request. \"address\" must be a string"
}
```

#### POST End Point - Message Signature Validation

After receiving a message from the valid response of the previous request, the user can use his bitcoin wallet to sign the message using the same wallet address he used to initiate the request. 

Signing the message will get a signature like the one mentioned below:

```IOOCbNDRMd+Qb00DBCQ0Qah6ORGRhl+nSpOo6CrTS1PEcnPNwFbkZYWuQtzvyubw/ztwlOE+CFT8unW/JdNgRyU=```

Through POSTMAN, make a POST request to the following end-point to end the validation process of a user request and register a star with the wallet address and message signature from the previous steps.

POST http://localhost:8000/message-signature/validate

You need two attributes as mentioned below to validate the message signature:
```
{
     "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
     "signature":"IOOCbNDRMd+Qb00DBCQ0Qah6ORGRhl+nSpOo6CrTS1PEcnPNwFbkZYWuQtzvyubw/ztwlOE+CFT8unW/JdNgRyU="
}
```
With successfull execution of the POST request, the server should respond as follows.
```
{
    "registerStar": true,
    "status": {
        "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
        "requestTimeStamp": "1542109544",
        "message": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj:1542109544:starRegistry",
        "validationWindow": 271,
        "messageSignature": "valid"
    }
}
```

#### POST End Point - Star Registration

After configuring the Blockchain validation routine, you can configure the star registration endpoint. Make a POST request to the following end-point to register a star:

POST http://localhost:8000/block

Make sure that the request body has a JSON content type. The request body should atleast contain the following payload type for a successfull star registration.

```
{
  "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
  "star": {
    "dec": "-27o 20o",
    "ra": "09h 20m 7.0s",
    "story": "This is the second star"
  }
}
```

The server will respond as follows with a blockchain block containing the information of the registered star.

```
{
    "hash": "d1736dad1e3dfe9edda209979241acafc2f761375b65512cf125dff78d24d973",
    "height": 1,
    "body": {
        "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
        "star": {
            "dec": "-27o 20o",
            "ra": "09h 20m 7.0s",
            "story": "5468697320697320746865207365636f6e642073746172"
        }
    },
    "time": "1542109612",
    "previousBlockHash": "49195fa01ed7b83025763582d460acf525c215da05d38a01f1e1dfbc88e81ebd"
}
```



#### GET End Point - Querying Block in Blockchain by 'address' and 'hash'


In project 3, we have implemented REST service to query blocks using blockchain block height. We can also look up the stars registered against a certain wallet address. Make a GET request to the following endpoint with a wallet address.

GET http://localhost:8000/stars/address:[ADDRESS]

The server will respond as follows with a JSON response containing all the star objects registered against the given wallet address:

```
[
    {
        "hash": "d1736dad1e3dfe9edda209979241acafc2f761375b65512cf125dff78d24d973",
        "height": 1,
        "body": {
            "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
            "star": {
                "dec": "-27o 20o",
                "ra": "09h 20m 7.0s",
                "story": "5468697320697320746865207365636f6e642073746172",
                "storyDecoded": "This is the second star"
            }
        },
        "time": "1542109612",
        "previousBlockHash": "49195fa01ed7b83025763582d460acf525c215da05d38a01f1e1dfbc88e81ebd"
    }
]
```

A star can also be looked up against a block **hash** value as demonstrated below:

GET http://localhost:8000/stars/hash:[HASH]

The server will respond as follows with a JSON response containing the star object registered against the given block hash in the blockchain.

```
[
    {
        "hash": "d1736dad1e3dfe9edda209979241acafc2f761375b65512cf125dff78d24d973",
        "height": 1,
        "body": {
            "address": "1479jYUTvcW3wpTvHQ7o6WikyaHx4WEMCj",
            "star": {
                "dec": "-27o 20o",
                "ra": "09h 20m 7.0s",
                "story": "5468697320697320746865207365636f6e642073746172",
                "storyDecoded": "This is the second star"
            }
        },
        "time": "1542109612",
        "previousBlockHash": "49195fa01ed7b83025763582d460acf525c215da05d38a01f1e1dfbc88e81ebd"
    }
]
```


### Udacity Project Reviews

- Link to 1st Review
https://review.udacity.com/?utm_campaign=ret_000_auto_ndxxx_submission-reviewed&utm_source=blueshift&utm_medium=email&utm_content=reviewsapp-submission-reviewed&bsft_clkid=77312615-81c9-4fb1-a06f-08c54be7b838&bsft_uid=7e10c4ef-b590-4ef2-8f90-4d141154ce37&bsft_mid=61e9781e-6d28-4fab-9188-19403d6b60c3&bsft_eid=6f154690-7543-4582-9be7-e397af208dbd&bsft_txnid=84c724c8-1d37-4c1d-b897-6d2f1309f49e#!/reviews/1564126


- Link to 2nd Review
https://review.udacity.com/?utm_campaign=ret_000_auto_ndxxx_submission-reviewed&utm_source=blueshift&utm_medium=email&utm_content=reviewsapp-submission-reviewed&bsft_clkid=c638554b-3306-40ad-866a-c29206129a96&bsft_uid=7e10c4ef-b590-4ef2-8f90-4d141154ce37&bsft_mid=61e9781e-6d28-4fab-9188-19403d6b60c3&bsft_eid=6f154690-7543-4582-9be7-e397af208dbd&bsft_txnid=84c724c8-1d37-4c1d-b897-6d2f1309f49e#!/reviews/1564889
