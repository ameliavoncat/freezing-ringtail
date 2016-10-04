const express = require('express');
const router = express.Router();
const { Book } = require('../database/db.js');

/* GET home page. */
router.get('/', ( request, response ) => {

  Book.getAll().then( books => response.render('index', { books }))
});

router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Book.getBookById( book_id )
    .then( book => {

      response.render( 'book_details', { book }  )
    })
    .catch( error => { message: error.message } )
});

module.exports = router;
