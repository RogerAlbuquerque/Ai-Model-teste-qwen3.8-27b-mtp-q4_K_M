const express = require('express');
const router = express.Router();
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/items.controller');
const { validateItemBody, validateItemId } = 
require('../middlewares/validate');

// GET /api/items — Retrieve all items
router.get('/', getAllItems);

// POST /api/items — Create a new item
router.post('/', validateItemBody, createItem);

// PUT /api/items/:id — Update an item by ID
router.put('/:id', validateItemId, validateItemBody, updateItem);

// DELETE /api/items/:id — Delete an item by ID
router.delete('/:id', validateItemId, deleteItem);

module.exports = router;

