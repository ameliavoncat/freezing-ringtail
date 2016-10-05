const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books LIMIT $1 OFFSET $2'

const countBooks = 'SELECT COUNT(*) FROM books'
const countAuthors = 'SELECT COUNT(*) FROM authors'
const countGenres = 'SELECT COUNT(*) FROM genres'
const countPublishers = 'SELECT COUNT(*) FROM publishers'

const getBookById = 'SELECT * FROM books WHERE id=$1'
const queryBooks = 'SELECT * FROM books WHERE $1 = $2'

const getAuthors = 'SELECT * FROM authors'
const queryAuthors = 'SELECT * FROM authors WHERE $1 = $2'

const getGenres = 'SELECT * FROM genres'

const getPublishers = 'SELECT * FROM publishers'
const getAuthorByBookId =   `
  SELECT
    *
  FROM
    authors
  JOIN
    book_authors
  ON
    authors.id = book_authors.author_id
  WHERE
    book_authors.book_id=$1
  `;
const getGenreByBookId = `
  SELECT
    *
  FROM
    genres
  JOIN
    book_genres
  ON
    genres.id = book_genres.genre_id
  WHERE
    book_genres.book_id=$1
  LIMIT
    1
`;

// -----------------------------------------------

Count = {
  countAuthors: () => db.any( countAuthors ),
  countBooks: () => db.any( countBooks ),
  countGenres: () => db.any( countGenres ),
  countPublishers: () => db.any( countPublishers )
}

Book = {
  getAll: ( size, page ) => {

    return db.any( getAllBooks, [ size, page*8 ] )
  },
  getBookById: book_id => db.one( getBookById, [ book_id ] ),
  getAuthors: book_id => db.any( getAuthorByBookId, [ book_id ] ),
  getGenres: book_id => db.any( getGenreByBookId, [book_id]),
  queryBooks: ( column, option ) => db.any( queryBooks, [ column, option ] )
}

Author = {
  getAuthors: () => db.any( getAuthors ),
  queryAuthors: ( column, option ) => db.one( getAuthorById, [ column, option ] )
}

Genre = {
  getGenres: () => db.any( getGenres )
}

Publicator = {
  getPublishers: () => db.any( getPublishers )
}

module.exports = { Count, Book, Author, Genre, Publicator }
