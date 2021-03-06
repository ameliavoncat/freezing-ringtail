const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books LIMIT $1 OFFSET $2'

const getBookById = 'SELECT * FROM books WHERE id=$1'
const deleteBook = 'DELETE FROM books WHERE id = $1'

const getAuthors = 'SELECT * FROM authors'
const getAuthorById = 'SELECT * FROM authors WHERE id = $1'
const getAuthorName = 'SELECT name FROM authors WHERE name = $1'

const getGenres = 'SELECT * FROM genres'
const getGenreName = 'SELECT name FROM genres WHERE name = $1'

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
  `

const getAuthorIdByBookId = 'SELECT author_id FROM book_authors WHERE book_id = $1 LIMIT 1'

const getGenreIdByBookId = 'SELECT genre_id FROM book_genres WHERE book_id = $1 LIMIT 1'

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
    book_genres.book_id = $1
  LIMIT
    1
`

const createAuthor = `
INSERT
INTO
  authors( name, bio, image_url )
VALUES
  ($1, $2, $3)
RETURNING
  id
`

const createBook = `
INSERT
INTO
  books( title, description, image_url )
VALUES
  ($1, $2, $3)
RETURNING
  id
`

const createGenre = `
INSERT
INTO
  genres( name )
VALUES
  ($1)
RETURNING
  id
`

const joinAuthorAndBook = `
  INSERT INTO
    book_authors( author_id, book_id )
  VALUES ( $1, $2 )
`

const joinGenreAndBook = `
  INSERT INTO
    book_genres( genre_id, book_id )
  VALUES ( $1, $2 )
`

const updateBook = `
  UPDATE
    books
  SET
    title=$1, description=$2, image_url=$3
  WHERE
    id = $4
`

const updateGenre = 'UPDATE genres SET name=$1 WHERE id = $2'

const updateAuthor = 'UPDATE authors SET name=$1 WHERE id = $2'

const Search = {
  forBooks: ( search, size, page ) => {
    const variables = [ size, page * size ]
    let sql = `SELECT DISTINCT(books.*) FROM books`

    if ( search ){
      let search_query = search
        .toLowerCase()
        .replace(/^ */, '%')
        .replace(/ *$/, '%')
        .replace(/ +/g, '%')

      variables.push( search_query )

      sql += `
      LEFT JOIN book_authors ON books.id=book_authors.book_id
      LEFT JOIN authors ON authors.id=book_authors.author_id
      LEFT JOIN book_genres ON books.id=book_genres.book_id
      LEFT JOIN genres ON genres.id=book_genres.genre_id
      WHERE LOWER(books.title)  LIKE $${variables.length}
      OR LOWER(authors.name) LIKE $${variables.length}
      OR LOWER(genres.name) LIKE $${variables.length}
      ORDER BY books.id ASC
      LIMIT $1 OFFSET $2
      `
    }

    return db.any( sql, variables )
  }
}


// -----------------------------------------------

Book = {
  getAll: ( size, page ) => {
    return db.any( getAllBooks, [ size, page * size - size ] )
  },
  getBookById: book_id => db.one( getBookById, [ book_id ] ),
  getAuthors: book_id => db.any( getAuthorByBookId, [ book_id ] ),
  queryBooks: ( column, option ) => db.any( queryBooks, [ column, option ] ),
  getGenres: book_id => db.any( getGenreByBookId, [ book_id ]),
  create: ( title, description, image_url ) => db.one( createBook, [ title, description, image_url ] ),
  joinAuthor: ( author_id, book_id ) => db.none( joinAuthorAndBook, [ author_id, book_id ] ),
  joinGenre: ( genre_id, book_id ) => db.none( joinGenreAndBook, [ genre_id, book_id ] ),
  delete: id => db.none( deleteBook, [ id ]),
  update: ( id, title, description, image_url ) => db.none( updateBook, [ title, description, image_url, id ])
}

Author = {
  getAuthors: () => db.any( getAuthors ),
  getName: name => db.oneOrNone( getAuthorName, [ name ] ) ,
  getOne: (author_id) => db.one( getAuthorById, [ author_id ]),
  create: ( name, bio, image_url ) => db.one( createAuthor, [ name, bio, image_url ] ),
  getIdByBookId: book_id => db.one( getAuthorIdByBookId, [ book_id ] ),
  updateName: ( author_id, author ) => db.none( updateAuthor, [ author, author_id ] )
}

Genre = {
  getGenres: () => db.any( getGenres ),
  getName: name => db.manyOrNone( getGenreName, [ name ] ),
  create: name => db.one( createGenre, [ name ] ),
  getIdByBookId: book_id => db.one( getGenreByBookId, [ book_id ] ),
  update: ( genre_id, genre ) => db.none( updateGenre, [ genre, genre_id ] )
}

module.exports = { Book, Author, Genre, Search }
