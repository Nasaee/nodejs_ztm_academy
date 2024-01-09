const express = require('express');
const path = require('path');

const frindsRouter = require('./routes/friends.router');
const messagesRouter = require('./routes/messages.router');

const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
});

// serv static website like html+css, react, vue, Angular
app.use('/site', express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/friends', frindsRouter); // use router as middleware (mountilng the messages router)
app.use('/messages', messagesRouter); // use router as middleware (mountilng the messages router)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
