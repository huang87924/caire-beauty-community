var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config        = require('../config');
var util          = require('util');
var logger = require('./logger');
var transporter     = mailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;
var async = require('async')

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  if (config.debug) {
    return;
  }

  // 重试5次
  async.retry({times: 5}, function (done) {
    transporter.sendMail(data, function (err) {
      if (err) {
        // 写为日志
        logger.error('send mail error', err, data);
        return done(err);
      }
      return done()
    });
  }, function (err) {
    if (err) {
      return logger.error('send mail finally error', err, data);
    }
    logger.info('send mail success', data)
  })
};
exports.sendMail = sendMail;

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (who, token, name) {
  var from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to      = who;
  var subject = config.name + 'Your account is activated';
  var html    = '<p>Hello：' + name + '</p>' +
    '<p>This email is to confirm that you have successfully created a' + config.name + 'account，Before you can starting using this new account, we require that you verify your email by clicking on the link below, or copy-pasting it into your browser:</p>' +
    '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">Link</a>' +
    '<p>Thank you,</p>' +
    '<p>' + config.name + '</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + 'Account password reset';
  var html = '<p>Hello：' + name + '</p>' +
    '<p>You recently asked to reset your' + config.name + 'password.Click the link below to reset your password. If you don’t reset your password within 30 minutes, you’ll need to request another password reset. </p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">Link</a>' +
    '<p>If you did not ask us for help with your' + config.name + 'password, let us know right away. </p>' +
    '<p>Thank you,</p>' +
    '<p>' + config.name + '</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
