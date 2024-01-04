# HTTP Requests

1. **METHOD** : GET | POST | PUT | DELETE
2. **PATH** : /message
3. **BODY** : almost use json format
4. **HEADERS** : to send additional metadata to servers , data about data that you're sending like size of data, authentication information, host ฯลฯ

   - metadata คือ ข้อมูลรายละเอียดที่อธิบายถึงความเป็นมาของข้อมูล
     อาทิเช่น ชื่อผู้แต่ง ชื่อเจ้าของผลงาน ผู้รับผิดชอบ ปีที่เขียน ชื่อเรื่อง

    <br/>

   **HTTP Requests method**

- **GET** : get data
- **POST** : send data
- **PUT** : replace the data that we spacify
- **DELETE** : remove data

# HTTP Responses

1. **HEADERS**: Content-Type: application/json
2. **BODY**: {text: 'hi', photo: 'wave.jpg}
3. **STATUS CODE**: 200
   Informational responses (100 – 199)
   Successful responses (200 – 299)
   Redirection messages (300 – 399)
   Client error responses (400 – 499)
   Server error responses (500 – 599)
   [More details about status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

# APIs and Rounting

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // if we don't set status code it default 200
  res.writeHead(200, {
    'Content-Type': 'text/plain', // means plain text
  });
  res.end('Hello!, Sir Isaac Newton is your friend!');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
```

**port is localhost by default ( 127.0.0.1) : means localhost:3000**

**res.end()** call end() because it signals that the response is complete including the headers and any other data that we want to pass, is now ready to send back

- **we can set direcly status code and headers**

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/friends') {
    // res.writeHead(200, {
    //   'Content-Type': 'application/json',
    // });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: 1, name: 'Sir Isaac Newton' }));
  } else if (req.url === '/messages') {
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
```

```js
else {
    res.writeHead(404);
    res.end();
  }
```

- return status 404 when path not match [Example result](/reference/path_not_match_404.png)

# Parameterized URLs

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer();

const friends = [
  { id: 1, name: 'Sir Isaac Newton' },
  { id: 2, name: 'Nikola Tesla' },
];

server.on('request', (req, res) => {
  // url path: /friends/2 => ['', 'friends', '2']
  const items = req.url.split('/');

  if (items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    if (items.length === 3) {
      const friendsIndex = Number(items[2]); // get Last index of array (endpoint)

      // responses friends that match with endpoint
      res.end(JSON.stringify(friends[friendsIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (items[1] === 'messages') {
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
```

# POST Request

```js
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
```

buffer example:

```buffer
Request: <Buffer 7b 22 69 64 22 3a 33 2c 22 6e 61 6d 65 22 3a 22 52 79 61 6e 20 44 61 68 6c 22 7d>
```

note:

```js
(req, res) => {
  ...
}
```

- req: is readable stream
- res: writable stream

```js
if (req.method === 'POST' && items[1] === 'friends') {
  req.on('data', (data) => {
    const friend = data.toString(); // convert to string because data is node buffer object (return collection of row bytes)
    console.log('Request: ', friend);
    friends.push(JSON.parse(friend)); // convert back to object because data is string
  });
  // send back response after data already process
  req.pipe(res); // send data(JSON) from request to response (readable.pipe(writable))
}
```

- no need to call end() function when use .pipe because it already call end() automatically
