import axios from 'axios';

// this function grabs an image from the database corresponding to the ID provided
export function GrabImage(id) {
  return axios.post('http://localhost:3000/imageForPins', { id: id })
    .then(response => {
      // Convert the base64-encoded byte string to a byte array
      const your_byte_array = Uint8Array.from(atob(response.data), c => c.charCodeAt(0));

      // Set the width and height of your image
      const width = 224;
      const height = 224;

      // Create the canvas element
      const canvas = document.createElement('canvas');
      canvas.id = 'byteArrayCanvas';
      canvas.width = 224;
      canvas.height = 224;

      // Get the 2D rendering context
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);

      // Copy the byte array data to the image data
      for (let i = 0; i < your_byte_array.length; i++) {
        const gray_value = 255 - your_byte_array[i]; // Subtract the grayscale value from 255
        imageData.data[4 * i] = gray_value;          // Red
        imageData.data[4 * i + 1] = gray_value;      // Green
        imageData.data[4 * i + 2] = gray_value;      // Blue
        imageData.data[4 * i + 3] = 255;             // Alpha (255 = fully opaque)
      }

      // Draw the image data on the canvas
      ctx.putImageData(imageData, 0, 0);

      // Get the data URL from the image data
      const imageUrl = canvas.toDataURL();
      console.log(imageUrl)
      // Return the data URL
      return imageUrl;
    })
    .catch(error => {
      console.log(error);
      return null;
    });
}
