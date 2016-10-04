const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const faker = require( 'faker' )

const fakeBook = book => {
  const sql = 'INSERT INTO books( title, author, description, img_url ) VALUES ( $1, $2, $3, $4 )'
  db.none( sql, [ book.title, book.author, book.description, book.img_url ] )
}

const fakeAuthor = author => {
  const sql = 'INSERT INTO authors( name, bio, img_url ) VALUES ( $1, $2, $3 )'
  db.none( sql, [ author.name, author.bio, author.img_url ] )
}

const fakeGenre = genre => {
  const sql = 'INSERT INTO genres( title ) VALUES ( $1 )'
  db.none( sql, genre.title )
}

const fakePublicator = publicator => {
  const sql = 'INSERT INTO publicators( name ) VALUES ( $1 )'
  db.none( sql, publicator.name )
}

const generate = () => {
  for( let i = 30; i >= 0; i-- ) {
    fakeBook({
      title: faker.commerce.product(),
      author: faker.commerce.product(),
      description: faker.lorem.paragraph(),
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

  for( let i = 10; i>= 0; i-- ) {
    fakeGenre({
      title: faker.commerce.product()
    })
  }

  for( let i = 8; i >= 0; i-- ) {
    fakePublicator({
      name: faker.commerce.product()
    })
  }


}

module.exports = { generate }
