const express = require('express');
const os = require('os');

const appp = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // event loop is blocked...
  }
}

appp.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

appp.get('/timer', (req, res) => {
  delay(4000);
  res.send(`Beep beep beeb! ${process.pid}`);
});

console.log('Running server.js');
console.log('Worker process started...');
appp.listen(3000);
