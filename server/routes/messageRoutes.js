const express = require('express');
const router=express.Router();
const{sendMessage,getMessages}=require('../controlllers/messageController');

router.post('/',sendMessage);
router.get('/:senderId/:receiverId',getMessages);

module.exports=router;