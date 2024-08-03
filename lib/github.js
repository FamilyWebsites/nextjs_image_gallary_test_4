// lib/github.js
import axios from 'axios';

// Replace 'your_personal_access_token_here' with your actual token
const TOKEN = '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'; 

const FULL_IMAGES_REPO = 'https://api.github.com/repos/FamilyWebsites/2023-My-Birthday-Celebration-in-Office/contents/photos';
const THUMBNAILS_REPO = 'https://api.github.com/repos/FamilyWebsites/2023-My-Birthday-Celebration-in-Office/contents/photos/thumbnails';

export const fetchImages = async () => {
  try {
    const [fullImagesResponse, thumbnailsResponse] = await Promise.all([
      axios.get(FULL_IMAGES_REPO, {
        headers: {
          'Authorization': `token ${TOKEN}`
        }
      }),
      axios.get(THUMBNAILS_REPO, {
        headers: {
          'Authorization': `token ${TOKEN}`
        }
      })
    ]);

    const fullImages = fullImagesResponse.data
      .filter(file => file.type === 'file')
      .map(file => ({ name: file.name, url: file.download_url }));

    const thumbnails = thumbnailsResponse.data
      .filter(file => file.type === 'file')
      .map(file => ({ name: file.name, url: file.download_url }));

    const images = fullImages.map(image => {
      const thumbnail = thumbnails.find(thumb => thumb.name === image.name);
      return {
        name: image.name,
        fullUrl: image.url,
        thumbnailUrl: thumbnail ? thumbnail.url : image.url // Fallback to full image if thumbnail not found
      };
    });

    return images;
  } catch (error) {
    console.error('Error fetching images from GitHub:', error);
    return [];
  }
};
