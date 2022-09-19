// Set pixel in point with coordinates (x, y) and transparency
let setPixel = function(coordinateX, coordinateY, transparency, canvas) {
    if(isFinite(coordinateX) && isFinite(coordinateY)) {
        let color = {
            r: setPixel.color.r,
            g: setPixel.color.g,
            b: setPixel.color.b,
            a: setPixel.color.a * transparency
        };
        let pixel = canvas.createImageData(1, 1);
        pixel.data[0] = color.r;
        pixel.data[1] = color.g;
        pixel.data[2] = color.b;
        pixel.data[3] = color.a;
        let data = canvas.getImageData(coordinateX, coordinateY, 1, 1).data;
        if(data[3] <= pixel.data[3]) {
            canvas.putImageData(pixel, coordinateX, coordinateY);
        }
    }
};

function fill_element(coordinateX, coordinateY, color, canvas, canvasX, canvasY) {
    let startColor = canvas.getImageData(coordinateX, coordinateY, 1, 1).data;
    setPixel.color = color;
    let matrix = [[coordinateX, coordinateY]];
    for(let i = 0; i != matrix.length; i++) {
        let x = matrix[i][0], y = matrix[i][1];
        let data = canvas.getImageData(x, y, 1, 1).data;
        if(x >= 0 && y >= 0 && x < canvasX && y < canvasY && 
            data[0] == startColor[0] && data[1] == startColor[1] && 
            data[2] == startColor[2] && data[3] == startColor[3]) {
            setPixel(x, y, 1, canvas);
            let s = matrix.length;
            matrix[s] = [x + 1, y];
            matrix[s + 1] = [x - 1, y]; 
            matrix[s + 2] = [x, y + 1];
            matrix[s + 3] = [x, y - 1];
            let max = 1000000;
            if(i > max) {
                return;
            }
        }
    }
}

let canvasElem = document.getElementById("canvas");
canvasElem.width = canvasElem.height = 600;
canvas = canvasElem.getContext("2d");
canvasX = canvasElem.width;
canvasY = canvasElem.height;
canvas.rect(50, 50, 350, 250);
canvas.strokeStyle = "blue";
canvas.stroke();
fill_element(100, 100, {r:100, g:200, b:200, a:155}, canvas, canvasX, canvasY);



let canvas2 = document.querySelector("#canvas-2");
let context2 = canvas2.getContext("2d");

function fillPolygon(points, color) {
    if (points.length > 0) {
        context2.fillStyle = color;
        let point = points[0];
        context2.beginPath();
        context2.moveTo(point.x, point.y);
        for (let i = 1; i < points.length; i++) {
            point = points[i];
            context2.lineTo(point.x, point.y);
        }
        context2.closePath();
        context2.fill();
    }
}

let points = [ 
    {x: 20, y: 40},
    {x: 70, y: 150},
    {x: 10, y: 80},
    {x: 180, y: 170},
    {x: 150, y: 70}
];

fillPolygon(points, "yellow");
