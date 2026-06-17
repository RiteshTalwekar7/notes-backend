import express from "express";
import cors from 'cors';
import { configDotenv } from "dotenv";

configDotenv();
const PORT = process.env.PORT || 3001;

const app = express();


app.use(cors());
app.use(express.json());

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
];

app.get('/api/notes', (request, response) => {
  response.json(notes);
})

const generateId = () => {
  const maxId = notes.length > 0 ?
    Math.max(...notes.map(note => Number(note.id)))
    :
    0;

  const newId = String(maxId + 1);
  return newId;
}

app.post('/api/notes', (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }
  const newNote = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes = notes.concat(newNote);
  response.json(newNote);
})


app.get('/api/notes/:id', (request, response) => {
  const { id } = request.params;
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params;
  const note = notes.filter(note => note.id === id);

  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
})