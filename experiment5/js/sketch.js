// sketch.js - purpose and description here
// Author: Your Name
// Date:

let snowflakes = [];
let globeRotationX = 0;
let globeRotationY = 0;
let snowmanRotationX = 0;
let snowmanRotationY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let canvasContainer;

function setup() {
  //createCanvas(800, 800, WEBGL); // Increase canvas size
  // Set up canvas and attach it to the specified container
  canvasContainer = $("#canvas-container");
  createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL).parent("canvas-container");

  // Adjust canvas size when window is resized
  $(window).resize(() => resizeCanvas(canvasContainer.width(), canvasContainer.height()));
}

function draw() {
  background(30, 60, 100); // Wintery dark blue background
  
  // Mouse interaction for rotating the snow globe and the snowman
  if (mouseIsPressed) {
    let deltaX = mouseX - prevMouseX;
    let deltaY = mouseY - prevMouseY;
    globeRotationY += deltaX * 0.01;
    globeRotationX -= deltaY * 0.01;
    snowmanRotationY += deltaX * 0.01; // Rotate snowman along with the snowglobe
    snowmanRotationX -= deltaY * 0.01; // Rotate snowman along with the snowglobe
  }
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  // Set perspective
  let camZ = 500; // Move camera farther away
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0); // Look at the center
  
  // Draw snow globe base
  push();
  noStroke();
  fill(139, 69, 19); // Brown color for the base
  rotateX(globeRotationX);
  rotateY(globeRotationY);
  // Draw snow globe base
  translate(0, 180, 0); // Adjust the position to place it at the top of the globe
  cylinder(100, 50); // Slightly longer height
  pop();
  
  // Draw snow globe glass
  push();
  noFill();
  shininess(100);
  rotateX(globeRotationX);
  rotateY(globeRotationY);
  sphere(150);
  pop();
  
  // Draw snowman
  push();
  noStroke();
  fill(255); // White color for snowman
  rotateX(snowmanRotationX);
  rotateY(snowmanRotationY);
  // Bottom body
  translate(0, 90, 0); // Position snowman above base
  sphere(60);
  // Middle body
  translate(0, -60, 0); // Move to top of bottom body
  sphere(40);
  // Head
  translate(0, -45, 0); // Move to top of middle body
  sphere(30);
  // Eyes
  fill(0); // Black color for eyes
  translate(-10, -10, 15); // Position left eye
  sphere(5); // Make eyes smaller
  translate(20, 0, 0); // Position right eye
  sphere(5); // Make eyes smaller
  // Top hat
  fill(0); // Black color for hat
  translate(0, -30, 0); // Position hat
  cylinder(40, 20);
  translate(0, -10, 0); // Position top of hat
  cone(30, 20);
  // Arms
  fill(139, 69, 19); // Brown color for arms
  translate(20, -10, 0); // Position right arm
  rotateX(PI); // Rotate to point outwards
  cylinder(20, 3);
  translate(-40, 0, 0); // Position left arm
  cylinder(20, 3);
  pop();
  
  // Draw falling snowflakes
  for (let flake of snowflakes) {
    flake.update();
    flake.display();
  }
  
  // Create new snowflake every few frames
  if (frameCount % 5 === 0) {
    snowflakes.push(new Snowflake(random(-100, 100), random(-100, 100), random(-100, 100)));
  }
}

class Snowflake {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, 1, 0);
  }
  
  update() {
    this.vel.add(createVector(0, 0.05, 0));
    this.pos.add(this.vel);
    
    // Wrap around
    if (this.pos.y > 90) {
      this.pos.y = -90;
      this.vel.mult(0.5);
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255); // White color for snow
    shininess(0);
    sphere(5);
    pop();
  }
}
