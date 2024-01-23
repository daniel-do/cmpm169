// sketch.js - purpose and description here
// Author: Daniel Do
// Date: 01-22-2024

// Declare variables to store slider instances, rose radius, and rotation speed
let sliders;
let roseRadius;
let rotationSpeed;
let canvasContainer;

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $(window).resize(function () {
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  
  // Initialize variables
  sliders = [new SliderRose(canvasContainer.width() / 2, canvasContainer.height() / 2)]; // Create an array with a new SliderRose at the center
  rotationSpeed = 1; // Set the initial rotation speed
  roseRadius = random(60, 200); // Set the initial rose radius
  background(random(0, 255), random(0, 255), random(0, 255)); // Set a random background color
}

function draw() {
  // Update and draw each slider in the sliders array
  sliders.forEach(d => d.update());
}

function mousePressed() {
  // Change the background color to a random value
  background(random(0, 255), random(0, 255), random(0, 255));

  // Move the first slider in the array with the mouse position as the new origin
  sliders[0].moveWithMouse(mouseX, mouseY);

  // Set a new random rose radius and rotation speed
  roseRadius = random(60, 200);
  rotationSpeed = random(1, 10);
}

class SliderRose {
  constructor(_x, _y) {
    // Initialize SliderRose with a given position
    this.x1 = _x;
    this.y1 = _y;
    this.sliders = []; // Array to store individual sliders
    this.sinAngle = 0; // Initial angle for sine wave motion
    this.createSliders(); // Create sliders around the rose
  }

  createSliders() {
    const skip = 20; // Angle skip between sliders
    for (let i = 0; i < 360; i += skip) {
      const sliderAngle = radians(i);
      const x2 = cos(sliderAngle) * roseRadius;
      const y2 = sin(sliderAngle) * roseRadius;

      // Create a slider, set its position, width, and rotation
      const slider = createSlider(0, 255, 50);
      slider.position(this.x1 + x2, this.y1 + y2);
      slider.style('width', roseRadius + 'px');
      slider.style('transform-origin', '0% 0%');
      slider.style('transform', 'rotate(' + i + 'deg)');
      this.sliders.push(slider); // Add the slider to the array
    }
  }

  update() {
    let offset = 0;

    // Update each slider's value based on a sine wave
    for (let i = 0; i < this.sliders.length; i++) {
      const x = map(sin(this.sinAngle + offset), -1, 1, 0, 255);
      this.sliders[i].value(x);
      offset += 0.050;
    }

    // Rotate and reposition each slider around the center
    for (let i = 0; i < this.sliders.length; i++) {
      const sliderAngle = radians(i * 20);
      const x2 = cos(sliderAngle) * roseRadius;
      const y2 = sin(sliderAngle) * roseRadius;
      this.sliders[i].position(this.x1 + x2 + 50, this.y1 + y2 + 900);
      this.sliders[i].style('transform', 'rotate(' + (i * 20 + frameCount * rotationSpeed) + 'deg)');
    }

    this.sinAngle += 0.1; // Increment the sine wave angle
  }

  moveWithMouse(mouseX, mouseY) {
    // Move the entire set of sliders with the mouse position as the new origin
    this.x1 = mouseX;
    this.y1 = mouseY;

    for (let i = 0; i < this.sliders.length; i++) {
      const sliderAngle = radians(i * 20);
      const x2 = cos(sliderAngle) * roseRadius;
      const y2 = sin(sliderAngle) * roseRadius;
      this.sliders[i].position(this.x1 + x2 + 50, this.y1 + y2 - 900);
    }
  }
}