/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const userRoute = require('./routes/users');
const teamRoute = require('./routes/teams');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/users', userRoute);
app.use('/teams', teamRoute);

const selectAllUsers = 'SELECT * FROM users';
const selectAllEvents = `SELECT id, team_name, DATE_FORMAT(date, "%M %d") as date, 
TIME_FORMAT(time, "%h:%i %p")as time, location, description 
FROM events
ORDER BY YEAR(date) ASC, MONTH(date) ASC, DAY(date) ASC
LIMIT 4;`;

/* connection with Google server */
const con = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,

});

// eslint-disable-next-line consistent-return
con.connect((err) => {
  console.log(process.env.password);
  if (err) {
    return err;
  }
  console.log('connected!');
});

app.get('/', (req, res) => {
  res.send('hello from the server');
});

/* shows all events in events table */
app.get('/events', (req, res) => {
  con.query(selectAllEvents, (err, results) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      data: results,
    });
  });
});

/* adds user to users table */
app.get('/users/add', (req, res) => {
  const {
    firstname, lastname, email, username, password, type,
  } = req.query;
  const body = {
    firstname, lastname, email, username, password, type,
  };
  const insertUser = 'INSERT INTO users SET ?';
  // eslint-disable-next-line consistent-return
  con.query(insertUser, body, (err) => {
    if (err) {
      return res.send(err);
    }
    res.send('successfully added user');
  });
});

/* fake data for backend work */
app.get('/api/events', (req, res) => {
  const events = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Joe', lastName: 'Swanson' },
    { id: 3, firstName: 'Kanye', lastName: 'West' },
  ];

  res.json(events);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
