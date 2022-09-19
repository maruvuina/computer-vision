const img = document.getElementById("halftone");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0);
//returns RGBA color, we need to loop over every 4th child
const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//work with RGB without alpha channel, it's default
//The data array stores four values for each pixel
//as a one-dimensional array in the RGBA order, with integer values between 0 and 255 (inclusive)
//Если мы хотим получить черно-белый вариант изображения, 
//нам нужно, чтобы значения всех трех цветовых каналов были равны (R=G=B).
for (i = 0; i < imgData.data.length; i += 4) {
  let red = imgData.data[i];
  let green = imgData.data[i + 1];
  let blue = imgData.data[i + 2];
  let average = (red + green + blue) / 3;
  imgData.data[i] = average;
  imgData.data[i + 1] = average;
  imgData.data[i + 2] = average;
  imgData.data[i + 3] = 255;
}
ctx.putImageData(imgData, 0, 0);


const img2 = document.getElementById("to-binary");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
ctx2.drawImage(img2, 0, 0);
const imgData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
for (i = 0; i < imgData2.data.length; i += 4) {
  //Бинаризация основана на том, 
  //что значения яркости меньше определенного значения (например, 128) приравниваются к нулю, 
  //а свыше определенного значения (128) приравнивается к 255. 
  //Значение 128 является нейтральным серым, 
  //0 соответствует черному, 255 – белому. 
  //Следовательно, если мы возьмем изображение в градациях серого, 
  //изображение станет бинарным (монохромным, черно-белым).
  let red = imgData.data[i];
  let green = imgData.data[i + 1];
  let blue = imgData.data[i + 2];
  let neutralGray = 128;
  if (red < neutralGray) {
    imgData2.data[i] = 0;
  }
  if (green < neutralGray) {
    imgData2.data[i + 1] = 0;
  }
  if (blue < neutralGray) {
    imgData2.data[i + 2] = 0;
  }
  if (red > neutralGray) {
    imgData2.data[i] = 255;
  }
  if (green > neutralGray) {
    imgData2.data[i + 1] = 255;
  }
  if (blue > neutralGray) {
    imgData2.data[i + 2] = 255;
  }
}
ctx2.putImageData(imgData2, 0, 0);
