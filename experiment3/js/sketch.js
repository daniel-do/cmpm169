var tileCount = 10;

var tileWidth;
var tileHeight;
var shapeSize = 100;
var newShapeSize = shapeSize;
var shapeAngle = 0;
var maxDist;
var currentShape;
var shapes;
var canvasContainer;

var sizeMode = 0;

function preload() {
  shapes = [];
  shapes.push(loadImage('../img/Fish1.png'));
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $(window).resize(function () {
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  imageMode(CENTER);
  // set the current shape to the first in the array
  currentShape = shapes[0];
  tileWidth = width / tileCount;
  tileHeight = height / tileCount;
  maxDist = sqrt(pow(width, 2) + pow(height, 2));
}

function draw() {
    clear();
    background('#009dc4');
  
    for (var gridY = 0; gridY < tileCount; gridY++) {
      for (var gridX = 0; gridX < tileCount; gridX++) {
  
        var posX = tileWidth * gridX + tileWidth / 2;
        var posY = tileHeight * gridY + tileWidth / 2;
  
        // calculate angle between mouse position and actual position of the shape
        var angle = atan2(mouseY - posY, mouseX - posX) + (shapeAngle * (PI / 180));
  
        // calculate distance between mouse and shape
        var distance = dist(mouseX, mouseY, posX, posY);
  
        // calculate movement speed based on distance
        var speed = 100;
  
        // update position towards mouse
        posX += cos(angle) * speed;
        posY += sin(angle) * speed;
  
        if (sizeMode == 0) newShapeSize = shapeSize;
        if (sizeMode == 1) newShapeSize = shapeSize * 1.5 - map(distance, 0, 500, 5, shapeSize);
        if (sizeMode == 2) newShapeSize = map(distance, 0, 500, 5, shapeSize);
  
        push();
        translate(posX, posY);
        rotate(angle);
        noStroke();
        image(currentShape, 0, 0, newShapeSize, newShapeSize);
        pop();
      }
    }
  }