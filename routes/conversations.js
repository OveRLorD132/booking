import { Router } from "express";

import authCheck from "../module/middlewares/auth-check.js";

import Conversations from "../module/db/postgres/Conversations.js";

let conversations = new Conversations();

let router = Router();

router.get('/conversations', authCheck.authCheckBrowser, (req, res) => {
  res.render('Conversations');
})

router.get('/conversations/load', authCheck.authCheckClient, async (req, res) => {
  res.send(await conversations.loadConversations(req.user.id));
})

router.post('/conversations/start', authCheck.authCheckClient, async (req, res) => {
  try {
    if(!await conversations.checkConversation(req.user.id, req.body.id)) {
      let conversation = await conversations.createConversation(req.user.id, req.body.id);
      res.status(200);
      res.send(conversation.id);
    } else {
      res.status(403);
      req.flash('error', 'Conversation Already Exists');
      res.send('Conversation Already Exists');
    }
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('error', 'Internal Server Error');
  }

})

export default router;