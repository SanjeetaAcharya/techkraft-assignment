const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: String, required: true, trim: true },
  title:      { type: String, required: true, trim: true },
  location:   { type: String, trim: true },
  price:      { type: Number, min: 0 }
}, { timestamps: true });


favouriteSchema.index({ user: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);