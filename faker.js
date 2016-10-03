const databaseName = 'freezing-ringtail'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const faker = require( 'faker' )

const fakeBook = book => {
  const sql = 'INSERT INTO books( title, description, img_url ) VALUES ( $1, $2, $3 )'
  db.none( sql, [ book.title, book.description, book.img_url ] )
}

const generate = () => {
  for( let i = 30; i >= 0; i-- ) {
    fakeBook({
      title: faker.commerce.product(),
      description: faker.lorem.paragraph(),
      img_url: faker.image.people()
    })
  }
}

module.exports = { generate }
