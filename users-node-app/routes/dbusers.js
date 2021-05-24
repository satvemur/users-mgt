const express = require('express');
const router = express.Router();
const DBUser = require('../models/dbusers');
const errorHandler = require('../util/errors')

const users = [{ id:1,email: 'vemuril.satish@test.com', lastname:'vemuri', firstname:'Satish'}]; // test data

router.get('/all' , (req, res) => {
  DBUser.getAllDBUsers((err, results)=>{
    console.log("Getting all users " + results);
    if(err){
      errorHandler(err, req, res);
    }else {
      console.log("vemuri " +results);
      res.send(results);
    }
  });
});

router.delete('/removeall' , (req, res) => {
  DBUser.removeAll((err, results)=>{
    console.log("Deleting all users " + results);
    if(err){
      errorHandler(err, req, res);
    }else {
      console.log("Deleted All users " +results);
      res.send(results);
    }
  });
});

router.delete('/removeUser/:id', (req, res) => {
  console.log("Id = "+ req.params.id)
  const id = req.params.id;
  DBUser.removeUser(id, (err, results) => {
    console.log("Deleting selected user " + results);
    if(err){
      errorHandler(err, req, res);
    }else {
      console.log("Deleted selected user " +results);
      res.send(results);
    }
  });
});

router.get('/dbusers/:id', (req, res) => {
  console.log('satish ' + req.params.id);
  res.send(users[req.params.id]);
});

// creates a new user. form will be submitted from react/angular app

router.post('/save', (req, res) => {
  console.log("The id "+ req.body._id);
  const user = new DBUser({_id:req.body._id,lastname:req.body.lastname,firstname: req.body.firstname,email: req.body.email});
  user.save((err) => {
    if (err){
      console.error(err);
      errorHandler(err, req, res);
    } else {
      res.send(user);
    } 
    console.log('user created ', user.lastname);
  });  
});


module.exports = router;
