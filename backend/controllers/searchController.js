import Project from '../models/Project.js';
import Resource from '../models/Resource.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ projects: [], resources: [] });
    }

    const regex = new RegExp(q, 'i');

    const projects = await Project.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { tags: { $in: [regex] } },
      ],
      published: true
    }).limit(10);

    const resources = await Resource.find({
      $or: [
        { title: regex },
        { excerpt: regex },
        { category: regex },
        { tags: { $in: [regex] } },
      ],
      published: true
    }).limit(10);

    res.json({ projects, resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
