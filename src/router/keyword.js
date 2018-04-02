const router = require('express').Router()

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

module.exports = function(DB){
  router.get('/', (req,res) => {
    DB.getKeywords(req.user)
    .then(keywords => {
      res.render('index', {
        keywords,
        alert: req.session.error,
        success: req.session.success
      });
    })
  })

  router.post('/create_keyword', (req,res) => {
    const keyword = req.body.keyword;
    const mapping = req.body.mapping;

    if(!mapping || mapping == "Mapping"){
      req.session.error = "Keyword must have a mapping!";
      req.session.success = null;
      return res.redirect('/')
    }

    if (keyword.split(" ").length > 1) {
      req.session.error = "Keyword must be exactly one word!";
      req.session.success = null;
      return res.redirect('/')
    }

    DB.createKeyword(req.user, keyword, mapping)
    .then(kwrd => {
      //could be null if keyword is already present
      if (!kwrd){
        req.session.error = `Cannot use the keyword ${keyword} twice!`;
        req.session.success = null;
      } else {
        req.session.success = "Keyword mapping pair successfully created!";
        req.session.error = null;
      }
      res.redirect('/')
    })
  })

  router.get('/delete_keyword/:kwrd', (req,res) => {
    const kwrd = req.params.kwrd;
    DB.deleteKeyword(req.user, kwrd)
    .then(success => {
      req.session.success = "Keyword successfully deleted"
      res.redirect('/')
    })
  })

  return router
}