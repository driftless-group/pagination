const mongoose       = require('mongoose');
const path           = require('path');

const pagination = require(path.join(__dirname, '..'));

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    }
  },

  first_name: {
    type: String
  },

  last_name: {
    type: String
  },

  email: {
    type: String
  },

  password: String

});

schema.plugin(pagination);

module.exports.PersonSchema = schema;

mongoose.models.Person || mongoose.model('Person', schema);
module.exports.Person = mongoose.models.Person;


