export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3";
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return `http://localhost:8000${imagePath}`;
};

export const getImageWithFallback = (imagePath, fallbackUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3") => {
  return getImageUrl(imagePath) || fallbackUrl;
};