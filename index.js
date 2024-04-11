const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const DataMonitor = require("./DataMonitor");
const debug = require("debug")("app");


const PORT = 3000;


const dataMonitor = new DataMonitor();
dataMonitor.on('dataAded', (item) => {
  console.log('Data added: ' + item);
});

const clothing = require('./server/routes/clothing')(dataMonitor);
const errors = require('./server/routes/errors');

const app = express();

app.use(favicon(path.join(__dirname, 'dist/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/clothing', clothing);
app.use('/api/errors', errors);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

console.log('Listening on port: ' + app.get('port'));

module.exports = app;
