const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
  imageUrl:{
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Image', imageSchema)