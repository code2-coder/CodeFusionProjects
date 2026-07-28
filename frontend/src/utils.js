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

  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${cleanUrl}`;
};

export const handleImageError = (e) => {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = 'true';
    e.target.src = 'https://placehold.co/600x400/1a1a1a/4a4a4a?text=Image+Unavailable';
  }
};
