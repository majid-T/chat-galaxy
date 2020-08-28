const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    chatUsername:{
        type:String,
        require:true
    },
    chatMessage:{
        type:String,
        require:true
    },
    chatRoom:{
        type:String,
        require:true
    },
    chatDate:{
        type:String,
        require:true
    },
    socketId:{
        type:String,
        require:true
    }
});

const ChatHistory = mongoose.model('ChatHistory',chatHistorySchema,'ChatHistory');
module.exports = ChatHistory;
