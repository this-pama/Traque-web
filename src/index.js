require('dotenv').config();
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import passport from 'passport';

const LocalStrategy = require('passport-local').Strategy;

let app = express();
var cors = require('cors')
app.server = http.createServer(app);

// middleware
app.use(bodyParser.json({
  limit : config.bodyLimit
}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// passport config for users
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(cors())

//allow cross origin request
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
	next();
});

console.log('env', process.env.NODE_ENV)

//A welcome message for debugging 
app.get('/',(req,res)=> res.send("File tracking system"))

// app.get('/policy',(req,res)=> res.sendFile(path.join(__dirname + '/controller/public/Rapid/index.html')))

// api routes v1
app.use('/v1', routes);

app.server.listen(config.port);

console.log(`Started on port ${app.server.address().port}`);

export default app;