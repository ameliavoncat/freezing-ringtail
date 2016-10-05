const express = require('express');
const router = express.Router();
const { Book, Author } = require('../database/db.js');


/* GET home page. */
router.get('/', ( request, response ) => {

  const { query } = request

  const page = parseInt( query.page || 1 )
  const size = parseInt( query.size || 8 )

  const previousPage = page - 1 > 0 ? page - 1 : 1

  Book.getAll( size, page )
    .then( books => response.render( 'index', { books, page, size, nextPage: page + 1, previousPage } ) )
});

/* GET book detail. */
router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Promise.all([ Book.getBookById( book_id ), Book.getAuthors( book_id ), Book.getGenres( book_id ) ])
    .then( data => {
      const [ book, authors, genres ] = data

      response.render( 'book_details', { book, authors, genres }  )
    })
});

/* GET create author page. */
router.get( '/author/create', ( request, response ) => {
  response.render( 'create_author' )
} )

/* POST new author data. */
router.post( '/author/create', ( request, response ) => {
   const { name, bio } = request.body
console.log (name, bio)
   Author.create(  name, bio  )
    .then( author => {
      response.redirect( '/author/' + author.id )
    })
})

router.get( '/author/:author_id', ( request, response ) => {
  const { author_id } = request.params
  Author.getOne( author_id )
    .then( author => {
      response.render( 'author_details', { author } )
    } )
})


module.exports = router;
