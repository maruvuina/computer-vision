function processImage(inImg) {
    const width = inImg.width;
    const height = inImg.height;
    //все компоненты совмещены в 32-битный unsigned int в ABGR — Uint32Array
    const src = new Uint32Array(inImg.data.buffer);

    processCanvas('canvasResult', width, height, function(dst) {
      let brightness = parseInt($("#rangeBrightness").val());
      let contrast = parseInt($("#rangeContrast").val()) / 255;
      
      let avgGray = 0;
      //находим среднее значения серого цвета по всему изображению, 
      //то есть подсчитываем значение серого не для одного пикселя, а для всего изображения
      for (let i = 0; i < dst.length; i++) {
        //получаем только красные компоненты
        let r = src[i] & 0xFF;
        //получаем только зеленые компоненты
        let g = (src[i] >> 8) & 0xFF;
        //получаем только синие компоненты
        let b = (src[i] >> 16) & 0xFF;
        //применяем стандартную формулу для вычисления яркости, получаем серый цвет
        avgGray += (r * 0.2126 + g * 0.7152 + b * 0.0722); 
      }
      
      avgGray /= dst.length;
      
      for (let i = 0; i < dst.length; i++) {
        let r = src[i] & 0xFF;
        let g = (src[i] >> 8) & 0xFF;
        let b = (src[i] >> 16) & 0xFF;
        
        // Contrast
        // Контрастность это разница между максимальной и минимальной яркостью на изображении.
        // Ругулировка контрастности
        r += (r - avgGray) * contrast;
        g += (g - avgGray) * contrast;
        b += (b - avgGray) * contrast;

        // Brightness
        // Ругулировка яркости
        r += brightness;
        g += brightness;
        b += brightness;
        
        if (r > 255) {
          r = 255;
        } else if (r < 0) {
          r = 0;
        }
        if (g > 255) {
          g = 255;
        } else if (g < 0) { 
          g = 0;
        }
        if (b > 255) { 
          b = 255;
        } else if (b < 0) { 
          b = 0;
        }
        
        // прозрачность                |синий      |зеленый   |красный
        dst[i] = (src[i] & 0xFF000000) | (b << 16) | (g << 8) | r;
      }
      
      // Histogram
      // Сначала создадим массив из 256 элементов и заполним его нулями. 
      // Затем подсчитаем количество вхождений каждого значения яркости.
      let histBrightness = (new Array(256)).fill(0);
      for (let i = 0; i < dst.length; i++) {
        let r = dst[i] & 0xFF;
        let g = (dst[i] >> 8) & 0xFF;
        let b = (dst[i] >> 16) & 0xFF;
        histBrightness[r]++;
        histBrightness[g]++;
        histBrightness[b]++;
      }
  
      // Находим максимальное значение яркости
      let maxBrightness = 0;
      for (let i = 1; i < 256; i++) {
        if (maxBrightness < histBrightness[i]) {
          maxBrightness = histBrightness[i]
        }
      }
  
      // Яркость перемещает гистограмму влево/вправо, а контрастность сужает/расширяет диапазон.
      const canvas = document.getElementById('canvasHistogram');
      const ctx = canvas.getContext('2d');
      let dx = canvas.width / 256;
      let dy = canvas.height / maxBrightness;
      ctx.lineWidth = dx;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < 256; i++) {
        let x = i * dx;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, canvas.height - histBrightness[i] * dy);
        ctx.closePath();
        ctx.stroke(); 
      }
  });
}
  
function getImageData(el) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = document.getElementById(el);
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  return context.getImageData(0, 0, img.width, img.height);
}

function processCanvas(canvasId, width, height, func) {
  const canvas = document.getElementById(canvasId);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const outImg = ctx.createImageData(width, height);
  const dst = new Uint32Array(outImg.data.buffer);
  func(dst);
  ctx.putImageData(outImg, 0, 0);
}

document.getElementById('input').addEventListener('change', function() {
  if (this.files && this.files[0]) {
    var img = document.getElementById('img');
    img.src = URL.createObjectURL(this.files[0]);
    img.crossOrigin = "Anonymous";
    img.onload = update;
  }
});

$('input[type="range"]').on('input change', update);

function update(e) {
  $('#valueBrightness').text($("#rangeBrightness").val());
  $('#valueContrast').text($("#rangeContrast").val());
  processImage(getImageData('img'));
}

update();