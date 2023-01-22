const express = require('express')
const { getBlocks, getBlockById, updateBlock } = require('./block.controller')
const router = express.Router()

// middleware that is specific to this router

router.get('/', getBlocks)
router.get('/:id', getBlockById)
router.put('/:id', updateBlock)

module.exports = router