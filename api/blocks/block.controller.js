const blockService = require('./block.service.js')

// GET LIST
async function getBlocks(req, res) {
  try {
    const blocks = await blockService.query()
    res.json(blocks)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get blocks' })
  }
}

// GET BY ID 
async function getBlockById(req, res) {
  try {
    const blockId = req.params.id
    const block = await blockService.getById(blockId)
    res.json(block)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get block' })
  }
}



// PUT (Update block)
async function updateBlock(req, res) {
  try {
    const block = req.body
    const updatedBlock = await blockService.update(block)
    res.json(updatedBlock)
  } catch (err) {
    res.status(500).send({ err: 'Failed to update block' })
  }
}

module.exports = {
  getBlocks,
  getBlockById,
  updateBlock,
}
