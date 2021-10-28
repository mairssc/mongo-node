//Running home.html and favorite.html via port
//Ex: http://localhost:8080/home.html will run home.html

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const { response } = require('express');
const url = 'mongodb://127.0.0.1:27017/node-mongo-hw' // change this as needed

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();
const Schema = mongoose.Schema;

const item = new Schema({
  imgUrl: String,
  date: String,
  isFavorite: String
});

const NASA = mongoose.model("NASA", item)


// The method of the root url. Be friendly and welcome our user :)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the APOD app.' });   
});

router.get("/favorite", function (req, res) {
  NASA.find({isFavorite: "True"}, (err, data) => {
    if(err){
      console.log(err);
      return
    }
    res.json(data);
  })
});

router.post("/add", function (req, res) {
  const nasa = NASA({
    imgUrl: req.body.imgUrl,
    date: req.body.date,
    isFavorite: req.body.isFavorite
  });
  nasa.save((error, document) => {
    res.json({
      status:"success",
      id: nasa._id,
      imgUrl: req.body.imgUrl,
      date: req.body.date,
      isFavorite: req.body.isFavorite
    })
  })
});

router.delete("/delete", function (req, res) {
  NASA.deleteOne({date : req.body.date})
    .then((response) => response.json)
    .then((data) => console.log(data));
});


// router.delete("/db/reset", (req,res) => {
//   NASA.deleteMany({});
// })

router.put("/put/:date/:isFavorite", (req, res) => {
  NASA.findOne({ 
    date: req.params.date
  }, (err, data) => {
    if(err){
      console.log(err);
      return
    }
    if(data.length == 0) {
        console.log("No record found")
        return
    }
    data.isFavorite = req.params.isFavorite
    data.save((error, doc) => {
      res.json(data)
    })
  })
}) 

// router.delete("/db/delete/:id", (req, res) => {
//   NASA.findByIdAndDelete(req.params.id, (error, todo) => {
//     if (error) {
//       res.json({ status: "failure"})
//     } else {
//       res.json(todo)
//     }
//   })
// })




// router.get("/db/favorites", (req, res) => {
//   NASA.find({isFavorite: "True"}, (err, data) => {
//     if(err){
//       console.log(err);
//       return
//     }
//     res.json(data);
//   })
// })

router.get("/db/all", (req, res) => {
  NASA.find().then((nasa) => {
    res.json({ message: 'Return all nasa.', nasa: nasa});
  })
});

// router.post("/db/:date/:imgUrl/:isFavorite", function(req, res) {
//     const nasa = NASA({
//       imgUrl: req.params.imgUrl,
//       date: req.params.date,
//       isFavorite: req.params.isFavorite
//     })
//     nasa.save((error, document) => {
//       res.json({
//         status:"success",
//         id: nasa._id,
//         imgUrl: req.params.imgUrl,
//         date: req.params.date,
//         isFavorite: req.params.isFavorite
//       })
//     })
// })


//Used to locally run home and favorite
app.use(express.static('../client'));

app.use('/api', router); // API Root url at: http://localhost:8080/api


app.listen(port);
console.log('Server listening on port ' + port);