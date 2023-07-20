import { Router } from "express";

let router = Router();

import Users from "../module/db/postgres/Users.js";

let users = new Users();

import Rent from "../module/db/postgres/Rent.js";
import Feedback from "../module/db/postgres/Feedback.js";

let feedback = new Feedback();

import authCheck from "../module/middlewares/auth-check.js";

import Conversations from "../module/db/postgres/Conversations.js";
import feedbackUserCheck from "../module/middlewares/feedback-user-check.js";

let conversations = new Conversations();

let rent = new Rent();

router.get('/public-profile/:id', async (req, res) => {
  res.render('PublicProfile');
})

router.get('/public-profile/:id/data', async (req, res) => {
  if(req.params.id == 1) {
    res.status(403);
    res.send('Access Denied');
    return;
  } 
  try {
    let profile = await users.getPublicProfile(req.params.id);
    if(profile.type === 'Host') res.send({ profile, ads: await rent.getVisibleAds(req.params.id)})
    else res.send({ profile });
  } catch(err) {
    res.status(500);
    res.send('Error');
  }
})

router.get('/public-profile/:id/load-comments', async (req, res) => {
  try {
    let comments = await feedback.loadComments(req.params.id);
    res.status(200);
    res.send(comments);
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
})

router.get('/public-profile/:id/check-conversation', authCheck.authCheckClient, async (req, res) => {
  try {
    let count = await conversations.checkConversation(req.params.id, req.user.id);
    res.status(200);
    if(count > 0) {
      let conversation = await conversations.getConversation(req.params.id, req.user.id);
      res.send(conversation.id);
    } else if(count == 0) res.send(null); 
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
})

router.post('/public-profile/:id/comment', authCheck.authCheckClient, async (req, res) => {
  try {
    let id = await feedback.addComment(req.user.id, req.params.id, req.body.text);
    let comment = await feedback.getComment(id);
    res.status(200);
    res.send(comment);
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
})

router.patch('/public-profile/:id/comment/edit', authCheck.authCheckClient, feedbackUserCheck, async (req, res) => {
  try {
    try {
      if(!req.body.text) throw new Error('Invalid Input');
      if(req.body.text.length > 500) throw new Error('Comment is too long');
    } catch(err) {
      res.status(400);
      req.flash('error', err);
      res.send('Validation Error');
      return;
    }
    await feedback.editComment(req.body.text, req.body.id);
    res.status(200);
    req.flash('success', 'Comment edited successfully');
    res.send('Success');
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
})

router.delete('/public-profile/:id/comment/delete', authCheck.authCheckClient, feedbackUserCheck, async (req, res) => {
  try {
    await feedback.deleteComment(req.body.id);
    res.status(200);
    req.flash('success', 'Comment deleted successfully');
    res.send('Success');
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
})

export default router;