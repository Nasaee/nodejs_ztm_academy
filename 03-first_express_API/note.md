```js
const express = require('express');

const app = express();

const PORT = 3000;

const friends = [
  { id: 0, name: 'Albert Einstein' },
  { id: 1, name: 'Sir Isaak Newton' },
];

app.use((req, res, next) => {
  const start = Date.now(); // represents start time
  next(); // call next middleware to pass control to next handler
  const delta = Date.now() - start; // represents difference in times between start and after process in done
  console.log(`${req.method} ${req.url} ${delta}ms`);
});

app.get('/friends', (req, res) => {
  res.json(friends);
});

// GET /friends/22
app.get('/friends/:friendId', (req, res) => {
  const friendId = Number(req.params.friendId);
  const friend = friends[friendId];
  if (friend) {
    res.status(200).json(friend);
  } else {
    res.status(404).json({ error: 'Friend does not exist' });
  }
});

app.get('/message', (req, res) => {
  res.send('<ul><li>Helloo Albert</li></ul>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

```js
app.use((req, res, next) => {...})
```

- app.use() : returns a middleware function (next) that can be used to pass control to the next middleware function in the stack. you can chian multiple middleware functions.

```js
app.get((req, res) => {...})
```

- app.METHOD : is middleware endpoint that returns a function that can be used to send a response to the client.(no next middleware )

# POST Request in Express

```js
const express = require('express');

const app = express();

const PORT = 3000;

const friends = [
  { id: 0, name: 'Albert Einstein' },
  { id: 1, name: 'Sir Isaak Newton' },
];

app.use((req, res, next) => {
  const start = Date.now(); // represents start time
  next(); // call next middleware to pass control to next handler
  const delta = Date.now() - start; // represents difference in times between start and after process in done
  console.log(`${req.method} ${req.url} ${delta}ms`);
});

app.use(express.json()); // return pice of middleware and converts req.body from json to be an js object

app.post('/friends', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Missing friend name' }); // return status code and json when no name passed
  }
  const newFriend = {
    name: req.body.name,
    id: friends.length,
  };
  friends.push(newFriend);

  res.json(newFriend); // respond back with newFriend
});

app.get('/friends', (req, res) => {
  res.json(friends);
});

// GET /friends/22
app.get('/friends/:friendId', (req, res) => {
  const friendId = Number(req.params.friendId);
  const friend = friends[friendId];
  if (friend) {
    res.status(200).json(friend);
  } else {
    res.status(404).json({ error: 'Friend does not exist' });
  }
});

app.get('/message', (req, res) => {
  res.send('<ul><li>Helloo Albert</li></ul>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

# Model View Controller (MVC)

**note**: when we are defining a function at the top level of the file and not passing it in as an argument to a function, it's usually a good idea to function declaration.

because when we are debugging our node app and we get one of those error messages, node can tell us the name of the function where something went wrong in a log

function declaration:

```js
function functionName(parameters) {
  // code to be executed
}
```

```js
// ./server.js
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
```

```js
// ./models/friends.model.js
const friends = [
  { id: 0, name: 'Albert Einstein' },
  { id: 1, name: 'Sir Isaak Newton' },
];

module.exports = friends;
```

```js
// ./controllers/messages.controller.js
function getMessages(req, res) {
  res.send('<ul><li>Helloo Albert</li></ul>');
}

function postMessages(req, res) {
  console.log('Updating messages...');
}

module.exports = {
  getMessages,
  postMessages,
};
```

```js
// ./controllers/friends.controller.js
const model = require('../models/friends.model');

function postFriend(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Missing friend name' });
  }

  const newFriend = { id: model.length, name };
  model.push(newFriend);
  res.status(201).json({ id: model.length - 1, name });
}

function getFriends(req, res) {
  res.json(model);
}

function getFriend(req, res) {
  const friendId = Number(req.params.friendId);
  const friend = model[friendId];
  if (friend) {
    res.status(200).json(friend);
  } else {
    res.status(404).json({ error: 'Friend does not exist' });
  }
}

module.exports = { postFriend, getFriends, getFriend };
```

# Express Router
