const express = require('express');
const fs = require('fs');
const datafile = 'server/data/clothing.json';
const router = express.Router();

/* GET all clothing */
// Define route handler for the root URL '/'
router.route('/')
  .get(function(req, res) {
    // Asynchronously fetch clothing data
    getClothingData((err, data) => {
      // Callback function to handle the result of getClothingData
      if (err) {
        // If an error occurred during data retrieval, log the error
        console.log(err);
      } else {
        // If data retrieval was successful, log a message and send the data as response
        console.log('Returning clothing data');
        res.send(data);
      }
    });

    // Code execution continues here while data retrieval is in progress
    console.log('Doing more work');
  });

// Function to fetch clothing data asynchronously
function getClothingData(callback) {
  // Read data from file asynchronously
  fs.readFile(datafile, 'utf8', (err, data) => {
    // Callback function to handle the result of readFile
    if (err) {
      // If an error occurred during file reading, invoke the callback with the error
      callback(err, null);
    } else {
      // If file reading was successful, parse the data and invoke the callback with the result
      let clothingData = JSON.parse(data);
      callback(null, clothingData);
    }
  });
}

module.exports = router;
