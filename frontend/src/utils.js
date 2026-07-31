export const getImageUrl = (url) => {
  if (!url) return '';
  // Strip hardcoded localhost:5000 if it exists in the database
  if (url.startsWith('http://localhost:5000')) {
    url = url.replace('http://localhost:5000', '');
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  
  // Replace all backslashes with forward slashes
  let cleanUrl = url.replace(/\\/g, '/');
  
  // Ensure it starts with exactly one forward slash
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = `/${cleanUrl}`;
  }
  
  // Remove accidental double slashes (e.g. //uploads -> /uploads)
  cleanUrl = cleanUrl.replace(/\/\//g, '/');

  // Return cleanUrl as relative path to let Vite proxy or production server resolve it.
  return cleanUrl;
};

export const handleImageError = (e) => {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = 'true';
    // Use a premium, sleek looking placeholder image matching the dark theme
    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop&text=Image+Unavailable';
  }
};

