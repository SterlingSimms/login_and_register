let express     = require('express'),
    app         = express(),
    path        = require('path'),
    session     = require('express-session'),
    body_parser = require('body-parser'),
    mongoose    = require('mongoose');
    // bcrypt      = require('bcryptjs');

app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(session({
    secret: '^P%mUWCwF4hWAhtgUb8BrRqWPuR$%4w^@FSB3j*VfumMEJB8SPpr57%aqRmsEyHGhJKcvgu9#W&5ZvUrCZ*q4c%8^A9RJ49@Mf3X',
    proxy: true,
    resave: false,
    saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/user', function() {
    console.log(mongoose.connection.readyState + ' ' + "1 = connected");
});
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    name: {
        first: {
            type: String, 
            required: [true, "Please enter your name"],
            trim: true
        },
        last: {
            type: String, 
            required: [true, "Please enter your name"],
            trim: true
        },
    },
    email: {
        type: String, 
        required: [true, "Please enter your e-mail"],
        trim: true

    },
    birthdate: {
        type: Date, 
        required: [true, "Please enter your birthdate"],
        trim: true
    },

    password: {
        type: String, 
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 32,
        validate: {
            validator: function( value ) {
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
            },
            message: "Your password must have 1 number, 1 uppercase letter and 1 special character"
        },
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});
mongoose.model('User', UserSchema);
var user = mongoose.model('User');


app.get('/', (req, res) => {
    res.render('index');
  });
  
  app.post('/register', (req, res) => {
    let user = new User(req.body);
    let salt = bcrypt.genSaltSync(10);
    bcrypt.hash(user.password, salt, (err, hash) => {
        if(err){
            console.log('Password could not be hashed');
        }
        else {
            user.password = hash;
            user.save(function(err){
        if(err){
            console.log(user.errors);
            res.render('index', {errors: user.errors});
        } 
        else{
            res.redirect('/logged_in');
            }
            });
        };
    });
});
  
  app.post('/login', (req, res) => {
    var user = User.findOne({email: req.body.email}, function(err, user){
        if(err){
            res.render('index', {errors: user.errors});
        } 
        else{
            bcrypt.compare(req.body.password, user.password, function(err, response){
        if(response == true){
            res.redirect('/logged_in');
        } 
        else{
            res.render('index', {errors: user.errors});
            };
            });
        };
    });
});

let server = app.listen(6789, () => {
    console.log("listening on port 6789");
});
// io.sockets.on('connection', function (socket) {
//     console.log("Client/socket is connected!");
//     console.log("Client/socket id is: ", socket.id);
// });