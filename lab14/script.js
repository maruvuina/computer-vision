//ml5.js is the machine learning library in your web browser. 
//It is built on top of tensorflow.js in which all the heavy-lifting or 
//low-level tasks regarding machine learning are done in tensorflow.js. 
//It is made for those who have no or little knowledge about machine learning.

// Initialize the Object Detector module
let objectDetector;

// Holds the image we want to run object detection on
let img;

function preload() {
  //Object detection is a computer vision technique that works to identify 
  //and locate objects within an image or video.

  // COCO stands for Common Object in Context. 
  // It is large-scale object detection, segmentation, and captioning dataset.

  // SSD stands for Single-Shot Detector. 
  // It is the machine learning’s object detection technique by Wei Liu et al.

  // COCO-SSD is a pre-trained model built from 
  // using the SSD technique trained with the COCO dataset. 
  // It could detect 80 different classes of objects. 
  // The classes are person, bicycle, car, cat, dog, bottle, etc.
  objectDetector = ml5.objectDetector('cocossd');
  img = loadImage('https://i.imgur.com/TIQx3bd.jpeg');
}

function setup() {
  createCanvas(1700, 1700);
  objectDetector.detect(img, gotResult);
  image(img, 0, 0);
}

//The detection phase might take a few seconds 
//while it searches in a huge predefined dataset called COCO with over 330K images 
//and 1.5 million object instances.
function gotResult(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    drawResults(results);
  }
}

function drawResults(results) {
  results.forEach((result) => {
    // Generates a random color for each object
    const r = Math.random()*256|0;
    const g = Math.random()*256|0;
    const b = Math.random()*256|0;
    // Draw the text
    stroke(0, 0, 0);
    strokeWeight(2);
    textSize(16);
    fill(r, g, b);
    text(`${result.label} (${result.confidence.toFixed(2)}%)`, result.x, result.y - 10);
    // Draw the rectangle stroke
    noFill();
    strokeWeight(3);
    stroke(r, g, b);
    rect(result.x, result.y, result.width, result.height);
  });
};