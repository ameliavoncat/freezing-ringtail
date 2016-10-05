const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const faker = require( 'faker' )

const fakeGenres = [ 'sci-fi', 'fantasy', 'fiction', 'non-fiction', 'mystery' ]

const fakeBook = book => {
  const sql = 'INSERT INTO books( title, author, description, year, publisher, img_url ) VALUES ( $1, $2, $3, $4, $5, $6 )'
  db.none( sql, [ book.title, book.author, book.description, book.year, book.publishers, book.img_url ] )
}

const fakeAuthor = author => {
  const sql = 'INSERT INTO authors( name, bio, img_url ) VALUES ( $1, $2, $3 )'
  db.none( sql, [ author.name, author.bio, author.img_url ] )
}

const fakeGenre = genre => {
  const sql = 'INSERT INTO genres( title ) VALUES ( $1 )'
  db.none( sql, genre.title )
}

const fakePublisher = publisher => {
  const sql = 'INSERT INTO publishers( name ) VALUES ( $1 )'
  db.none( sql, publisher.name )
}

const generate = () => {
  for( let i = 30; i >= 0; i-- ) {
    fakeBook({
      title: faker.commerce.product(),
      author: faker.commerce.product(),
      description: faker.lorem.paragraph(),
      year: Math.floor( Math.random() * 1000 ),
      publisher: faker.commerce.product(),
      img_url: faker.image.people()
    })
  }

  for( let i = 20; i >= 0; i-- ) {
    fakeAuthor({
      name: faker.commerce.product(),
      bio: faker.lorem.paragraph(),
      img_url: faker.image.people()
    })
  }

  for( let i = fakeGenres.length-1; i>= 0; i-- ) {
    fakeGenre({
      title: fakeGenres[i]
    })
  }

  for( let i = 8; i >= 0; i-- ) {
    fakePublisher({
      name: faker.commerce.product()
    })
  }
}

  const findBooks = () => {
  const sql = 'SELECT * FROM books'
  return db.any( sql )
}

const findAuthors = () => {
  const sql = 'SELECT * FROM authors'
  return db.any( sql )
}

const bookAuthors = ( ids ) => {
  const sql = 'INSERT INTO book_authors( book_id, author_id ) VALUES ( $1, $2 )'
  db.any( sql, [ ids.book_id, ids.author_id ])
}

const findGenres = () => {
  const sql = 'SELECT * FROM genres'
  return db.any( sql )
}

const bookGenres = ( ids ) => {
  const sql = 'INSERT INTO book_genres( book_id, genre_id ) VALUES ( $1, $2 )'
  db.any( sql, [ ids.book_id, ids.genre_id ] )
}

const generateBookAuthors = () => {
  findBooks().then( books => {

    Promise.resolve( findAuthors() )
      .then( authors => {
        const queries = []
        //console.log( authors, books );

        for( let i = 30; i >= 0; i-- ) {
          queries.push(
            bookAuthors({
              book_id: faker.random.arrayElement( books ).id,
              author_id: faker.random.arrayElement( authors ).id
            })
          )
        }

        Promise.all( queries )
      })
  })
}

const generateBookGenres = () => {
  findBooks().then( books => {

    Promise.resolve( findGenres() )
      .then( genres => {
        const queries = []
        //console.log( authors, books );

        for( let i = 30; i >= 0; i-- ) {
          queries.push(
            bookGenres({
              book_id: faker.random.arrayElement( books ).id,
              genre_id: faker.random.arrayElement( genres ).id
            })
          )
        }

        Promise.all( queries )
      })
  })
}



module.exports = { generate, generateBookAuthors, generateBookGenres }
