# Movie API

## Pre-requisites

* Node.js 14.0.0 or higher
* [Sqlite3](http://www.sqlitetutorial.net/)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```
4. The API will be available at `http://localhost:3000`

## API Documentation

### Health Check
```
GET /health
```
Returns the API health status.

### List All Movies
```
GET /api/movies
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "data": [
    {
      "imdbId": "tt0111161",
      "title": "The Shawshank Redemption",
      "genres": [{"id": 18, "name": "Drama"}],
      "releaseDate": "1994-09-23",
      "budget": "$25,000,000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "hasMore": true
  }
}
```

### Movie Details
```
GET /api/movies/:id
```
**Parameters:**
- `id`: IMDB ID of the movie

**Response:**
```json
{
  "data": {
    "imdbId": "tt0111161",
    "title": "The Shawshank Redemption",
    "description": "Two imprisoned men bond over a number of years...",
    "genres": [{"id": 18, "name": "Drama"}],
    "releaseDate": "1994-09-23",
    "budget": "$25,000,000",
    "runtime": 142,
    "average_rating": "9.3",
    "original_language": "en",
    "production_companies": "Columbia Pictures"
  }
}
```

### Movies By Year
```
GET /api/movies/year/:year
```
**Parameters:**
- `year`: 4-digit year (e.g., 1994)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `sort` (optional): Sort order, either "ASC" or "DESC" (default: "ASC")

**Response:**
```json
{
  "data": [
    {
      "imdbId": "tt0111161",
      "title": "The Shawshank Redemption",
      "genres": [{"id": 18, "name": "Drama"}],
      "releaseDate": "1994-09-23",
      "budget": "$25,000,000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "year": "1994",
    "sort_order": "ASC",
    "hasMore": true
  }
}
```

### Movies By Genre
```
GET /api/movies/genre/:genre
```
**Parameters:**
- `genre`: Genre name (e.g., "Drama")

**Query Parameters:**
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "data": [
    {
      "imdbId": "tt0111161",
      "title": "The Shawshank Redemption",
      "genres": [{"id": 18, "name": "Drama"}],
      "releaseDate": "1994-09-23",
      "budget": "$25,000,000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "genre": "Drama",
    "hasMore": true
  }
}
```

## Error Responses
All endpoints return appropriate HTTP status codes:
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Resource not found
- `500`: Internal Server Error

Error response format:
```json
{
  "errors": [
    {
      "msg": "Page must be a positive integer",
      "param": "page",
      "location": "query"
    }
  ]
}
```