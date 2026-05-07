export const prefixPath = (path: string) => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS === 'true';
  const base = isProd ? '/Mr-Johns-Barbier' : '';
  
  // Ensure the path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${base}${cleanPath}`;
};
