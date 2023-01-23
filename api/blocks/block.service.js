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


async function update(data) {
  try {
    const block = data.block
    // Saving modified block id in a variable
    var id = ObjectId(block._id)
    // Deleting _id property from the modified block before updating DB
    delete block._id
    const collection = await dbService.getCollection('blocks')
    // Updating the collection with the modified block
    await collection.updateOne({ _id: id }, { $set: { ...block } })
    // Attaching _id property back again before returning it back to the client
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
