const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
  try {
    const collection = await dbService.getCollection('blocks')
    return collection.find().toArray()
  } catch (err) {
    throw err
  }
}

async function getById(blockId) {
  try {
    const collection = await dbService.getCollection('blocks')
    const block = collection.findOne({ _id: ObjectId(blockId) })
    return block
  } catch (err) {
    throw err
  }
}


async function update(block) {
  try {
    var id = ObjectId(block._id)
    delete block._id
    const collection = await dbService.getCollection('blocks')
    await collection.updateOne({ _id: id }, { $set: { ...block } })
    block._id = id
    return block
  } catch (err) {
    throw err
  }
}

module.exports = {
  query,
  getById,
  update,
}
