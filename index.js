const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');


//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_localstrategy');
const passportJWT = require('./config/passport_JWT');
const passportGoogle = require('./config/passport_google_oauth2_strategy');

const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${env.db}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setting up chat server
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat Server listening on Port 5000');
const path = require('path');


//for development
const sassMiddleware = require('node-sass-middleware');
if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

console.log("Enviroment - " + env.name);
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});




app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log(__dirname + env.asset_path);
app.use(express.static(__dirname + env.asset_path));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
//extract style and script from sub page in to layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//mongo store is used to store the session cookie in db


app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

console.log(env.google_clientSecret);
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes/index'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on Port : ${port}!`);
})
