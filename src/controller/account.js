import mongoose from 'mongoose';
import { Router } from 'express';
import User from '../model/user';
import passport from 'passport'
import Account from '../model/account'

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';
import {sendMail, sendSms } from '../middleware/service'

var randomize = require('randomatic');

var async = require('async');
var crypto = require('crypto');

export default({ config, db }) => {
  let api = Router();

  // '/v1/account/login'
  api.post('/login',(req, res, next)=>{
    Account.findOne({ email: req.body.email},(err, account)=>{
      if (err) return res.status(500).json(err);

      if(account && account.disable) return res.status(200).json({ message: "Account has been disabled"});

      next()
    })
  }, passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), 
    generateAccessToken, 
    respond
  );

    // '/v1/account/logout'
    api.get('/logout', (req, res) => {
      req.logout();
      res.status(200).json({ message: 'success'});
    });


    // '/v1/account/:id' - GET a specific account
    api.get('/:id', (req, res) => {
      Account.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).json(err);
        return res.json({
          message: 'success',
          data: user
        });
      });
    });


    // '/v1/account/disable/:id' - GET - Disable a particular account
    api.post('/disable/:id', (req, res) => {
      Account.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).json(err);

        user.disable = req.body.disable;
        user.save();

        return res.json({
          message: 'success',
          data: user
        });
      });
    });


  // '/v1/account' - GET all account
  api.get('/', authenticate, (req, res) => {
    Account.find( {}, (err, user) => {
      if (err) return res.status(500).json(err);
      return res.json({
        message: 'success',
        data: user
      });
    });
  });


  
  api.post('/changepassword', function(req, res) {
    User.findById(req.body.userId, (err, user) => {
      // Check if error connecting
      if (err) {
        return res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          return res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          Account.findById(user.accountId, (err, account)=>{
            if(err){ return res.status(400).json(err) }

            account.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
              if(err) {
                if(err.name === 'IncorrectPasswordError'){
                    res.json({ success: false, message: 'Incorrect password' }); // Return error
                }else {
                    res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                }
             } else {
                res.json({ success: true, message: account._id });
              }
            })

          })
          
        }
      }
    })  
  })


  //initiate forget password
  api.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = randomize('0', 8);
          done(err, token);
        });
      },
      function(token, done) {
        Account.findOne({ username: req.body.email.toLowerCase() }, function(err, user) {
          if (!user) {
            return res.status(400).json({message : 'No account with that email address exists.'});
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        //send token key to user via sms and email
        sendMail('donotreply-passwordreset@aapexapps.net', { 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          token,
        },
        'forgotpassword'
        )

        sendSms(user.telephone, `Hello, kindly reset your Traque password using this token ${token}. Valid for 1 hours.`)

        return res.json({ success: true, message: user._id });
      }
    ], function(err) {
      if (err) return next(err);
     return  res.status(400).json(err);
    });
  });


  //get user related to a token
  api.get('/reset/:token', function(req, res) {
    Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if(err) { return  res.status(400).json(err)}
      if (!user) {
        return res.status(200).json({message: 'Password reset token is invalid or has expired.'})
      }
      return res.status(200).json({id : user._id, resetPasswordToken: user.resetPasswordToken })
    });
  });

  //reset password
  api.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if(err) { return  res.status(400).json(err)}
          if (!user) {
            return res.status(200).json({message: 'Password reset token is invalid or has expired.'});
          }
  
          // user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.setPassword(req.body.password, function(err,user){
            if (err) {
               return  res.json({success: false, message: 'Password could not be saved.Please try again!'})
            } else { 
              user.save(function(err, newUser) {
                if(err) { return  res.status(400).json(err) }

                return res.json({success: true, message: newUser._id })
              });
                
              }
          })
        });
      },
      function(user, done) {
        //send email
        sendMail('donotreply-passwordreset@aapexapps.net', { 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          token,
        },
        "changepassword"
        )

      }
    ], function(err) {
      if (err) return next(err);
     return  res.status(400).json(err);
    });
  });

  // //check if user is login
  // api.get('/is-login/check', (req, res)=>{
  //   console.log("req",req)
  // })

  return api;
}
