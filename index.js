const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users').where({ username: creds.username }).
  first()
  .then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      res.status(200).json({ message: 'welcome' })
    } else {
      res.status(401).json({ message: 'error' });
    }
  })
  .catch(err => res.json)
});


server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});


// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
