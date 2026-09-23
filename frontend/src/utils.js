export const getImageUrl = (url) => {
  if (!url) return '';

  // Strip hardcoded localhost:5000 if it was saved in the database
  if (url.startsWith('http://localhost:5000')) {
    url = url.replace('http://localhost:5000', '');
  }

  // If already absolute URL (external CDN, Cloudinary, etc.) or data URI, return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // Replace all backslashes with forward slashes
  let cleanUrl = url.replace(/\\/g, '/');
  
  // Ensure it starts with exactly one forward slash
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = `/${cleanUrl}`;
  }
  
  // Remove accidental double slashes (e.g. //uploads -> /uploads)
  cleanUrl = cleanUrl.replace(/\/\//g, '/');

  // Determine production backend base URL
  let apiBase = (import.meta.env.VITE_API_URL || '').trim();
  apiBase = apiBase.replace(/\/+$/, '');
  if (apiBase.endsWith('/api')) {
    apiBase = apiBase.slice(0, -4);
  }

  const isProduction = import.meta.env.PROD || (
    typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1'
  );

  if (isProduction && (!apiBase || apiBase.includes('localhost') || apiBase.includes('127.0.0.1'))) {
    apiBase = 'https://codefusionprojects.onrender.com';
  }

  // If asset is hosted by backend (e.g., /api/upload/... or /uploads/...)
  if (cleanUrl.startsWith('/api/upload') || cleanUrl.startsWith('/uploads')) {
    if (apiBase) {
      return `${apiBase}${cleanUrl}`;
    }
  }

  return cleanUrl;
};

export const handleImageError = (e) => {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = 'true';
    // Use a premium, sleek looking placeholder image matching the dark theme
    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop&text=Image+Unavailable';
  }
};

