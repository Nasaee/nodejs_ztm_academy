const express = require('express');
// use named import for controller just once and can use it anywhere
const messagesController = require('./controllers/messages.controller');
const friendsController = require('./controllers/friends.controller');

const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  const start = Date.now(); // represents start time
  next(); // call next middleware to pass control to next handler
  const delta = Date.now() - start; // represents difference in times between start and after process in done
  console.log(`${req.method} ${req.url} ${delta}ms`);
});

app.use(express.json()); // return pice of middleware and converts req.body from json to be an js object

app.post('/friends', friendsController.postFriend);
app.get('/friends', friendsController.getFriends);
app.get('/friends/:friendId', friendsController.getFriend); // GET /friends/1

app.get('/messages', messagesController.getMessages);
app.post('/messages', messagesController.postMessages);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
