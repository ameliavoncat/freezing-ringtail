const express = require('express');
const router = express.Router();
const { Book, Author, Genre } = require('../database/db.js');


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

router.get('/admin', ( request, response ) => {
  response.render( 'admin' )
} )

router.get('/admin/book/delete/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Book.delete( book_id )
    .then( () => response.redirect('/'))
    .catch( error => error )
} )

/* GET create author page. */
router.get( '/admin/author/create', ( request, response ) => {
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

/* GET create book page. */
router.get( '/admin/book/create', ( request, response ) => {
  response.render( 'create_book' )
})


router.get( '/book/search?search-term=:searchTerm&search-by=:searchBy', ( request, response ) => {
  const {searchBy, searchTerm} = request.params
  const { query } = request

  const page = parseInt( query.page || 1 )
  const size = parseInt( query.size || 8 )

  const previousPage = page - 1 > 0 ? page - 1 : 1

console.log('search by: ' + searchBy)
console.log('search term: ' + searchTerm)
    if(searchBy==='category'||searchTerm===null){
      response.redirect( '/')


    } else {

        Book.getBooksByCategory( searchBy, seachTerm, size, page )
          .then( books => response.render( 'index', { books, page, size, nextPage: page + 1, previousPage } ) )

    }



});


// })

/* POST new book data. */
router.post( '/book/create', ( request, response ) => {
  const { title, description, author, genre } = request.body

  Book.create( title, description )
    .then( book => {
      const book_id = book.id

      Promise.all([ Author.getName( author ), Genre.getName( genre ) ])
        .then( data => {
            const [ authorData, genreData ] = data

            if ( authorData === null || []) {
              Author.create( author ).then( author => {
                const author_id = author.id

                console.log('Author id', author_id);

                Book.joinAuthor( author_id, book_id )
              })
            } else {
              Book.joinAuthor( authorData.id, book_id )
            }

            if ( genreData === null || [] ) {
              Genre.create( genre ).then( genre => {
                const genre_id = genre.id

                Book.joinGenre( genre_id, book_id )
              })
            } else {
              Book.joinGenre( genreData.id, book_id )
            }

            response.redirect( `/book/${book_id}` )
        })
    })
})

module.exports = router;
