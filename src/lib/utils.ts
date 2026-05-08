export const prefixPath = (path: string) => {
  // Ensure the path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
};
