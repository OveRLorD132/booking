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

export default router;