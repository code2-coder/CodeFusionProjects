export const getImageUrl = (url) => {
  if (!url) return '';
  // Strip hardcoded localhost:5000 if it exists in the database
  if (url.startsWith('http://localhost:5000')) {
    url = url.replace('http://localhost:5000', '');
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${url}`;
};
