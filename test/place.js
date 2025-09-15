
const mongoose       = require('mongoose');
const path           = require('path');

const pagination = require(path.join(__dirname, '..'));

const schema = new mongoose.Schema({
  name: {
    type: String
  },

  coordinates: {
    type: [Number],
    required: true
  }
});

schema.plugin(pagination);


module.exports.PlaceSchema = schema;

mongoose.models.Place || mongoose.model('Place', schema);
module.exports.Place = mongoose.models.Place;

