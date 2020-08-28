const mongoose = require('mongoose');

//requiring models
const Event = require('./models/Event');
const ChatHistory = require('./models/ChatHistory');


let atlasConnectionString = 'mongodb+srv://MajidMongoUser:Mongo2146@cluster0-o3pt4.azure.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(atlasConnectionString);

//connection to mongoose
mongoose
 .connect(atlasConnectionString, { useNewUrlParser: true } )
 .then( () => { console.log("Mongoose connected successfully to Mongo DB Atlas"); },
   error => { console.log("Mongoose could not connected to database: " + error); }
 );


//Functions to connect to Talk To DB

const saveEvent = (inEvent)=>{
  let tmpEvent = new Event(inEvent);
  tmpEvent.save()
    .then((data)=>{
      console.log(`Event ${inEvent.eventName} save to DB on ${new Date().toISOString()}`);
    })
    .catch((err)=>{
      console.log(`ERROR: ${err}`);
    });
};


const saveChat = (inChat)=>{
  let tmpMsg = new ChatHistory(inChat);
  tmpMsg.save()
    .then((data)=>{
      console.log(`Chat saved to DB on  ${new Date().toISOString()}`);
    })
    .catch((err)=>{
      console.log(`ERROR: ${err}`);
    });
};

const getAllEvents = ()=>{
  return new Promise((resolve,reject)=>{
      Event.find((err,documents)=>{
          if(err){
            console.log(`ERROR: ${err}`);
            reject(err);
          }else{
            let data = documents.map(x=> {
              let event = {
                eventId: x._id,
                eventName: x.eventName,
                eventDesc: x.eventDesc,
                eventDate: x.eventDate,
                eventOwner: x.eventOwner,
                socketId : x.socketId
              };
            return event;
          });
        resolve(JSON.stringify(data));
      }
    });
  });
};

const getAllChats = ()=>{
  return new Promise((resolve,reject)=>{
      ChatHistory.find((err,documents)=>{
          if(err){
            console.log(`ERROR: ${err}`);
            reject(err);
          }else{
            let data = documents.map(x=> {
              let chat = {
                chatId: x._id,
                chatUsername: x.chatUsername,
                chatMessage: x.chatMessage,
                chatRoom: x.chatRoom,
                chatDate: x.chatDate,
                socketId : x.socketId
              };
            return chat;
          });
        resolve(JSON.stringify(data));
      }
    });
  });
};

const getChatsForRoom = (room)=>{
  return new Promise((resolve,reject)=>{
      ChatHistory.where('chatRoom').eq(`${room}`).exec((err,documents)=>{
          if(err){
            console.log(`ERROR: ${err}`);
            reject(err);
          }else{
            let data = documents.map(x=> {
              let chat = {
                chatId: x._id,
                chatUsername: x.chatUsername,
                chatMessage: x.chatMessage,
                chatRoom: x.chatRoom,
                chatDate: x.chatDate,
                socketId : x.socketId
              };
            return chat;
          });
        resolve(JSON.stringify(data));
      }
    });
  });
};

module.exports.saveEvent = saveEvent;
module.exports.saveChat = saveChat;
module.exports.getAllEvents = getAllEvents;
module.exports.getAllChats = getAllChats;
module.exports.getChatsForRoom = getChatsForRoom;
