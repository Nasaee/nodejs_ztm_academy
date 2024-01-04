const http = require('http');

const PORT = 3000;

const server = http.createServer();

const friends = [
  { id: 1, name: 'Sir Isaac Newton' },
  { id: 2, name: 'Nikola Tesla' },
];

server.on('request', (req, res) => {
  // url: /friends/2 => ['', 'friends', '2']
  const items = req.url.split('/');

  if (req.method === 'POST' && items[1] === 'friends') {
    req.on('data', (data) => {
      const friend = data.toString(); // convert to string because data is node buffer object (return collection of row bytes)
      console.log('Request: ', friend);
      friends.push(JSON.parse(friend)); // convert back to object because data is string
    });
    // send back response after data already process
    req.pipe(res); // send data(JSON) from request to response (readable.pipe(writable))
  } else if (req.method === 'GET' && items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    if (items.length === 3) {
      const friendsIndex = Number(items[2]); // get Last index of array (endpoint)

      // responses friends that match with endpoint
      res.end(JSON.stringify(friends[friendsIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (req.method === 'GET' && items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li>Hello Isaac!</li>');
    res.write('<li>What are your thoughts on astronomy?</li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
