// sketch.js - 3D Graphics
// Author: Daniel Do
// Date: 02-13-2024

let snowflakes = [];
let globeRotationX = 0;
let globeRotationY = 0;
let snowmanRotationX = 0;
let snowmanRotationY = 0;
let trees = [];
let treeCount = 30;
let treeCircleRadius = 700;
let prevMouseX = 0;
let prevMouseY = 0;
let canvasContainer;

function setup() {
  // Set up canvas and attach it to the specified container
  canvasContainer = $("#canvas-container");
  createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL).parent("canvas-container");

  // Adjust canvas size when window is resized
  $(window).resize(() => resizeCanvas(canvasContainer.width(), canvasContainer.height()));

  // Innermost ring of trees
  for (let i = 0; i < treeCount; i++) {
    let angle = map(i, 0, treeCount, 0, TWO_PI); // Calculate angle for each tree
    let x = cos(angle) * treeCircleRadius; // X position based on cosine
    let z = sin(angle) * treeCircleRadius; // Z position based on sine
    trees.push(new Tree(x, z));
  }
  // Outermost ring of trees
  treeCount = 50;
  treeCircleRadius = 1000;
  for (let i = 0; i < treeCount; i++) {
    let angle = map(i, 0, treeCount, 0, TWO_PI);
    let x = cos(angle) * treeCircleRadius;
    let z = sin(angle) * treeCircleRadius;
    trees.push(new Tree(x, z));
  }
}

function draw() {
  background(30, 60, 100); // Wintery dark blue background
  
  // Mouse interaction for rotating the snow globe and the snowman
  if (mouseIsPressed) {
    let deltaX = mouseX - prevMouseX;
    let deltaY = mouseY - prevMouseY;
    globeRotationY += deltaX * 0.01;
    globeRotationX -= deltaY * 0.01;
    snowmanRotationY += deltaX * 0.01;
    snowmanRotationX -= deltaY * 0.01;
    // Rotate snowflakes along with the snowglobe
    for (let flake of snowflakes) {
      flake.rotate(deltaX * 0.01, deltaY * 0.01);
    }
    // Rotate trees along with the snowglobe
    for (let tree of trees) {
      tree.rotate(-deltaX * 0.01);
    }
  }
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  // Set perspective
  let camZ = 600; // Move camera farther away
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0); // Look at the center
  
  // Draw snow globe base
  push();
  noStroke();
  fill(139, 69, 19); // Brown color for the base
  rotateX(globeRotationX);
  rotateY(globeRotationY);
  // Draw snow globe base
  translate(0, 150, 0); // Adjust the position to place it at the top of the globe
  cylinder(100, 50);
  // Snow globe base rim
  fill("#C0C0C0");
  translate(0, 25, 0);
  cylinder(110, 10);
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
  translate(0, -60, 0);
  sphere(40);

  // Head
  translate(0, -45, 0);
  sphere(30);

  // Eyes
  fill(0); // Black color for eyes
  translate(-10, -10, 25); // Position left eye
  sphere(5); // Make eyes smaller
  translate(20, 0, 0); // Position right eye
  sphere(5);

  // Body Buttons
  translate(-10, 40, 12); // Position upper body button
  sphere(5);
  translate(0, 10, 2); // Position lower body button
  sphere(5);

  // Top hat
  fill(0); // Black color for hat
  translate(0, -70, -40); // Position hat
  cylinder(40, 20);
  translate(0, -20, 0); // Position top of hat
  cylinder(30, 50);
  translate(0, 5, 0); // Position red rim of hat
  fill("#FF0000");
  cylinder(31, 5);
  pop();
  
  // Draw falling snowflakes
  for (let flake of snowflakes) {
    flake.update();
    flake.display();
  }
  
  // Draw trees
  for (let tree of trees) {
    tree.display();
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
  
  rotate(angleX, angleY) {
    let x = this.pos.x;
    let z = this.pos.z;
    this.pos.x = x * cos(angleY) - z * sin(angleY);
    this.pos.z = x * sin(angleY) + z * cos(angleY);
    x = this.pos.x;
    let y = this.pos.y;
    this.pos.x = x * cos(angleX) + y * sin(angleX);
    this.pos.y = -x * sin(angleX) + y * cos(angleX);
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255); // White color for snow
    shininess(0);
    sphere(3);
    pop();
  }
}

class Tree {
  constructor(x, z) {
    this.x = x;
    this.y = -40; // Tree trunk height
    this.z = z;
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    // Tree trunk
    fill(139, 69, 19); // Brown color for trunk
    cylinder(20, 200);
    // Tree top
    fill(34, 139, 34); // Green color for leaves
    translate(0, -50, 0); // Position bottom set of leaves
    cone(-100);
    translate(0, -50, 0); // Position top set of leaves
    cone(-60);
    pop();
  }
  
  rotate(angleX) {
    let x = this.x;
    let z = this.z;
    this.x = x * cos(angleX) - z * sin(angleX);
    this.z = x * sin(angleX) + z * cos(angleX);
    x = this.x;
  }
}

function keyPressed() {
    if (keyCode === RETURN) {
      // Reset all variables to their initial state
      snowflakes = [];
      globeRotationX = 0;
      globeRotationY = 0;
      snowmanRotationX = 0;
      snowmanRotationY = 0;
      trees = [];
      treeCount = 30;
      treeCircleRadius = 700;
      prevMouseX = 0;
      prevMouseY = 0;
      // Reinitialize trees
      for (let i = 0; i < treeCount; i++) {
        let angle = map(i, 0, treeCount, 0, TWO_PI);
        let x = cos(angle) * treeCircleRadius;
        let z = sin(angle) * treeCircleRadius;
        trees.push(new Tree(x, z));
      }
      // Outermost ring of trees
      treeCount = 50;
      treeCircleRadius = 1000;
      for (let i = 0; i < treeCount; i++) {
        let angle = map(i, 0, treeCount, 0, TWO_PI);
        let x = cos(angle) * treeCircleRadius;
        let z = sin(angle) * treeCircleRadius;
        trees.push(new Tree(x, z));
      }
    }
  }