const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/assets/');      
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});

var db = mongo.connect('mongodb://127.0.0.1:27017/angularProfile', function(err, response){
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to ' + db, ' + ', response);
    }
});

const app = express();
// app.use('/uploads', express.static('uploads'));
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

var Schema = mongo.Schema;

var UsersSchema = new Schema({
    name: { type: String },
    age: { type: String }, 
    profileImage: { type: String }
}, { versionKey: false });

var model = mongo.model('users', UsersSchema, 'users');

app.post('/api/SaveUser', upload.single('profileImage'), function(req, res){
    // var mod = new model(req.body);
    console.log(req.file);
    var mod = new model({
        name: req.body.name,
        age: req.body.age,
        profileImage: req.file.path.slice(4)
    }); 
    mod.save(function(err, data){
        if (err) {
            res.send(err);
        } else {
            res.send({data: "Profile has been successfully added."});
        }
    });
})

app.post('/api/UpdateUser', function(req, res){
    var mod = new model(req.body);
    model.findByIdAndUpdate(req.body._id, { name: req.body.name, age: req.body.age},
    function(err, data) {
        if (err){
            res.send(err);
        } else {
            res.send({data: "Record has been updated."});
        }
    });
})

app.post('/api/DeleteUser', function(req, res){
    model.remove({ _id: req.body.id }, function(err) {
        if (err){
            res.send(err);
        } else {
            res.send({data: "Record has been deleted."});
        }
    });
})


app.get('/api/GetUser', function(req, res){
    model.find({}, function(err, data) {
        if (err){
            res.send(err);
        } else {
            res.send(data);
        }
    });
})

app.listen(8080, function () {
    console.log('Profile app listening on port 8080.')
})