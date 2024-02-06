// sketch.js - Images, Video, & Sound Art
// Author: Daniel Do
// Date: 02-05-2024

let audio;
let capture;
let fft;
let particles = [];
let canvasContainer;

function preload() {
  audio = loadSound('audio/electric.mp3');
}

function setup() {
  canvasContainer = $("#canvas-container");
  createCanvas(canvasContainer.width(), canvasContainer.height()).parent("canvas-container");

  $(window).resize(() => resizeCanvas(canvasContainer.width(), canvasContainer.height()));
  background(0);

  fft = new p5.FFT();
  audio.play();
  audio.setLoop(true);
  loop();

  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();
}

function draw() {
  frameRate(30);
  background(255);

  image(capture, width / 4, height / 4, width / 2, height / 2);

  loadPixels();
  updatePixels();
  noStroke();
  fill(0, 15);
  rect(0, 0, width, height);

  angleMode(RADIANS);
  stroke(100);
  noFill();
  strokeWeight(2);
  star(width / 2, height / 2, 180, 300, 5);

  angleMode(DEGREES);
  translate(width / 2, height / 2);
  fft.analyze();
  let amp = fft.getEnergy(20, 200);
  let wave = fft.waveform();
  stroke(0);
  noFill();

  for (let l = -1; l <= 1; l += 2) {
    for (let h = 0; h <= 400; h += 100) {
      beginShape();
      for (let i = 0; i <= 180; i += 0.5) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1));
        let r = map(wave[index], -1, 1, 260, 190);
        let x = r * i * l;
        let y = r - h;
        vertex(x, y);
      }
      endShape();
    }
  }

  let p = new Particles();
  particles.push(p);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

class Particles {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(3, 5);
  }
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  edges() {
    return (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2);
  }
  show() {
    noStroke();
    fill(random(0, 255));
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}

function keyPressed() {
  if (keyCode == RETURN) {
    audio.stop();
    audio.play();
    particles = [];
    clear();
  }
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}