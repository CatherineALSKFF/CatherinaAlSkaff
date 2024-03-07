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
    "https://kit.fontawesome.com",
    "https://www.googletagmanager.com"
];

const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com"
];

const connectSrcUrls = [
    "'self'",
    "https://ka-f.fontawesome.com",
    "https://www.google-analytics.com", // Added for Google Analytics
    "https://region1.google-analytics.com"
];

const fontSrcUrls = [
    "'self'",
    "https://fonts.gstatic.com/",
    "https://ka-f.fontawesome.com",
    "https://kit-free.fontawesome.com",
];

// Add this line to include Vimeo's player URL in your frame sources
const frameSrcUrls = [
    "https://player.vimeo.com/",
    // You can add other domains here if you need to load frames from elsewhere
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
                "https://kit-free.fontawesome.com"
            ],
            fontSrc: fontSrcUrls,
            // Add the frameSrc directive here
            frameSrc: frameSrcUrls,
        },
    })
);




  const projects = [
    {
      title: 'Fasting Focused - Personal Training Platform',
      techUsed: "HTML, CSS, JS, React, Next.js, Tailwind, Stripe, Google Analytics",
      description: "I collaborated with Fasting Focused making their online platform from the ground up. With my team we successfully marketed the Fasting Focused programs on Facebook, Instagram and Google and achieved incredible results",
      link: 'https://fastingfocused.com/',
      videoUrl: 'https://player.vimeo.com/video/905111178?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&controls=0&muted=1',
      githubUrl: "https://github.com/CatherineALSKFF/Fast-Focused"
    },
    {
      title: 'TechFundMe - Blockchain Crowdfunding Platform',
      techUsed: "HTML, CSS, JS, React, Tailwind, Thirdweb, web3, SmartContracts, Solidity",
      description: 'Developed TechFundMe, a blockchain-based crowdfunding platform focused on supporting technology causes...',
      link: 'https://techfundme.net/',
      videoUrl: 'https://player.vimeo.com/video/905110814?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&controls=0&muted=1',
      githubUrl: "https://github.com/CatherineALSKFF/techfundme"
    },
    {
      title: 'Skaf Stones - Exotic Stones Gallery Website',
      techUsed: "HTML, CSS, JS, ejs, bootstrap, mongodb, mongoose, node.js, express.js",
      description: 'Collaborated with Skaf Stones Masonry, creating platform representing the brand and marketed their business generating new clients...',
      link: 'https://skafstones.store',
      videoUrl: 'https://player.vimeo.com/video/905110035?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&controls=0&muted=1',
      githubUrl: "https://github.com/CatherineALSKFF/SkafStones"
    }
  ];
  




app.get('/', (req, res)=>{
    res.render('main', { googleAnalyticsId: process.env.GOOGLE_ANALYTICS })
})

app.get('/projects', (req,res)=>{

    res.render('projects', { googleAnalyticsId: process.env.GOOGLE_ANALYTICS , projects: projects })
})

app.get('/contact', (req, res) => {
    let message = '';
    if (req.query.message === 'thankyou') {
        message = "Thank you for your message, I'll be getting back to you soon.";
    }
    res.render('contact', { googleAnalyticsId: process.env.GOOGLE_ANALYTICS, message: message });
});


app.post('/contact', async (req, res) => {
    const contacts = new Contact(req.body.contact);
    await contacts.save();
    // Redirect to /contact with a query parameter
    res.redirect('/contact?message=thankyou');
});




app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
}) 