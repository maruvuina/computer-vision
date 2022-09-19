var img = document.getElementById("binary");
var canvas = document.getElementById("canvas-binary-1");
var windowSize = 3;

//Медианный фильтр представляет собой скользящие окно, 
//в нашем случае, размерностью 3x3 (9x9) пикселя. 
//На вход он принимает 9 значений (пикселей), а на выход выдаёт одно. 
//Работает медианный фильтр так: сортирует входные данные (пиксели) в порядке возрастания и 
//выдаёт серединный результат (медиану), который заменяется на пиксел, который был в центре окна.

//Cкользящее окно 3x3 - картинка проходит сквозь статичное окно.

//Особенности этого алгоритма:
//Применяется лишь к одному цветовому каналу,
//Не применяется к крайним пикселям.

function medianFilter(img, canvas, windowSize) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);

  const channels = imgData.data.length / (width * height);
  const filterWindow = [[]];
  const limit = (windowSize - 1) / 2;

  for (let i = limit * -1; i < limit + 1; i += 1) {
    for (let j = limit * -1; j < limit + 1; j += 1) {
      filterWindow.push([i, j]);
    }
  }

  for (let col = limit; col < width - limit; col += 1) {
    for (let row = limit; row < height - limit; row += 1) {
      const index = (row * width + col) * channels;
      const arr = [];

      for (let z = 0; z < filterWindow.length; z += 1) {
        const i = ((row + filterWindow[z][0]) * width + (col + filterWindow[z][1])) * channels;
        const average = Math.sqrt((imgData.data[i] ** 2 + imgData.data[i + 1] ** 2 + imgData.data[i + 2] ** 2) / 3);

        arr.push(average);
      }

      const sorted = arr.sort((a, b) => a - b);
      const medianValue = sorted[Math.floor(sorted.length / 2)];

      imgData.data[index + 0] = medianValue;
      imgData.data[index + 1] = medianValue;
      imgData.data[index + 2] = medianValue;

      if (channels === 4) {
        imgData.data[index + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

medianFilter(img, canvas, windowSize);

canvas = document.getElementById("canvas-binary-2");
windowSize = 9;
medianFilter(img, canvas, windowSize);

img = document.getElementById("halftone");
canvas = document.getElementById("canvas-halftone-1");
windowSize = 3;

medianFilter(img, canvas, windowSize);

canvas = document.getElementById("canvas-halftone-2");
windowSize = 9;

medianFilter(img, canvas, windowSize);
