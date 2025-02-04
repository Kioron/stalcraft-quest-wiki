const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Glue5Stick2022!',
    database: 'stalcraftx'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Connection failed:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

  app.get('/queststable', (req, res) => {
    connection.query('SELECT * FROM queststable', (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });