const express = require('express');
const app = express();
const fs = require('fs');
var facepp = require('face-plusplus-node');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var User = require('./models/userregModel.js');

var port = process.env.PORT || 8080;

app.set('view engine','ejs');
app.set('views',__dirname+'/public');
app.use(express.static('public'));
app.use(express.static('utemp'));

app.use(bodyParser.json({limit: '20mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}))

facepp.setApiKey('GkkMaojxuBxJy0Jzcuj7-xP3imkzJlPo');
facepp.setApiSecret('X8N4wovdh1F09pVIm-nldNGiUDtBzTFv');

//var url = 'mongodb://localhost/facerecognicer';
var url = 'varmongodb+srv://sai:kumar123@cluster0-fi2sh.mongodb.net/facerecognicer?retryWrites=true&w=majority';
//connect to MongoDB
mongoose.connect(url,{ useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});






app.get('/',(req,res)=>{
  res.render('index',({
    attend:false
  }))
})





app.post('/uregister',(req,res)=>{
    
  let imgname =  './utemp/'+ new Date().getTime().toString()+'.jpg';
  var base64Data = req.body.upic.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFile(imgname, base64Data, 'base64', function(err) { });
  imgname = (imgname).slice(7);
  app.locals.userId = path.basename(imgname,'.jpg');
  
  let model = new User({
    userId: app.locals.userId,
    uname: req.body.uname,
    sname: req.body.sname,
    uemail: req.body.uemail,
    gender: req.body.gender,
    ucourses: req.body.ucourses,
    uphno: req.body.uphno,
    place: req.body.place,
    addr: req.body.addr,
    imgpath: imgname,
    imgtoken: req.body.utoken
  });
  model.save().then(doc => {res.redirect('/regsuccess');}).catch(err => {})

})





app.get('/regsuccess',(req,res)=>{
    User.findOne({userId: app.locals.userId}, function (err, doc){
      res.render('regsuccess',({
        uname: doc.uname,
        sname: doc.sname,
        uemail: doc.uemail,
        gender: doc.gender,
        ucourses: doc.ucourses,
        uphno: doc.uphno,
        place: doc.place,
        addr: doc.addr,
        imgpath: doc.imgpath
      }))
    });
})






app.post('/facerecogniser',async(req,res)=>{

  var facepaths = [];
  var confid = [];

  //getting user query images into array
  var course = req.body.usatcourses;
  var query;
  if(course == 'All'){ query = {}; }
  else{ query = { ucourses: course} }
  let objArray = await User.find(query)
  objArray.forEach(function(obj){
    facepaths.push(obj.imgtoken);
  });

  
  //executing face comapring logic
  var len = facepaths.length;
  var fimg1 = req.body.atoken;
  facepaths.forEach((fileitem) => {
    var parameters = {
      face_token1: fimg1,
      face_token2: fileitem
      };
      facepp.post('/compare', parameters, function(err, res) {
          confid.push(res.confidence);
          len--;
          if(len == 0){
            displayArr(confid)
          }
      });
  });

  //display results
 function displayArr(confArr){
    var newarr = confArr.map(val => val === undefined ? 0 : val);
    var isAllZero = newarr.every(item => item === 0);
      if(isAllZero){
          res.render('index',({
            attend: 'warn1',
            text1: "Oops! No matching found, may be you are a new user If yes kindly register."
          }))
      }
      else{
        var high = newarr.indexOf(Math.max(...newarr));
          if(Math.max(...newarr) > 95){
            uid = facepaths[high];
            User.findOne({imgtoken:uid},(err,doc)=>{
                  res.render('index',({
                    attend: 'dresult',
                    uname: doc.uname,
                    sname: doc.sname,
                    uemail: doc.uemail,
                    gender: doc.gender,
                    ucourses: doc.ucourses,
                    uphno: doc.uphno,
                    place: doc.place,
                    addr: doc.addr,
                    imgpath: doc.imgpath
                  }))
            });
          }
          else{
              res.render('index',({
                attend: 'warn2',
                text2: "Ohh! No match Found. very low accuracy. If you are registered user try again once, If not please register."
              }))
          }
      }
  }

})




app.listen(port,(err)=>{
  console.log("server started at port :"+port)
});
