const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String },
  price: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Favourite', favouriteSchema);