// sketch.js - Data Visualization & Networks
// Author: Daniel Do
// Date: 02-26-2024

let tempData = [];
let totalDays = 365; // One year
let space = 20;
let rotationAngle = 0; // Initial rotation angle
let canvasContainer;
let color1;
let color2;
let color3;

function setup() {
  // Set up canvas and attach it to the specified container
  canvasContainer = $("#canvas-container");
  createCanvas(canvasContainer.width(), canvasContainer.height()).parent("canvas-container");

  // Adjust canvas size when window is resized
  $(window).resize(() => resizeCanvas(canvasContainer.width(), canvasContainer.height()));
  angleMode(DEGREES);
  // Generate random temp data for 365 days
  for (let day = 0; day < totalDays; day++) {
    let temp = random(30, 100); // Random temperature between 30°F and 100°F
    tempData.push({ day: day, temp: temp });
  }
  color1 = random(0, 255);
  color2 = random(0, 255);
  color3 = random(0, 255);
}

function draw() {
  //x sets  the  rtectangles along the x axis
  //y sets the number of rectangles long the y axis
  for(let x = 0; x < width; x += space) {
    for(let y = 0; y < height; y += space) {  
      let R = abs(mouseX - x);
      let G = abs(mouseY - y);
      let B = abs(mouseX - (width / 2));

      fill (R,G,B); 
      rect(x,y,space,space);
    }
  }
  translate(width / 2, height / 2);

  // Increment rotation angle
  rotationAngle += 0.1;
  let outerCircleRadius = 200; // Radius of the outer circle
  let innerCircleRadius = 100; // Radius of the inner hole

  let numSegments = tempData.length;
  let angleStep = 360 / numSegments;
  let maxTemp = getMaxTemperature(tempData);
  let minTemp = getMinTemperature(tempData);

  for (let i = 0; i < numSegments; i++) {
    let startAngle = i * angleStep + rotationAngle;
    let endAngle = startAngle + angleStep;
    let temperature = map(tempData[i].temp, minTemp, maxTemp, innerCircleRadius, outerCircleRadius);

    push(); // Save the current transformation state
    rotate(rotationAngle); // Apply rotation

    // Draw radial segment
    let tempColor = lerpColor(color(color1, color2, color3), color(color1, color2, color3), map(tempData[i].temp, minTemp, maxTemp, innerCircleRadius, outerCircleRadius));
    fill(tempColor);
    arc(0, 0, temperature * 2, temperature * 2, startAngle, endAngle, PIE);
    pop(); // Restore the previous transformation state

    // Draw day labels
    let dayLabel = tempData[i].day;
    let labelAngle = startAngle + angleStep / 2;
    let labelRadius = outerCircleRadius + 40;
    let labelX = cos(labelAngle) * labelRadius;
    let labelY = sin(labelAngle) * labelRadius;
    textAlign(CENTER, CENTER);
    fill(0);
    if (dayLabel % 10 == 0) {
      push(); // Save the current transformation state
      rotate(rotationAngle); // Apply rotation to the day label
      textSize(20);
      textStyle(BOLD);
      text(dayLabel, labelX, labelY);
      pop(); // Restore the previous transformation state
    }
  }
  textSize(16);
  textStyle(BOLD);
  fill(color(color1, color2, color3));
  translate(-(width / 2), -(height / 2) - 10);
  text("TEMPERATURE", width / 2, height / 2);
  translate(0, 20);
  text("RADIAL", width / 2, height / 2);
}

// Helper function to get max temperature from data
function getMaxTemperature(data) {
  return Math.max(...data.map(item => item.temp));
}

// Helper function to get min temperature from data
function getMinTemperature(data) {
  return Math.min(...data.map(item => item.temp));
}

function keyPressed() {
    if (keyCode === RETURN) {
        color1 = random(0, 255);
        color2 = random(0, 255);
        color3 = random(0, 255);
        // Remove all temp data
        for (let day = 0; day < totalDays; day++) {
            tempData.pop();
        }
        // Generate new random temp data for 365 days
        for (let day = 0; day < totalDays; day++) {
            let temp = random(30, 80);
            tempData.push({ day: day, temp: temp });
        }
        rotationAngle = 0; // Reset rotation angle
    }
  }