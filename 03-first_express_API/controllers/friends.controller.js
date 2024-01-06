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
