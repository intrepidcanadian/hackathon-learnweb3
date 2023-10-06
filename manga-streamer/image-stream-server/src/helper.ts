import { ImageDataPoint } from './interfaces';
import path from 'path';
import * as fs from 'fs';

// Load the JSON file containing image URLs
const jsonFilePath = path.join(__dirname, './images/image_urls.json'); // Replace with the actual path to your JSON file

function getImageUrlsFromFile(filePath: string): string[] {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    if (data.image_urls && Array.isArray(data.image_urls)) {
      return data.image_urls;
    }
    throw new Error('Invalid JSON format');
  } catch (error) {
    console.error('Error reading JSON file:', (error as Error).message);

    return [];
  }
}

const imageUrls = getImageUrlsFromFile(jsonFilePath);

// Function to randomly pick an image URL
function getRandomImageUrl(): string {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

// Function to generate a single data point
export function generateDataPoint(): ImageDataPoint {
  return {
    image: getRandomImageUrl(),
  };
}
