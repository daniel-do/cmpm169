// sketch.js - generative methods
// Author: Daniel Do
// Date: 01-29-2024

// Define variables for tile count, dimensions, fish size, angle, and image container
let tileCount = 10;
let tileWidth, tileHeight;
let fishSize = 100;
let newFishSize = fishSize;
let fishAngle = 0;
let maxDist;
let currentFish;
let fishImages = [];
let canvasContainer;

// Define variable for controlling fish size behavior
let sizeMode = 0;

// Preload fish image before setup
function preload() {
  fishImages.push(loadImage('../img/Fish1.png'));
}

function setup() {
  // Set up canvas and attach it to the specified container
  canvasContainer = $("#canvas-container");
  createCanvas(canvasContainer.width(), canvasContainer.height()).parent("canvas-container");

  // Adjust canvas size when window is resized
  $(window).resize(() => resizeCanvas(canvasContainer.width(), canvasContainer.height()));

  // Set initial fish image and calculate tile dimensions
  currentFish = fishImages[0];
  tileWidth = width / tileCount;
  tileHeight = height / tileCount;

  // Calculate maximum distance for movement speed calculation
  maxDist = sqrt(pow(width, 2) + pow(height, 2));
}

function draw() {
  // Clear canvas and set background color
  clear();
  background('#009dc4');

  // Nested loop to iterate through the grid of fish positions
  for (let gridY = 0; gridY < tileCount; gridY++) {
    for (let gridX = 0; gridX < tileCount; gridX++) {
      // Calculate position for each fish in the grid
      let posX = tileWidth * gridX + tileWidth / 2;
      let posY = tileHeight * gridY + tileWidth / 2;

      // Calculate angle between fish and mouse position
      let angle = atan2(mouseY - posY, mouseX - posX) + (fishAngle * (PI / 180));
      
      // Calculate distance between mouse and fish
      let distance = dist(mouseX, mouseY, posX, posY);

      // Set movement speed
      let speed = 100;

      // Update fish position towards the mouse
      posX += cos(angle) * speed;
      posY += sin(angle) * speed;

      // Calculate new fish size based on the selected size mode
      newFishSize = (sizeMode === 0) ? fishSize : ((sizeMode === 1) ? fishSize * 1.5 - map(distance, 0, 500, 5, fishSize) : map(distance, 0, 500, 5, fishSize));

      // Apply transformations to draw the fish
      push();
      translate(posX, posY);
      rotate(angle);
      noStroke();
      image(currentFish, 0, 0, newFishSize, newFishSize);
      pop();
    }
  }
}




