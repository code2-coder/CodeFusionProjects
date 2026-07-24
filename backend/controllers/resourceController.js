import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResourceBySlug = async (req, res) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug });
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const resource = new Resource(req.body);
    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
      Object.assign(resource, req.body);
      const updatedResource = await resource.save();
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
      await resource.deleteOne();
      res.json({ message: 'Resource removed' });
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
