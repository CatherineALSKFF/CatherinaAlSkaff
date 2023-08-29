const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const engine = require('ejs-mate');
const dotenv= require('dotenv').config()
const mongoose= require('mongoose')
const Contact= require('./models/contacts');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
 const MongoStore = require('connect-mongo');





const app = express();
app.engine('ejs', engine);
app.set('views', path.join(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const dbUrl= process.env.DB_URL || 'mongodb://127.0.0.1:27017/catherinaalskaff'
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);





const store= MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600 
})

store.on('error', (e)=>{
   console.log('session store error', e)
})

const secret= process.env.SECRET || 'donttellsecret'

const sessionConfig = {
 store: store,
   secret,
   resave: false,
   cookie: {
       httpOnly: true,
       expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
       maxAge: 1000 * 60 * 60 * 24 * 7
   }
}
app.use(session(sessionConfig));
// app.use(flash());
// app.use(
//    helmet()
//  );

 const scriptSrcUrls = [
   "https://stackpath.bootstrapcdn.com/",
   "https://cdnjs.cloudflare.com/",
   "https://cdn.jsdelivr.net",
    "https://kit.fontawesome.com"

];
const styleSrcUrls = [ 
   "https://stackpath.bootstrapcdn.com/" ,
   "https://fonts.googleapis.com/" ,
   "https://cdn.jsdelivr.net" ,
   "https://kit-free.fontawesome.com"
];
const connectSrcUrls = [
    "'self'",
    "https://ka-f.fontawesome.com",
];
const fontSrcUrls = [  
    "'self'",  
    "https://fonts.gstatic.com/",
    "https://ka-f.fontawesome.com",
  "https://kit-free.fontawesome.com",
];

app.use(
   helmet.contentSecurityPolicy({
       directives: {
           defaultSrc: [],
           connectSrc: ["'self'", ...connectSrcUrls],
           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
           workerSrc: ["'self'", "blob:"],
           objectSrc: [],
           imgSrc: [
               "'self'",
               "blob:",
               "data:",
               "https://images.unsplash.com/",
               , "https://kit-free.fontawesome.com"
           ],
           fontSrc: fontSrcUrls,
       },
   })
 );




app.get('/', (req, res)=>{
    res.render('main')
})

app.post('/contact', async(req,res)=>{
    const contacts= new Contact(req.body.contact);
    await contacts.save();   
res.redirect('/')
})

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
}) 