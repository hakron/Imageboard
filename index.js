const db = require('./Angular/sql/db');
const multer = require('multer');
const diskStorage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, __dirname + '/uploads');
  },
  filename: function (req, file, callback){
    callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
  }
});
const uploader = multer({
  storage: diskStorage,
  limits: {
    filesize: 2097152
  }
});
const express = require('express');
const app = express();
const port = 8080;
app.use(require('body-parser').urlencoded({extended:false}));
// <=========== static folder =========>
app.use("/Angular", express.static(__dirname + "/Angular"));
app.use("/uploads", express.static(__dirname+ "/uploads"));
// <======= end ==========>
// <========== get imgs ==========>
app.get('/home', function(req,res){
  db.getImgs().then(function(results){
    if(results) {
      res.send(results);
    }else{
      res.json({
        succes: false
      });
    }

  });
});
// <=========== insert imgs in the db ===========>
app.post('/upload/img', uploader.single('file'), function(req, res) {
  if (req.file) {
    db.insertImgs(req.file.filename, req.body.author, req.body.title, req.body.description).then(function(results){
      // console.log(results, "results after insertImgs");
      return res.json(results)({
        msg: "Upload complete"

      });

    }).catch(function (err) {
      console.log(err);
    })

  } else {
    res.json({
      success: false,
    });
  }
});
// <======== get single img in images page ===========>
app.get('/singleImg/:id/data', function(req, res){
  Promise.all ([
    db.getSingleImg(req.params.id),
    db.getComments(req.params.id),
  ]).then( data =>{
    const image = data[0];
    image.comments = data[1];
    res.json(image);
  }).catch(function (err) {
    console.log(err);
    res.json({
      succes: false
    });
  });
});
app.post('/singleImg/:id/delete', function(req, res){
  db.deleteImg(req.params.id).then(function(results){
    if(results) {
      res.json({
        succes: true
      });
    }else{
      res.json({
        succes: false
      });
    }
  });
});
// <=============== insert commnet in image age ================>
app.post('/singleImg/:id/data', function (req, res) {

  db.insertComment(req.params.id, req.body.body, req.body.name).then(function (results) {
    res.json(results);
  }).catch(function (err) {
    console.log(err);
  });
});
app.get('*', function (req,res) {
  res.sendFile(__dirname + '/Angular/index.html');
});

app.listen(port, function () {
  console.log("hi there", port);
});
