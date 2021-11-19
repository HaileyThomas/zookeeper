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

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// tells server that any time a client navigates to ourhost/api the app will use the router we set up in apiRoutes
app.use('/api', apiRoutes);
// if / is the endpoint, then the router will serve back our HTML routes
app.use('/', htmlRoutes);
// instructs server to make files in public readily available and not gate it behind a server endpoint
app.use(express.static('public'));

// make server listen for connections on the specified host and port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});