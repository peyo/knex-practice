const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function () {
  let db

  // array used as an example during testing that mocks data.
  let testShoppingList = [
    {
      id: 1,
      name: 'Pepperphony',
      price: "1.40",
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Breakfast',
    },
    {
      id: 2,
      name: 'Shamburger',
      price: "3.50",
      date_added: new Date('1985-12-02T16:28:32.615Z'),
      checked: false,
      category: 'Main',
    },
    {
      id: 3,
      name: 'Facon',
      price: "1.90",
      date_added: new Date('1993-06-23T16:28:32.615Z'),
      checked: false,
      category: 'Breakfast',
    },
    {
      id: 4,
      name: 'Salami-get-this-straight',
      price: "3.00",
      date_added: new Date('1970-08-12T16:28:32.615Z'),
      checked: false,
      category: 'Snack',
    },
    {
      id: 5,
      name: 'Mi-steak',
      price: "7.67",
      date_added: new Date('1932-01-01T16:28:32.615Z'),
      checked: false,
      category: 'Main',
    },
  ]

  // prepares the database connection using the db variable.
  // db will be available in all of our tests.
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  // before all tests run and after each individual test, empty the
  // blogful_articles table.
  before(() => db('shopping_list').truncate())
  afterEach(() => db('shopping_list').truncate())

  // after all tests run, let go of the db connection.
  after(() => db.destroy())

  // whenever we have a context with data present, include a beforeEach()
  // hook within the context that adds the appropriate data to the table.
  context(`Given 'shopping_list' has data (objects in an array)`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testShoppingList)
    })

    // read or get all items from the shopping list
    it(`getAllItems() resolves all shopping list items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testShoppingList.map(item => ({
            ...item
          })))
        })
    })

    // read or get one item from the shopping list
    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdItem = testShoppingList[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdItem.name,
            price: thirdItem.price,
            date_added: thirdItem.date_added,
            checked: thirdItem.checked,
            category: thirdItem.category
          })
        })
    })

    // update item
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'updated name',
        price: "1.25",
        date_added: new Date(),
        checked: false,
        category: 'Main',
      }
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          })
        })
    })

    // delete item from the shopping list
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test articles array without the "deleted" article
          const expected = testShoppingList.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected)
        })
    })
  })

  // for wheen there is no data, such as,
  // in scenarios where new items are being added to the shopping list.
  context(`Given 'shopping_list' has no data`, () => {

    // read or get all items from an empty shopping list
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    // create or insert item for the shopping list
    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        name: 'new name',
        price: '1.25',
        date_added: new Date(),
        checked: true,
        category: 'Snack',
      }
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: new Date(newItem.date_added),
            checked: newItem.checked,
            category: newItem.category
          })
        })
    })
  })
})