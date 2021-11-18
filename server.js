// use express npm package
const express = require('express');
// get data from animals
const { animals } = require('./data/animals');
//
const PORT = process.env.PORT || 3001;
// instantiate server
const app = express();

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

// make server listen for connections on the specified host and port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});