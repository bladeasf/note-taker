import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = new URL(import.meta.url).pathname;

const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/notes', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/notes', async (req, res) => {
  const notes = await getNotes();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  newNote.id = await generateUniqueId();

  const notes = await getNotes();
  notes.push(newNote);
  await saveNotes(notes);

  res.json(newNote);
});

async function getNotes() {
  const data = await fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8');
  return JSON.parse(data) || [];
}

async function saveNotes(notes) {
  await fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
}

async function generateUniqueId() {
  const notes = await getNotes();
  return notes.length + 1;
}

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});