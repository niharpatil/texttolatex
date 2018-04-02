const router = require('express').Router()
const multer  = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads') )
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

const fs = require('fs')


const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();
const spawn = require("child_process").spawn;

// Performs text detection on the image file
function processGCloudOutput(boxes){
  return boxes.slice(1,boxes.length).map(box => {
    return {
      topLeft: box.boundingPoly.vertices[0],
      word: box.description
    }
  })
}

module.exports = function(DB){
  router.post('/upload_image', upload.single('notes_image'), (req,res,next) => {
    const title = req.body.title;

    client
    .documentTextDetection(req.file.path,{
      "languageHints": [
        "en"
      ]
    })
    .then(results => {
      const textBoxes = results[0].textAnnotations;
      return DB.getKeywords(req.user)
      .then(keywords => {
        return {
          keywords,
          textBoxes
        }
      })
    }).then(jawn => {
      const textBoxes = jawn.textBoxes;
      const keywords = jawn.keywords;
      const jsonFilePath = `json/${req.user.id}-${req.file.filename.substring(0,req.file.filename.length-4)}.json`;
      fs.writeFile(jsonFilePath, JSON.stringify({
        processed: processGCloudOutput(textBoxes),
        title,
        author: req.user.firstname + ' ' + req.user.lastname,
        preference_mapping: keywords
      }, null, '\t'), 'utf8', () => {
        console.log('wrote')
        fs.unlink(req.file.path , (err) => {
          if (err) {
            req.session.error = "Image upload failed!";
            req.session.success = null;
          } else {
            req.session.error =  null;
            req.session.success = "Image upload succeeded!";
          }

          const pythonProcess = spawn('python3',["process.py", jsonFilePath, 5, `latex/${title}`]);
          pythonProcess.on('close', function (){
            return res.sendFile(path.join(global.base_dir,`latex/${title}.tex`))
          });
        })
      });

      
    })
    .catch(err => {
      
    });
      
  });

  return router
}