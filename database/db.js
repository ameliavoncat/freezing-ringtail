const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books LIMIT $1 OFFSET $2'
const getOneBook = 'SELECT * FROM books WHERE id=$1'

const pageSize=5
const pageOffset=function(page){
  page=page||1;
  return (page-1)*pageSize;
}

Book = {
  getAll: page => db.any( getAllBooks,[pageSize, pageOffset] ),
  getOne: book_id => db.one( getOneBook, [ book_id ] )
}

module.exports = { Book }
