const Favourite = require('../models/Favourite');

const getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(favourites);
  } catch (err) {
    next(err);
  }
};

const addFavourite = async (req, res, next) => {
  const { propertyId, title, location, price } = req.body;

  try {
    if (!propertyId || !title) {
      return res.status(400).json({ message: 'propertyId and title are required' });
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const existing = await Favourite.findOne({ user: req.user.id, propertyId });
    if (existing) {
      return res.status(400).json({ message: 'Property already in favourites' });
    }

    const favourite = await Favourite.create({
      user: req.user.id,
      propertyId: propertyId.toString().trim(),
      title: title.trim(),
      location: location ? location.trim() : undefined,
      price: price !== undefined ? Number(price) : undefined
    });

    res.status(201).json(favourite);
  } catch (err) {
    next(err);
  }
};

const removeFavourite = async (req, res, next) => {
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
    next(err);
  }
};

module.exports = { getFavourites, addFavourite, removeFavourite };