const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const router = express.Router();

const datafile = "server/data/clothing.json";


module.exports = function(monitor) {
  let dataMonitorInstance = monitor;

  dataMonitorInstance.on("dataAdded", (item) => {
    console.log("item added: " + item);
  });

  /* GET all clothing */

//1. using callbacks

// router.route("/").get(function (req, res) {
//   // Asynchronously fetch clothing data
//   getClothingData((err, data) => {
//     // Callback function to handle the result of getClothingData
//     if (err) {
//       // If an error occurred during data retrieval, log the error
//       console.log(err);
//     } else {
//       // If data retrieval was successful, log a message and send the data as response
//       console.log("Returning clothing data");
//       res.send(data);
//     }
//   });

//   // Code execution continues here while data retrieval is in progress
//   console.log("Doing more work");
// });

// // Function to fetch clothing data asynchronously
// function getClothingData(callback) {
//   // Read data from file asynchronously
//   fs.readFile(datafile, "utf8", (err, data) => {
//     // Callback function to handle the result of readFile
//     if (err) {
//       // If an error occurred during file reading, invoke the callback with the error
//       callback(err, null);
//     } else {
//       // If file reading was successful, parse the data and invoke the callback with the result
//       let clothingData = JSON.parse(data);
//       callback(null, clothingData);
//     }
//   });
// }

//2. using promises

// router.route("/").get((req, res) => {
//   // Call getClothingData function, which returns a Promise
//   getClothingData()
//     // If Promise is resolved (success), log the data
//     .then((data) => {
//       console.log("Returning clothing data");
//       res.send(data);
//     })
//     // If Promise is rejected (error), log the error
//     .catch((err) => console.log(err))
//     // Finally, log "done" regardless of Promise outcome
//     .finally(() => console.log("done"));

//   // Code execution continues here while Promise is being resolved/rejected
//   console.log("Doing more work");
// });

// // Function to fetch clothing data asynchronously and return a Promise
// function getClothingData() {
//   return new Promise((resolve, reject) => {
//     // Read data from file asynchronously
//     fs.readFile(datafile, "utf8", (err, data) => {
//       // Callback function to handle the result of readFile
//       if (err) {
//         // If an error occurred during file reading, reject the Promise with the error
//         reject(err);
//       } else {
//         // If file reading was successful, parse the data and resolve the Promise with the result
//         let clothingData = JSON.parse(data);
//         resolve(clothingData);
//       }
//     });
//   });
// }

//3. using async/await

router
.route("/")
.get(async (req, res) => {
  try {
    let clothingData = await getClothingData();
    res.send(clothingData);
  } catch (error) {
    console.log("error", error);
  }
})
.post(async function (req, res) {
  try {
    let data = await getClothingData();

    let nextID = getNextAvailableID(data);

    let newClothingItem = {
      clothingID: nextID,
      itemName: req.body.itemName,
      price: req.body.price,
    };

    data.push(newClothingItem);

    await saveClothingData(data);

    dataMonitorInstance.emit("dataAdded", newClothingItem.itemName);

    res.status(201).send(newClothingItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

async function getClothingData() {
let rawData = await fsPromises.readFile(datafile, "utf8");
let clothingData = JSON.parse(rawData);
return clothingData;
}

function getNextAvailableID(allClothingData) {
let maxID = 0;

allClothingData.forEach(function (element, index, array) {
  if (element.clothingID > maxID) {
    maxID = element.clothingID;
  }
});
return ++maxID;
}

function saveClothingData(data) {
return fsPromises.writeFile(datafile, JSON.stringify(data, null, 4));
}


  return router;
};
