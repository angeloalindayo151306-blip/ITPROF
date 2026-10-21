const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON request-body parsing
app.use(express.json());

// In-memory storage (temporary)
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', year: 2008 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', year: 1999 },
];
let nextId = 3;

// Validation helper: returns an error message string, or null if valid.
// When `partial` is true (PATCH), only provided fields are checked.
function validateBook(body, partial = false) {
  const { title, author, year } = body || {};
  const currentYear = new Date().getFullYear();

  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return 'title is required and must be a non-empty string';
    }
  }
  if (!partial || author !== undefined) {
    if (typeof author !== 'string' || author.trim() === '') {
      return 'author is required and must be a non-empty string';
    }
  }
  if (!partial || year !== undefined) {
    if (!Number.isInteger(year) || year < 1000 || year > currentYear) {
      return `year is required and must be an integer between 1000 and ${currentYear}`;
    }
  }
  return null;
}

// Parse and validate the :id route parameter
function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'id must be a positive integer' });
    return null;
  }
  return id;
}

// Root route - API status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Library Books API is running',
    endpoints: '/api/books',
  });
});

// READ all (optional ?author= filter)
app.get('/api/books', (req, res) => {
  let result = books;
  if (req.query.author) {
    const q = req.query.author.toLowerCase();
    result = books.filter((b) => b.author.toLowerCase().includes(q));
  }
  res.status(200).json({ count: result.length, data: result });
});

// READ one
app.get('/api/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: `Book with id ${id} not found` });
  res.status(200).json(book);
});

// CREATE
app.post('/api/books', (req, res) => {
  const error = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, year } = req.body;
  const book = { id: nextId++, title: title.trim(), author: author.trim(), year };
  books.push(book);
  res.status(201).json(book);
});

// UPDATE (full replace)
app.put('/api/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: `Book with id ${id} not found` });

  const error = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, year } = req.body;
  book.title = title.trim();
  book.author = author.trim();
  book.year = year;
  res.status(200).json(book);
});

// UPDATE (partial)
app.patch('/api/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: `Book with id ${id} not found` });

  const { title, author, year } = req.body || {};
  if (title === undefined && author === undefined && year === undefined) {
    return res.status(400).json({ error: 'Provide at least one of: title, author, year' });
  }
  const error = validateBook(req.body, true);
  if (error) return res.status(400).json({ error });

  if (title !== undefined) book.title = title.trim();
  if (author !== undefined) book.author = author.trim();
  if (year !== undefined) book.year = year;
  res.status(200).json(book);
});

// DELETE
app.delete('/api/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return res.status(404).json({ error: `Book with id ${id} not found` });

  const [removed] = books.splice(index, 1);
  res.status(200).json({ message: `Book with id ${id} deleted`, deleted: removed });
});

// Malformed JSON and other errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
