import Package from '../models/Package.js';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = async (req, res) => {
  try {
    const { title, price, services } = req.body;

    const newPackage = new Package({
      title,
      price,
      services,
    });

    const createdPackage = await newPackage.save();
    res.status(201).json(createdPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res) => {
  try {
    const { title, price, services } = req.body;

    const existingPackage = await Package.findById(req.params.id);

    if (existingPackage) {
      existingPackage.title = title || existingPackage.title;
      existingPackage.price = price || existingPackage.price;
      existingPackage.services = services || existingPackage.services;

      const updatedPackage = await existingPackage.save();
      res.json(updatedPackage);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  try {
    const existingPackage = await Package.findById(req.params.id);

    if (existingPackage) {
      await existingPackage.deleteOne();
      res.json({ message: 'Package removed' });
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
