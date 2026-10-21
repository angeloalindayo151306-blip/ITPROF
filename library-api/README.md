# Library Books API

A RESTful API for managing books in a small library, built with **Express.js**.
Created for ITPE101 (Integrative Programming & Technology) — Laboratory Activity: Building, Testing, and Deploying a RESTful API.

## Technologies Used

- Node.js
- Express.js
- Postman (API testing)
- Git & GitHub (version control)
- Render (deployment)

## Installation and Local Execution

1. Clone the repository:
   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   cd library-books-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   (or `node server.js`)
4. The API runs at `http://localhost:3000`. The port can be changed with the `PORT` environment variable.

## Book Resource

| Field    | Type    | Rules                                        |
|----------|---------|----------------------------------------------|
| `id`     | integer | Auto-generated, unique                       |
| `title`  | string  | Required, non-empty                          |
| `author` | string  | Required, non-empty                          |
| `year`   | integer | Required, between 1000 and the current year  |

## Endpoints

| Method | Route            | Purpose                                              | Success |
|--------|------------------|------------------------------------------------------|---------|
| GET    | `/`              | API status check                                     | 200     |
| GET    | `/api/books`     | Retrieve all books (optional `?author=` filter)      | 200     |
| GET    | `/api/books/:id` | Retrieve one book                                    | 200     |
| POST   | `/api/books`     | Create a book                                        | 201     |
| PUT    | `/api/books/:id` | Replace a book (all fields required)                 | 200     |
| PATCH  | `/api/books/:id` | Partially update a book (at least one field)         | 200     |
| DELETE | `/api/books/:id` | Delete a book                                        | 200     |

### Error responses

| Status | When                                                              |
|--------|-------------------------------------------------------------------|
| 400    | Invalid/missing fields, non-numeric id, or malformed JSON         |
| 404    | Book id does not exist, or route does not exist                   |
| 500    | Unexpected server error                                           |

All errors return JSON in the form `{ "error": "message" }`.

## Example Request Body (Create a Book)

`POST /api/books`

```json
{
  "title": "Introduction to Algorithms",
  "author": "Thomas Cormen",
  "year": 2009
}
```

Response (`201 Created`):

```json
{
  "id": 3,
  "title": "Introduction to Algorithms",
  "author": "Thomas Cormen",
  "year": 2009
}
```

## Testing with Postman

Import `postman/Library-Books-API.postman_collection.json` into Postman. It contains
successful and unsuccessful test cases for every endpoint. Set the `baseUrl`
collection variable to `http://localhost:3000` (local) or your Render URL (deployed).

## Links

- **GitHub Repository:** https://github.com/your-username/your-repository
- **Render Deployment:** https://your-service-name.onrender.com

## Known Limitations

- Data is stored in an **in-memory array**, so it is temporary. All changes are lost
  when the server restarts or the Render instance is replaced/spun down.
- No authentication or authorization.
- No pagination.
- Render's free tier may take up to ~1 minute to wake up on the first request.
