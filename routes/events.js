const express=require('express');
const mongoose = require('mongoose');
const router=express.Router();
const Event = require('../models/event');
const {isAdmin, isLoggedIn} = require('../middleware');




// all events page

router.get('/',isLoggedIn, async (req, res) => {
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
    res.redirect(`/events/${event._id}`)
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
    res.redirect(`/events/${event._id}`)
});


// delete event route

router.delete('/:id',isAdmin, async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the event.')
    res.redirect('/events');
})


module.exports=router;