const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const engine = require('ejs-mate');
const dotenv= require('dotenv').config()
const mongoose= require('mongoose')
const Contact= require('./models/contacts');

const app = express();
app.engine('ejs', engine);
app.set('views', path.join(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const dbUrl= process.env.DB_URL
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);


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