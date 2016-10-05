const express = require('express');
const router = express.Router();
const { Book } = require('../database/db.js');

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

router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Promise.all([ Book.getBookById( book_id ), Book.getAuthors( book_id ) ])
    .then( data => {
      const [ book, authors ] = data

      console.log('Data', data);


      response.render( 'book_details', { book, authors }  )
    })
});


module.exports = router;
