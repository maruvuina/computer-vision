var img = document.getElementById("image");
var canvas = document.getElementById("canvas");


function updateInput(val) {
  document.getElementById('threshold-value').innerHTML = val;
}

updateInput(document.getElementById('threshold').value);


function findPosition(elementImg) {
  let position = [elementImg.x, elementImg.y];
  if(typeof(elementImg.offsetParent) != "undefined") {
    let posX = 0;
    let posY = 0;
    for(; elementImg; elementImg = elementImg.offsetParent) {
      posX += elementImg.offsetLeft;
      posY += elementImg.offsetTop;
    }
    position = [posX, posY];
  }
  return position;
}


function getCoordinates(event) {
  let positionX = 0;
  let positionY = 0;
  let imgPosition = findPosition(img);
  if (event.pageX || event.pageY) {
    positionX = event.pageX;
    positionY = event.pageY;
  } else if (event.clientX || event.clientY) {
    positionX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    positionY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  positionX = positionX - imgPosition[0];
  positionY = positionY - imgPosition[1];
  return [positionX, positionY];
}


function updateCanvasImage(e) {
  if (!e) {
    var e = window.event;
  }
  regionGrowing(img, canvas, e);
}

img.onmousedown = updateCanvasImage;


function next8Neighbours(neighbour) {
  const x = neighbour[0];
  const y = neighbour[1];
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x + 1, y + 1],
    [x - 1, y + 1]
  ];
}


function regionGrowing(img, canvas, event) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const width = img.width;
  const height = img.height;
  const imgData = ctx.getImageData(0, 0, width, height); 

  //Значение «порога» определяет, 
  //принадлежит ли данный смежный пиксель к «области» - 
  //разница между значениями RGB кандидата (то есть этого пикселя) и 
  //значениями начального (изначально выбранного пикселя, то есть seed) должна быть ниже порога.
  let threshold = document.getElementById('threshold').value;
  let [positionX, positionY] = getCoordinates(event);
  let seed = [positionX, positionY].map(Math.round);

  let inputData = imgData.data;
  let outputData = new Uint8ClampedArray(inputData);
  let seedIndex = (seed[1] * width + seed[0]) * 4;
  let seedR = inputData[seedIndex];
  let seedG = inputData[seedIndex + 1];
  let seedB = inputData[seedIndex + 2];
  let neighbour = [seed];
  while (neighbour.length) {
    const neighbourList = [];
    for (let i = 0; i < neighbour.length; i++) {
      let next = next8Neighbours(neighbour[i]);
      for (let j = 0; j < next.length; j++) {
        let tempX = next[j][0];
        let tempY = next[j][1];
        if (tempX >= 0 && tempX < width && tempY >= 0 && tempY < height) {
          let ci = (tempY * width + tempX) * 4;
          let cr = inputData[ci];
          let cg = inputData[ci + 1];
          let cb = inputData[ci + 2];
          let ca = inputData[ci + 3];
          // if alpha is zero, carry on
          if (ca === 0) {
            continue;
          }
          // check every neighbour for smallest distance
          if (Math.abs(seedR - cr) < threshold && Math.abs(seedG - cg) < threshold && Math.abs(seedB - cb) < threshold) {
            outputData[ci] = 105;
            outputData[ci + 1] = 10;
            outputData[ci + 2] = 40;
            outputData[ci + 3] = 155;
            neighbourList.push([tempX, tempY]);
          }
          // mark as visited
          inputData[ci + 3] = 0;
        }
      }
    }
    neighbour = neighbourList;
  }
  let putImageData = new ImageData(outputData, width, height);
  ctx.putImageData(putImageData, 0, 0);
}
