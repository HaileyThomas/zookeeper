const path = require('path');
const router = require('express').Router();

// '/' points to the root route on the server and is used to create a new homepage for a server
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// adds route to animals.html
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// adds route to zookeepers.html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// adds a wildcard route, any route that wasn't perviously defined will fall under this request and receive the homepage as the response
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;