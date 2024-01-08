const express = require('express');
const friendsController = require('../controllers/friends.controller');

const frindsRouter = express.Router(); // create router

// add middleware
frindsRouter.use((req, res, next) => {
  console.log('ip address: ', req.ip);
  next();
});

frindsRouter.post('/', friendsController.postFriend);
frindsRouter.get('/', friendsController.getFriends);
frindsRouter.get('/:friendId', friendsController.getFriend);

module.exports = frindsRouter;
