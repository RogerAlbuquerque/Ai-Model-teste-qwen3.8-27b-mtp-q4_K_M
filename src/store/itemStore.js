/**
 * Simple in-memory store with ID generation.
 * In production, replace with a database (Postgres, Mongo, etc.)
 */

let nextId = 1;
const items = [];

// Seed with sample data (optional, for easy testing)
items.push(
  { id: nextId++, name: 'Sample Item', description: 'A demo item', price: 9.99 }
);

const ItemStore = {
  findAll() {
    return items;
  },

  findById(id) {
    return items.find(item => item.id === id) || null;
  },

  create(data) {
    const newItem = { id: nextId++, ...data };
    items.push(newItem);
    return newItem;
  },

  update(id, data) {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, id }; // id is immutable
    return items[index];
  },

  delete(id) {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  }
};

module.exports = ItemStore;

