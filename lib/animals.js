const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
}

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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};