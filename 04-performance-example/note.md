# Node Performance

when we call server.js sever will create a Master process and when we call cluster.fork() it will create a worker process (a child process) to handle the request.

1 worker process will handle 1 blocking request at a time.

- The master process typically refers to the primary process responsible for managing and coordinating worker processes.
- The every time when call cluster.fork() (Worker precess) and when we're in the Master process we're always running server.js. The code for each process is the same. The only difference is Master flag below.

```js
if (cluster.isMaster){...}
```

in ⬇️

```js
const express = require('express');
const cluster = require('cluster'); // cluster is build in module is used for creating child processes to take advantage of multi-core systems.

const appp = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // event loop is blocked...
  }
}

appp.get('/', (req, res) => {
  // process.pid to get the current process id from the operating system
  res.send(`Performance example: ${process.pid}`);
});

appp.get('/timer', (req, res) => {
  // delay the response
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log('Running server.js');
if (cluster.isMaster) {
  console.log('Master has been started...');
  cluster.fork();
  cluster.fork();
} else {
  console.log('Worker process started...');
  appp.listen(3000); // listen on port 3000 when worker process is started
}
```

output in log:

```sh
Running server.js
Master has been started...
Running server.js
Worker process started...
Running server.js
Worker process started...
```

- first time as the master forking a two worker processes
- second time as the worker listening for incoming connections.
- Node will create 1 Worker when we call cluster.fork() 1 time.

```sh
# first time (if block)
Running server.js
Master has been started...
# second time (else block)
Running server.js
Worker process started...
Running server.js
Worker
```

**Note:** when we testing server performance we need to do is disable the cache in network tab in the browser to make browser make our requests side by side at the same time. (browser normal behavior if we fetch data at the same time it will fech data by sequence)

---

## To unlimit the number of worker processes

```js
const express = require('express');
const cluster = require('cluster'); // cluster is build in module is used for creating child processes to take advantage of multi-core systems.
const os = require('os');

const appp = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // event loop is blocked...
  }
}

appp.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`); // process.pid to get the current process id from the operating system
});

appp.get('/timer', (req, res) => {
  // delay the response
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log('Running server.js');
if (cluster.isMaster) {
  console.log('Master has been started...');
  const NUM_WORKERS = os.cpus().length; // check amount logical cores available in the cpu for createing worker processes
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
} else {
  console.log('Worker process started...');
  appp.listen(3000); // listen on port 3000 when worker process is started
}
```

## Using PM2 Library

PM2 is a daemon process manager that will help you manage and keep your application online. Getting started with PM2 is straightforward, it is offered as a simple and intuitive CLI, installable via NPM.

```sh
$ npm install pm2@latest -g
# or
$ yarn global add pm2
# or
$ npm install pm2@latest
# or
$ yarn add pm2
```

and run (in terminal):

```sh
$ pm2 start server.js
```

**Note:** pm2 is running in the background and we can type other commands in the terminal.

### To stop the process:

```sh
$ pm2 stop <name> # for example: pm2 stop server.js
```

### To terminate and remove from list of running processes:

```sh
$ pm2 delete <name> # for example: pm2 delete server
```

### To create cluster:

remove all if else blocks from above example

```js
const express = require('express');
const os = require('os');

const appp = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {}
}

appp.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

appp.get('/timer', (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log('Running server.js');
console.log('Worker process started...');
appp.listen(3000);
```

and run:

```sh
$ pm2 start server.js -i <number or max> # for example: pm2 start server.js -i 2 or pm2 start server.js -i max
```

**-i** is instances
**2** is amount of worker processes to create
**max** is max amount of worker processes

#### To show current status of the server:

```sh
$ pm2 list
```

#### To see logs:

```sh
$ pm2 logs
```

#### To stop the server:

```sh
$ ctrl + c
```

#### To restart the server:

```sh
$ pm2 restart server.js
```

#### To see the history of logs:

```sh
$ pm2 logs --lines <number> # for example: pm2 logs --lines 100 | mean to see the last seved line of the logs
```

#### To delete the any running process from the list that tracks by PM2 (clears the list):

**Note:** store the logs to a file for performance reasons

```sh
$ pm2 delete <name> # for example: pm2 delete server
```

#### To spacify name of the file to send our logs:

```sh
$ pm2 start server.js -l <file name> -i <number or max> # for example: pm2 start server.js -l logs.txt -i max
```

#### To show more details information about the process:

to show more details information about each process by running the command:

```sh
$ pm2 show <id> # for example: pm2 show 0
```

#### To stop individual process:

```sh
$ pm2 stop <id> # for example: pm2 stop 0
```

#### To start individual process:

```sh
$ pm2 start <id> # for example: pm2 start 0
```

#### To get live dashboard to monitor in the terminal:

```sh
$ pm2 monit
```

### Zero downtime reload

Zero downtime in the context of Node.js typically refers to the ability to deploy updates or changes to a Node.js application without causing any disruption to the end users. In other words, the goal is to ensure that the application remains available and responsive even during the deployment process. Achieving zero downtime is crucial for applications that require high availability and cannot afford any service interruptions.

**Note:** if we use **pm2 restart <name>** our server is unabale to all of our users because all the processes are shut down. And then maybe thay take a little while to restart.

**Instead of terminating all the processes and restarting them all at once, we can use:**

```sh
$ pm2 reload <name> # for example: pm2 reload server
```

it will restart all the processes one by one, keeping at least one process running at all time. Zero downtime reload are all about making sure your applications are available to your users at all times, even when changes are made to your code.
