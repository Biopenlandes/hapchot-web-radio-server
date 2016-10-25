var express =   require("express");
var multer  =   require('multer');
/*var gm      = require('gm');*/
var gm = require('gm').subClass({
    imageMagick: true
});
var fs      = require('fs')
/*var thumb = require('node-thumbnail').thumb;*/
var app     =   express();

//"start": "concurrently \"ng serve\" \"node server/server.js\"",

/*var uploadDir = '../src/assets/uploads';*/
var uploadDir = './src/assets/uploads';

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    //console.log("destination", file);
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {    
    //console.log("filename", file);
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage}).single('file');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static('assets'));

var nbreThumbnail;

var resize = function(file, width, name)
{
  gm(file.path)
  .resize(width)
  .noProfile()
  .write(file.destination + '/' + name + '/' + file.originalname, function (err) {
    nbreThumbnail++;
    if (!err) console.log('done : ', nbreThumbnail);
    else console.log('erreur',err);
    
    if (nbreThumbnail == 3)
    {
      console.log("deleting original file");
      fs.unlink(file.path, function() {});
    }
  });
}

app.post('/api/upload-image', upload, function (req, res, next) {
  nbreThumbnail = 0;
  console.log("file ",req.file.path);
  resize(req.file, 100, 'small');
  resize(req.file, 300, 'medium');
  resize(req.file, 600, 'large');  

  res.end("done");  
})

var PORT = 8080;

app.listen(PORT, function () {
  console.log('Working on port ' + PORT);
});