const express = require('express');
const router = express.Router();
const { Book } = require('../database/db.js');
const { Author } = require( '../database/db.js' )

/* GET home page. */
router.get('/', ( request, response ) => {

  const { query } = request

  let page = query.page || 1
  const size = query.size || 8

  page = parseInt( page ) + 1


  let pageBack = query.page || 1
  const sizeBack = query.size || 8

  pageBack = parseInt( pageBack ) +- 1

  Book.getAll( size, page )
    .then( books => response.render( 'index', { books, page, size } ) )
});

/* GET book details page. */
router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Book.getBookById( book_id )
    .then( book => {
      response.render( 'book_details', { book }  )
    })
    .catch( error => { message: error.message } )
});

/* GET author details page. */
router.get('/author/:author_id', ( request, response ) => {
  const { author_id } = request.params

  Author.queryAuthors( author_id )
  .then( author => {
    response.render( 'author-detail', { author } )
  })
});




module.exports = router;
