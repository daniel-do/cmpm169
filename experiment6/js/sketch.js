let colors = ["#855988", "#6B4984", "#483475", "#2B2F77", "#141852", "#070B34"];
let currentColorIndex = 0;
let nextColorIndex = 1;
let fade = 0;
const fadeSpeed = 0.01;
let canvasContainer;
let rotationAngle = 0;

const nodes = [];
const letters = 'abcdefghijklmnopqrstuvwxyz012345789`~!@#$%^&*()-_=+[{}]\\|;:",<.>/?'.split('');

function setup() {
  // Set up canvas and attach it to the specified container
  canvasContainer = $("#canvas-container");
  createCanvas(canvasContainer.width(), canvasContainer.height()).parent("canvas-container");

  // Adjust canvas size when window is resized
  $(window).resize(() => resizeCanvas(canvasContainer.width(), canvasContainer.height()));
  background(0);
}

function draw() {
  // Interpolate between current and next color
  let currentColor = color(colors[currentColorIndex]);
  let nextColor = color(colors[nextColorIndex]);
  let bgColor = lerpColor(currentColor, nextColor, fade);

  translate(width / 4, height / 4);
  background(bgColor);

  let radius = 100;
  let angleStep = TWO_PI / 5; // Divide the circle into 5 equal segments for the star points

  // Update rotation angle
  rotationAngle += 0.01;

  // Draw the outline of the five-pointed star shape using "o" characters
  textSize(12);
  textAlign(CENTER, CENTER);

  // Top left star
  for (let i = 0; i < 5; i++) {
    let x1 = cos(i * angleStep + rotationAngle) * radius;
    let y1 = sin(i * angleStep + rotationAngle) * radius;
    let x2 = cos((i + 2) * angleStep + rotationAngle) * radius;
    let y2 = sin((i + 2) * angleStep + rotationAngle) * radius;

    let distance = dist(x1, y1, x2, y2);
    let numCharacters = int(distance / 10); // Adjust the spacing between characters
    for (let j = 0; j < numCharacters; j++) {
      let interX = lerp(x1, x2, j / numCharacters);
      let interY = lerp(y1, y2, j / numCharacters);
      text(random(letters), interX, interY); // Place "o" along the line
    }
  }

  translate(width / 2, height / 2);

  // Bottom right star
  radius = 50;
  for (let i = 0; i < 5; i++) {
    let x1 = cos(i * angleStep + rotationAngle) * radius;
    let y1 = sin(i * angleStep + rotationAngle) * radius;
    let x2 = cos((i + 2) * angleStep + rotationAngle) * radius;
    let y2 = sin((i + 2) * angleStep + rotationAngle) * radius;

    let distance = dist(x1, y1, x2, y2);
    let numCharacters = int(distance / 10); // Adjust the spacing between characters
    for (let j = 0; j < numCharacters; j++) {
      let interX = lerp(x1, x2, j / numCharacters);
      let interY = lerp(y1, y2, j / numCharacters);
      text(random(letters), interX, interY); // Place "o" along the line
    }
  }

  translate(width / 8, -(height / 2));

  // Top right star
  radius = 30;
  for (let i = 0; i < 5; i++) {
    let x1 = cos(i * angleStep + rotationAngle) * radius;
    let y1 = sin(i * angleStep + rotationAngle) * radius;
    let x2 = cos((i + 2) * angleStep + rotationAngle) * radius;
    let y2 = sin((i + 2) * angleStep + rotationAngle) * radius;

    let distance = dist(x1, y1, x2, y2);
    let numCharacters = int(distance / 10); // Adjust the spacing between characters
    for (let j = 0; j < numCharacters; j++) {
      let interX = lerp(x1, x2, j / numCharacters);
      let interY = lerp(y1, y2, j / numCharacters);
      text(random(letters), interX, interY); // Place "o" along the line
    }
  }

  translate(-((width * 3) / 4) - (width / 8), -(height / 4));

  // Increase fade
  fade += fadeSpeed;

  // If fade reaches 1, switch to the next set of colors
  if (fade >= 1) {
    fade = 0;
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    nextColorIndex = (nextColorIndex + 1) % colors.length;
  }
  
  makeNodes();
  drawNodes();
  drawLines();
  moveNodes();
}

function makeNodes() {
  if (mouseIsPressed) {
    nodes.push({xpos: mouseX, ypos: mouseY, size: random(0.01, 3), letter: random(letters), living: true, twinkle: random(0.5, 2)}); 
  }
}

function drawNodes() {
  stroke(255);
  fill(255);
  nodes.forEach(node => {
    textSize(node.size * 10);
    let twinkleFactor = 1 + sin(frameCount * 0.1) * 0.05; // Add twinkling effect
    text(node.letter, node.xpos, node.ypos);
    node.size *= twinkleFactor; // Apply twinkling effect to size
  });
}

function drawLines() {
  stroke(255, 255, 255, 100);
  for (let i = 0; i < nodes.length; i++) {
    let node1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      let node2 = nodes[j];
      if (dist(node1.xpos, node1.ypos, node2.xpos, node2.ypos) < 50) {
        line(node1.xpos, node1.ypos, node2.xpos, node2.ypos);
      }
    }
  }
}

function moveNodes() {
  nodes.forEach(node => {
    if (node.xpos < 0 || node.ypos > height) {
      nodes.splice(nodes.indexOf(node), 1);
    } else {
      if (mouseY < 50) {
        node.xpos += node.size;
        node.ypos += node.size;
      } else {
        node.xpos += node.size * (mouseY / 500);
        node.ypos -= node.size * (mouseX / 500);
      }
    }
  });
}

function keyPressed() {
  if (keyCode === RETURN) {
    nodes.splice(0, nodes.length); // Clear nodes array
    fade = 0; // Reset fade
    rotationAngle = 0; // Reset rotation angle
  }
}
