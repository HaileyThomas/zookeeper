const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// add the route ('string that describes the route the client will have to fetch from', (callback function that will execute every time that route is accessed with a GET request))
router.get('/animals', (req, res) => {
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

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// define a route that listens for POST requests
router.post('/animals', (req, res) => {
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

module.exports = router;