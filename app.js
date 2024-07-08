const express = require("express");
const connection = require("./mariadb");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/notes', (req, res) => {
    const query = 'SELECT * FROM notes';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching users');
            return;
        }
        console.log("results", results);
        res.json(results);
    });
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
  connection.query(query, [title, content], (err, results) => {
      if (err) {
          res.status(500).send('Error adding note');
          return;
      }
      res.status(201).json({ id: results.insertId, title, content });
  });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM notes WHERE id = ?';
  connection.query(query, [id], (err, results) => {
      if (err) {
          res.status(500).send('Error deleting note');
          return;
      }
      res.status(204).send();
  });
});

app.listen(8080, () => {
    console.log(`Server running on port 8080`);
});