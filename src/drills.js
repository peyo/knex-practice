require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// get items by searching text
const qry = (searchTerm) => {
  knexInstance
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .from('shopping_list')
    .then(result => {
    console.log(result)
   })
}

const searchTerm = "lettuce";
qry(searchTerm)

// get items by page number
const qry = (pageNumber) => {
const productsPerPage = 6;
const offset = productsPerPage * (pageNumber - 1);
  knexInstance
 .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

const pageNumber = 5;
qry(pageNumber)

// get all items by x days ago
const qry = (daysAgo) => {
  knexInstance
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result)
    })
}

const daysAgo = 7;
qry(daysAgo)

// get the total cost for each category
const qry = () => {
  knexInstance
    .select('category')
    .from('shopping_list')
    .groupBy('category')
    .sum('price AS total price')
    .then(result => {
      console.log(result)
    })
}

qry()