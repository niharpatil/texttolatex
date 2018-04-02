const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keywordSchema = new Schema({
  keyword: {
    type: String,
    required: true
  },
  mapping: {
    type: ['blist', 'nlist', 'item', 'endblist', 'endnlist', '$', '$$'],
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Keyword', keywordSchema)