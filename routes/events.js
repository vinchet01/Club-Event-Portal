const express=require('express');
const mongoose = require('mongoose');
const router=express.Router();
const Event = require('../models/event');
const {isAdmin, isLoggedIn} = require('../middleware');




// all events page

router.get('/', async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events })
});





// new event page

router.get('/new',isAdmin, (req, res) => {
    res.render('events/new');
})


// create new event route

router.post('/',isAdmin, async (req, res) => {
    const event = new Event(req.body.event);
    await event.save();
    req.flash('success','Successfully made a new event!');
    res.redirect('../admin')
})


//each event show page

router.get('/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
        req.flash('error','Cannot find that event!')
        return res.redirect('/events');
    }

    res.render('events/show', { event });
});


//event edit page

router.get('/:id/edit',isAdmin, async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
        req.flash('error','Cannot find that event!')
        return res.redirect('/events');
    }

    res.render('events/edit', { event });
});


// edit event route

router.put('/:id',isAdmin, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event });
    req.flash('success','Successfully updated the event.')
    res.redirect('../admin');
});

// event registrations

router.post('/:id/register', isLoggedIn, async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        req.flash('error', 'Event not found');
        return res.redirect('/events');
    }

    if (req.user.role === 'admin') {
        req.flash('error', 'Admins cannot register for events');
        return res.redirect(`/events/${event._id}`);
    }

    const alreadyRegistered = event.registrations.some(
        registration => registration.email === req.user.email
    );

    if (alreadyRegistered) {
        req.flash('error', 'You have already registered for this event');
        return res.redirect(`/events/${event._id}`);
    }

    if (event.registrations.length >= event.capacity) {
        req.flash('error', 'This event is full');
        return res.redirect(`/events/${event._id}`);
    }

    event.registrations.push({
        username: req.user.username,
        email: req.user.email
    });

    await event.save();

    req.flash('success', 'Successfully registered for the event');
    res.redirect(`/events/${event._id}`);
});


// See event registrations page
router.get('/:id/registrations', isAdmin, async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
        req.flash('error', 'Event not found');
        return res.redirect('/events');
    }


    res.render('eventregistrations', {
        event});
});


// delete event route

router.delete('/:id',isAdmin, async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the event.')
    res.redirect('../admin');
})


module.exports=router;