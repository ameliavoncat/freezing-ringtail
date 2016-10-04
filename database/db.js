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


const pageSize=8
const pageOffset=function(page){
  page=page||1;
  return (page-1)*pageSize;
}

Book = {
  getAll: page => db.any( getAllBooks,[pageSize, pageOffset] ),
  getBookById: book_id => db.one( getBookById, [ book_id ] ),
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
  getOne: book_id => db.one( getOneBook, [ book_id ] )
}

module.exports = { Book }
