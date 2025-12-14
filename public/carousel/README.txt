=====================================
CAROUSEL IMAGES FOLDER
=====================================

Place your images in this folder (public/carousel/).

Supported formats:
- .jpg / .jpeg
- .png
- .webp
- .gif

After adding images, update the CAROUSEL_IMAGES array in:
src/components/Gallery.tsx

Example:
const CAROUSEL_IMAGES: string[] = [
  'image1.jpg',
  'image2.png',
  'spa-room.webp',
];

The gallery will automatically:
- Show 4 images at a time on desktop
- Show 2 images at a time on mobile
- Display navigation arrows if you have more than 4 images
- Allow cycling through all images with left/right arrows

=====================================

