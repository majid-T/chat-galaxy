const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName:{
        type:String,
        require:true
    },
    eventDesc:{
        type:String,
        require:true
    },
    eventDate:{
        type:String,
        require:true
    },
    eventOwner:{
        type:String,
        require:true
    },
    socketId:{
        type:String,
        require:true
    }
});

const Event = mongoose.model('Event',eventSchema,'Event');
module.exports = Event;
