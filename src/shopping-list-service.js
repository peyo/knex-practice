const ShoppingListService = {
  // read or get all items from the shopping list
  getAllItems(knex) {
    return knex.select('*').from('shopping_list')
  },

  // read or get one item from the shopping list
  getById(knex, id) {
    return knex
      .from('shopping_list')
      .select('*')
      .where('id', id)
      .first()
  },

  // create or insert item for the shopping list
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  // update item
  updateItem(knex, id, newItemFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemFields)
  },

  // delete item from the shopping list
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete()
  },
}

module.exports = ShoppingListService