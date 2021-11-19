const fs = require('fs');
// provides utilities for working with file and directory paths
const path = require('path');
// use express npm package
const express = require('express');
// get data from animals
const { animals } = require('./data/animals');
//
const PORT = process.env.PORT || 3001;
// instantiate server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// instructs server to make files in public readily available and not gate it behind a server endpoint
app.use(express.static('public'));

// function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // save the animalsArray as filteredResults
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop though each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // check the traits against each animal in the filteredResults array
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
        if (query.diet) {
            filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        }
        if (query.species) {
            filteredResults = filteredResults.filter(animal => animal.species === query.species);
        }
        if (query.name) {
            filteredResults = filteredResults.filter(animal => animal.name === query.name);
        }
        // return the filtered results
        return filteredResults;
    }
}

// takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// accepts the POST route's req.body value and the array we want to add the data to
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
}

// add the route ('string that describes the route the client will have to fetch from', (callback function that will execute every time that route is accessed with a GET request))
app.get('/api/animals', (req, res) => {
    let results = animals;
    // call the filterByQuery()
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // use send() method from the res parameter (short for response) to send the string Hello! to our client (coded out)
    // res.send('Hello!');
    // use send to send small amounts of data and json to send more
    res.json(animals);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// '/' points to the root route on the server and is used to create a new homepage for a server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// adds route to animals.html
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// adds route to zookeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// adds a wildcard route, any route that wasn't perviously defined will fall under this request and receive the homepage as the response
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// define a route that listens for POST requests
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

// make server listen for connections on the specified host and port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// validate data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}