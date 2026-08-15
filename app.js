const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Event = require('./models/event');

mongoose.connect('mongodb://localhost:27017/events', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));




// home/landing page

app.get('/', (req, res) => {
    res.render('home')
});

// all events page

app.get('/events', async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events })
});


// new event page

app.get('/events/new', (req, res) => {
    res.render('events/new');
})


// create new event route

app.post('/events', async (req, res) => {
    const event = new Event(req.body.event);
    await event.save();
    res.redirect(`/events/${event._id}`)
})


//each event show page

app.get('/events/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send(`Invalid event ID: ${id}`);
    }

    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).send('Event not found');
    }

    res.render('events/show', { event });
});


//event edit page

app.get('/events/:id/edit', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send(`Invalid event ID: ${id}`);
    }

    const event = await Event.findById(id);
    if (!event) {
        return res.status(404).send('Event not found');
    }

    res.render('events/edit', { event });
});


// edit event route

app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event });
    res.redirect(`/events/${event._id}`)
});


// delete event route

app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.redirect('/events');
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})