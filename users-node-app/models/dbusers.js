'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');
const errorHandler = require('../util/errors');

//Model class that wraps DB operations

class DBUser {
  
  // stores all the properties of this object when an instance of this class is created
  // see dbusers.js post route that creates this instance

  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }

  save(cb) {
    if(this._id){
      this.updateUser(cb);
    } else {
      this.addUser(cb);
    }
  }

  addUser(cb){
    db().then(() => {
      db.UsersDB.create({email:this.email, lastname:this.lastname, firstname:this.firstname}).then(results => {
        if (!results) 
          return cb(new Error('Unable to create a user.'));
        cb(null,results)
        console.log("In Model class\n Added User " +JSON.stringify(cb));
      });
    });
  }

  updateUser(cb) {
    db().then(() => {
      db.UsersDB.update({_id:this._id,email:this.email, lastname:this.lastname, firstname:this.firstname}).then(results => {
        if (!results) 
          return cb(new Error('Unable to update a user.'));
        cb(null,results)
        console.log("In Model class\n Updated User " +JSON.stringify(cb));
      });
    });
  }


  static removeUser(id, cb) {
    if (!id) return cb(new Error('Please provide an id'));
    console.log("Object Id "+ id);
    db().then(() => {
      db.UsersDB.delete(id).then(results => {
        if (!results) 
          return cb(new Error('Unable to update a user.'));
        cb(null,results)
        console.log("In Model class\n Updated User " +JSON.stringify(cb));
      });
    });
  }

  static removeAll(cb) {
    db().then(() => {
      db.UsersDB.removeAll().then(results => {
        if (!results) 
          return cb(new Error('Unable to delete all users.'));
        cb(null,results)
        console.log("In Model class\n deleted all users " +JSON.stringify(cb));
      });
    });
  }

  static getAllDBUsers(cb) {
    db().then(() => {
      db.UsersDB.all().then(results => {
        if (!results) 
          return cb(new Error('No Users found.'));
        cb(null,results)
        console.log("In Model class\n retrieving all users" +JSON.stringify(cb));
      });
    });
  }

  static authenticate(name, pass, cb) {

  }
}

module.exports = DBUser;
