/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var user = require('./controllers/user');
var message = require('./controllers/message');
var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var rss = require('./controllers/rss');
var staticController = require('./controllers/static');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var github = require('./controllers/github');
var search = require('./controllers/search');
var passport = require('passport');
var configMiddleware = require('./middlewares/conf');
var config = require('./config');

var router = express.Router();

// home page
router.get('/', site.index);
// sitemap
router.get('/sitemap.xml', site.sitemap);
// mobile app download
router.get('/app/download', site.appDownload);

// sign controller
if (config.allow_sign_up) {
  router.get('/signup', sign.showSignup);  // Jump to the registration page
  router.post('/signup', sign.signup);  // Submit registration information
} else {
  // github
  router.get('/signup', function (req, res, next) {
    return res.redirect('/auth/github')
  });
}
router.post('/signout', sign.signout);  // Log out
router.get('/signin', sign.showLogin);  // Sign in
router.post('/signin', sign.login);  // Log in cheack
router.get('/active_account', sign.activeAccount);  // Activate account

router.get('/search_pass', sign.showSearchPass);  // Forget password page
router.post('/search_pass', sign.updateSearchPass);  // Update pass
router.get('/reset_pass', sign.resetPass);  // Reset password page
router.post('/reset_pass', sign.updatePass);  // Reset

// user controller
router.get('/user/:name', user.index); // User home page
router.get('/setting', auth.userRequired, user.showSetting); // Setting page
router.post('/setting', auth.userRequired, user.setting); // Submit personal info
router.get('/stars', user.listStars); // List stars
router.get('/users/top100', user.top100);  // Top 100 users
router.get('/user/:name/collections', user.listCollectedTopics);  // Saved topics
router.get('/user/:name/topics', user.listTopics);  // User-posted topics
router.get('/user/:name/replies', user.listReplies);  // User-replied topics
router.post('/user/set_star', auth.adminRequired, user.toggleStar); // Set star
router.post('/user/cancel_star', auth.adminRequired, user.toggleStar);  // Cancle star
router.post('/user/:name/block', auth.adminRequired, user.block);  // Block user
router.post('/user/:name/delete_all', auth.adminRequired, user.deleteAll);  // Delete user
router.post('/user/refresh_token', auth.userRequired, user.refreshToken);  // refresh token

// message controler
router.get('/my/messages', auth.userRequired, message.index); // Message page

// topic

// Post topic page
router.get('/topic/create', auth.userRequired, topic.create);

router.get('/topic/:tid', topic.index);  // Topic
router.post('/topic/:tid/top', auth.adminRequired, topic.top);  // Put a topic at the top
router.post('/topic/:tid/good', auth.adminRequired, topic.good); // Set a topic good
router.get('/topic/:tid/edit', auth.userRequired, topic.showEdit);  // Edit a topic
router.post('/topic/:tid/lock', auth.adminRequired, topic.lock); // Block a topic

router.post('/topic/:tid/delete', auth.userRequired, topic.delete);

// Submit a new topic
router.post('/topic/create', auth.userRequired, limit.peruserperday('create_topic', config.create_post_per_day, {showJson: false}), topic.put);

router.post('/topic/:tid/edit', auth.userRequired, topic.update);
router.post('/topic/collect', auth.userRequired, topic.collect); // Save a topic
router.post('/topic/de_collect', auth.userRequired, topic.de_collect); // Unsave a topic

// reply controller
router.post('/:topic_id/reply', auth.userRequired, limit.peruserperday('create_reply', config.create_reply_per_day, {showJson: false}), reply.add); // Submit reply
router.get('/reply/:reply_id/edit', auth.userRequired, reply.showEdit); // Edit reply page
router.post('/reply/:reply_id/edit', auth.userRequired, reply.update); // Edit a reply
router.post('/reply/:reply_id/delete', auth.userRequired, reply.delete); // Delete a reply
router.post('/reply/:reply_id/up', auth.userRequired, reply.up); // Give a like
router.post('/upload', auth.userRequired, topic.upload); //Upload picture

// static
router.get('/about', staticController.about);
router.get('/faq', staticController.faq);
router.get('/getstart', staticController.getstart);
router.get('/robots.txt', staticController.robots);
router.get('/api', staticController.api);

//rss
router.get('/rss', rss.index);

// github oauth
router.get('/auth/github', configMiddleware.github, passport.authenticate('github'));
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/signin' }),
  github.callback);
router.get('/auth/github/new', github.new);
router.post('/auth/github/create', limit.peripperday('create_user_per_ip', config.create_user_per_ip, {showJson: false}), github.create);

router.get('/search', search.index);

if (!config.debug) { // 这个兼容破坏了不少测试
	router.get('/:name', function (req, res) {
	  res.redirect('/user/' + req.params.name)
	})
}


module.exports = router;
