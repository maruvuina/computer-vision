var img = document.getElementById("binary");
var canvas = document.getElementById("canvas-binary-sobel");


function bindPixelAt(data, width) {
  return function(x, y, i) {
    i = i || 0;
    return data[((width * y) + x) * 4 + i];
  };
}

//Неоднородность яркости изображения называется краем. 
//Обнаружение краев — это метод, используемый для определения областей изображения, 
//где резко меняется яркость изображения.
function edgeDetection(img, canvas, maskX, maskY) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const width = img.width;
  const height = img.height;
  const imgData = ctx.getImageData(0, 0, width, height);

  let pixelAt = bindPixelAt(imgData.data, width);
  let data = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let pixelX = (
          (maskX[0][0] * pixelAt(x - 1, y - 1)) +
          (maskX[0][1] * pixelAt(x, y - 1)) +
          (maskX[0][2] * pixelAt(x + 1, y - 1)) +
          (maskX[1][0] * pixelAt(x - 1, y)) +
          (maskX[1][1] * pixelAt(x, y)) +
          (maskX[1][2] * pixelAt(x + 1, y)) +
          (maskX[2][0] * pixelAt(x - 1, y + 1)) +
          (maskX[2][1] * pixelAt(x, y + 1)) +
          (maskX[2][2] * pixelAt(x + 1, y + 1))
      );

      let pixelY = (
        (maskY[0][0] * pixelAt(x - 1, y - 1)) +
        (maskY[0][1] * pixelAt(x, y - 1)) +
        (maskY[0][2] * pixelAt(x + 1, y - 1)) +
        (maskY[1][0] * pixelAt(x - 1, y)) +
        (maskY[1][1] * pixelAt(x, y)) +
        (maskY[1][2] * pixelAt(x + 1, y)) +
        (maskY[2][0] * pixelAt(x - 1, y + 1)) +
        (maskY[2][1] * pixelAt(x, y + 1)) +
        (maskY[2][2] * pixelAt(x + 1, y + 1))
      );

      let magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
      data.push(magnitude, magnitude, magnitude, 255);
    }
  }

  let clampedArray = new Uint8ClampedArray(data);
  let putImageData = new ImageData(clampedArray, width, height);
  ctx.putImageData(putImageData, 0, 0);
}


function sobel(img, canvas) {
  let maskX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  let maskY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];
  edgeDetection(img, canvas, maskX, maskY);
}


//Prewitt operator detects both types of edges, these are:
// * Horizontal edges or along the x-axis,
// * Vertical Edges or along the y-axis.
//Steps:
// - Read the image.
// - Convert into grayscale if it is colored.
// - Convert into the double format.
// - Define the mask or filter.
// - Detect the edges along X-axis.
// - Detect the edges along Y-axis.
// - Combine the edges detected along the X and Y axes.
// - Display all the images.
function prewitt(img, canvas) {
  let maskX = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1]
  ];
  let maskY = [
    [-1,-1,-1],
    [0, 0, 0],
    [1, 1, 1]
  ];
  edgeDetection(img, canvas, maskX, maskY);
}

sobel(img, canvas);

canvas = document.getElementById("canvas-binary-prewitt");
prewitt(img, canvas);


img = document.getElementById("halftone");
canvas = document.getElementById("canvas-halftone-sobel");
sobel(img, canvas);

canvas = document.getElementById("canvas-halftone-prewitt");
prewitt(img, canvas);
