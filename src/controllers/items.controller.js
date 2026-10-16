const ItemStore = require('../store/itemStore');

// ─── GET /api/items ───
function getAllItems(req, res) {
  const items = ItemStore.findAll();
  res.status(200).json({
    count: items.length,
    items
  });
}

// ─── POST /api/items ───
function createItem(req, res) {
  try {
    const item = ItemStore.create(req.body);
    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (err) {
    throw err; // re-thrown to centralized errorHandler
  }
}

// ─── PUT /api/items/:id ───
function updateItem(req, res) {
  const { id } = req.params;

  // Check existence
  const existing = ItemStore.findById(id);
  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with id ${id} does not exist`
    });
  }

  // Require at least one updatable field
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Provide at least one field to update (name, description, price)'
    });
  }

  const updated = ItemStore.update(id, req.body);
  res.status(200).json({
    message: 'Item updated successfully',
    item: updated
  });
}

// ─── DELETE /api/items/:id ───
function deleteItem(req, res) {
  const { id } = req.params;

  const success = ItemStore.delete(id);
  if (!success) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with id ${id} does not exist`
    });
  }

  res.status(200).json({
    message: 'Item deleted successfully',
    id
  });
}

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
};

