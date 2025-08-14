const express = require('express');
const {
  getAll,
  create,
  update,
  remove
} = require('../controllers/serverController');



const router = express.Router();

// GET all servers
router.get('/', getAll);

// POST a new server
router.post('/', create);

// PUT update a server
router.put('/:id', update);

// DELETE a server
router.delete('/:id', remove);

module.exports = router;
