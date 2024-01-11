const path = require('path');
const { title } = require('process');

function getMessages(req, res) {
  res.render('messages', {
    title: 'Messages to my Friends!',
    friend: 'Elon Musk',
  });
}

function postMessages(req, res) {
  console.log('Updating messages...');
}

module.exports = {
  getMessages,
  postMessages,
};
