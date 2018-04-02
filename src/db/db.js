const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, function(){
  console.log('successfully connected to database')
})

mongoose.Promise = global.Promise

const User = require('./models/User')
const Keyword = require('./models/Keyword')
const Image = require('./models/Image')

//USER FUNCTIONS
function findUserById(id){
  return User.findById(id)
}

function findOrCreateUser(profile, accessToken, refreshToken){
  return User.findOne({ facebookId: profile.id })
  .then(user => {

    if (user == null) {
      return new User({
        facebookId: profile.id,
        firstname: profile.displayName.split(' ')[0],
        lastname: profile.displayName.split(' ')[1],
        accessToken,
        refreshToken
      }).save()
    } else {
      return user
    }
  })
}

//null if keyword exists; otherwise creates keyword

function getKeywords(user){
  return Keyword.find({user})
}

function createKeyword(user, keyword, mapping){
  return Keyword.findOne({
    user: user.id,
    keyword
  })
  .then(keywordObj => {
    if  (!keywordObj) {
      return new Keyword({
        user: user.id,
        keyword,
        mapping
      }).save()
    } else {
      return null
    }
  })
}

function deleteKeyword(user, keywordId){
  return Keyword.remove({
    _id: keywordId
  })
}

// Image functions

function createImage(user, imageUrl){
  return new Image({
    user: user.id,
    imageUrl
  }).save()
}

module.exports = {
  findOrCreateUser,
  findUserById,
  getKeywords,
  createKeyword,
  deleteKeyword,
  createImage
}