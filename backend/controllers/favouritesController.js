const Favourite = require('../models/Favourite');

const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user.id });
    res.status(200).json(favourites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addFavourite = async (req, res) => {
  const { propertyId, title, location, price } = req.body;

  try {
    const existing = await Favourite.findOne({ user: req.user.id, propertyId });
    if (existing) {
      return res.status(400).json({ message: 'Property already in favourites' });
    }

    const favourite = await Favourite.create({
      user: req.user.id,
      propertyId,
      title,
      location,
      price
    });

    res.status(201).json(favourite);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!favourite) {
      return res.status(404).json({ message: 'Favourite not found' });
    }

    await favourite.deleteOne();
    res.status(200).json({ message: 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getFavourites, addFavourite, removeFavourite };