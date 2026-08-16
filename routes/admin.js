const express=require('express');
const mongoose = require('mongoose');
const router=express.Router();
const Event = require('../models/event');
const {isAdmin, isLoggedIn} = require('../middleware');


router.get('/',isAdmin, async (req, res) => {
    const events = await Event.find({});
    res.render('admin', { events });
});









module.exports=router;


