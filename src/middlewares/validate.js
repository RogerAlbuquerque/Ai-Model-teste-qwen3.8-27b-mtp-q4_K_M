/**
 * Validates item payload using a whitelist approach.
 * Only `name`, `description`, and `price` are allowed.
 */

const ALLOWED_FIELDS = ['name', 'description', 'price'];

class ValidationError extends Error {
  constructor(messages) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = messages;
  }
}

function validateItemBody(req, res, next) {
  const body = req.body;
  const errors = [];

  if (!body || typeof body !== 'object') {
    return next(new ValidationError(['Request body must be a JSON object']));
  }

  // Check for unexpected fields (prevents mass-assignment / prototype pollution)
  const providedFields = Object.keys(body);
  const unknownFields = providedFields.filter(f => !ALLOWED_FIELDS.includes(f));
  if (unknownFields.length > 0) {
    errors.push(`Unexpected fields: ${unknownFields.join(', ')}`);
  }

  // Validate `name` (required on create)
  if (req.method === 'POST') {
    if (!body.name) {
      errors.push('"name" is required');
    } else if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push('"name" must be a non-empty string');
    } else if (body.name.length > 255) {
      errors.push('"name" must be at most 255 characters');
    }
  }

  // Validate `description` (optional)
  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push('"description" must be a string');
    } else if (body.description.length > 1000) {
      errors.push('"description" must be at most 1000 characters');
    }
  }

  // Validate `price` (optional, must be positive number)
  if (body.price !== undefined) {
    if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
      errors.push('"price" must be a valid number');
    } else if (body.price < 0) {
      errors.push('"price" must be non-negative');
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  // Whitelist: strip any fields not in ALLOWED_FIELDS before passing to controller
  const cleanData = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      cleanData[field] = body[field];
    }
  }
  req.body = cleanData;

  next();
}

/**
 * Validates that :id param is a positive integer.
 */
function validateItemId(req, res, next) {
  const id = req.params.id;

  if (!/^\d+$/.test(id)) {
    return next(Object.assign(new Error('Invalid item ID'), { statusCode: 400 }));
  }

  const numId = parseInt(id, 10);
  if (numId < 1) {
    return next(Object.assign(new Error('Item ID must be a positive integer'), { statusCode: 
400 }));
  }

  req.params.id = numId;
  next();
}

module.exports = { validateItemBody, validateItemId, ValidationError };

