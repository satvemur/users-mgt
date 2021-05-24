const { MongoClient, ObjectID } = require('mongodb');

let db;

module.exports = () => {
  return MongoClient
    .connect('mongodb://localhost:27017/susers') // db name susers
    .then((client) => {
      db = client;
    });
};

module.exports.UsersDB = {
  
  all() {
    return db.collection('dbusers').find().sort({ title: 1 }).toArray(); // collection dbusers
  }, 

  find(_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id);
    return db.collection('dbusers').findOne({ _id });
  },

  create(data) {
    return db.collection('dbusers').insertOne(data, { w: 1 });
  },

  delete(_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id);
    return db.collection('dbusers').deleteOne({ _id }, { w: 1 });
  },
  
  removeAll() {
    return db.collection('dbusers').remove();
  },

  update(data){
    let id;
    console.log("Updated data " + JSON.stringify(data))
    if (typeof data._id !== 'object') {
      id = ObjectID(data._id);
    }
    return db.collection('dbusers').updateOne({_id:id}, {email:data.email,lastname:data.lastname,firstname:data.firstname}, {upsert:false, w: 1});
  }


};
