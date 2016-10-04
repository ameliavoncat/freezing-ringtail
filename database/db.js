const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books'
const getOneBook = 'SELECT * FROM books WHERE id=$1'

Book = {
  getAll: () => db.any( getAllBooks ),
  getOne: book_id => db.one( getOneBook, [ book_id ] )
}

module.exports = { Book }
