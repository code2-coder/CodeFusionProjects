import Project from '../models/Project.js';
import Resource from '../models/Resource.js';
import Template from '../models/Template.js';

// Utility to escape regex characters safely against ReDoS and syntax errors
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const globalSearch = async (req, res) => {
  try {
    const rawQuery = req.query.q;
    if (!rawQuery || typeof rawQuery !== 'string') {
      return res.status(200).json({ projects: [], resources: [], templates: [] });
    }

    const cleanQuery = rawQuery.trim().slice(0, 50); // Limit query length to 50 chars
    if (!cleanQuery) {
      return res.status(200).json({ projects: [], resources: [], templates: [] });
    }

    const safeRegex = new RegExp(escapeRegex(cleanQuery), 'i');

    // Run all 3 queries concurrently in parallel with projection and lean()
    const [projects, resources, templates] = await Promise.all([
      Project.find({
        published: true,
        $or: [
          { title: safeRegex },
          { description: safeRegex },
          { category: safeRegex },
          { tags: safeRegex },
        ],
      })
        .select('title slug description category featuredImage tags')
        .limit(10)
        .lean(),

      Resource.find({
        published: true,
        $or: [
          { title: safeRegex },
          { excerpt: safeRegex },
          { category: safeRegex },
          { tags: safeRegex },
        ],
      })
        .select('title slug excerpt category coverImage tags')
        .limit(10)
        .lean(),

      Template.find({
        status: 'Published',
        $or: [
          { title: safeRegex },
          { description: safeRegex },
          { category: safeRegex },
          { tags: safeRegex },
        ],
      })
        .select('title description category price galleryImages tags')
        .limit(10)
        .lean(),
    ]);

    res.status(200).json({ projects, resources, templates });
  } catch (error) {
    console.error('Global search error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to perform search' });
  }
};
