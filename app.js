const express = require("express");
const connection = require("./mariadb");
const cors = require("cors");
const { format } = require("date-fns");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/notes", (req, res) => {
  const query = "SELECT * FROM notes";
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Error fetching users");
      return;
    }

    const formattedResults = results.map((note) => {
      const formattedCreatedAt = format(
        new Date(note.createdAt),
        "yyyy-MM-dd HH:mm:ss"
      );
      const formattedUpdatedAt = format(
        new Date(note.updatedAt),
        "yyyy-MM-dd HH:mm:ss"
      );
      return {
        ...note,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
      };
    });

    console.log("results", formattedResults);
    res.json(formattedResults);
  });
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  const query = "INSERT INTO notes (title, content) VALUES (?, ?)";
  connection.query(query, [title, content], (err, results) => {
    if (err) {
      res.status(500).send("Error adding note");
      return;
    }
    res.status(201).json({ id: results.insertId, title, content });
  });
});

app.put("/notes/:id", (req, res) => {
  console.log("in");
  const { id } = req.params;
  const { title, content } = req.body;
  const query =
    "UPDATE notes SET title = ?, content = ?, updatedAt = NOW() WHERE id = ?";
  connection.query(query, [title, content, id], (err, results) => {
    if (err) {
      console.error("Error updating note:", err);
      res.status(500).send("Error updating note");
      return;
    }
    res.status(200).send("Note updated successfully");
  });
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notes WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send("Error deleting note");
      return;
    }
    res.status(204).send();
  });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
