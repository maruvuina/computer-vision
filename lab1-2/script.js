// Segment
let segment = document.getElementById("segment"),
    segmentCtx = segment.getContext("2d");

segment.width = segment.height = 500;

//Horizontal
segmentCtx.beginPath();
segmentCtx.moveTo(30.5,10);
segmentCtx.lineTo(400.5,10);
segmentCtx.stroke();
//Verticle
segmentCtx.beginPath();
segmentCtx.moveTo(30.5,30);
segmentCtx.lineTo(30.5,400);
segmentCtx.stroke();


// Change the line width
segmentCtx.lineWidth = 4;

//Horizontal
segmentCtx.beginPath();
segmentCtx.moveTo(30,20);
segmentCtx.lineTo(400,20);
segmentCtx.stroke();
//Verticle
segmentCtx.beginPath();
segmentCtx.moveTo(50,30);
segmentCtx.lineTo(50,400);
segmentCtx.stroke();

// Circle
let circle = document.getElementById("circle"),
	ctxCircle = circle.getContext("2d");

circle.width = circle.height = 500;	

ctxCircle.arc(250, 250, 187.5, 0, getRadians(360));
ctxCircle.stroke();

function getRadians(degrees) {
	return (Math.PI / 180) * degrees;
}

// Ellipse
let ellipse = document.getElementById("ellipse"),
	ctxEllipse = ellipse.getContext("2d");

ellipse.width = ellipse.height = 500;	

ctxEllipse.beginPath();
ctxEllipse.ellipse(250, 250, 100, 150, Math.PI / 4, 0, 2 * Math.PI);
ctxEllipse.stroke();
