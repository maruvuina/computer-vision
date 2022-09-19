var points = [
	0, -30, 20, 30, -20, 24, -60, -20, 0, 10,  0, 60, -6, 0, 20, 0, 33
];

var canvasGraphicSettings = {
	xShift:        0,
	yShift:        0,
	xStretch:      1,
	yStretch:      1,
	paddingTop:    10,
	paddingBottom: 10,
	paddingRight:  10,
	paddingLeft:   10
};

function setCanvasGraphicSettings(canvasId) {
	let maxY;
	let minY;
	let canvas = retrieveCanvas(canvasId);
	canvas.width = window.innerWidth - 4;
	canvas.height = window.innerHeight - 5;
	if (points.length > 0) {
		maxY = points[0];
		minY = points[0];
		for (let i = 0; i < points.length; i++) {
			if (maxY < points[i]) {
				maxY = points[i];
			} else if (minY > points[i]) {
				minY = points[i];
			}
		}
		canvasGraphicSettings.xStretch = (canvas.width - canvasGraphicSettings.paddingRight - canvasGraphicSettings.paddingLeft) / (points.length - 1);
		if (maxY != minY) {
			canvasGraphicSettings.yStretch = (canvas.height - canvasGraphicSettings.paddingTop - canvasGraphicSettings.paddingBottom) / (maxY - minY);
		} else {
			canvasGraphicSettings.yStretch = 1;
		}
		canvasGraphicSettings.xShift = canvasGraphicSettings.paddingLeft;
		canvasGraphicSettings.yShift = canvasGraphicSettings.paddingBottom - minY * canvasGraphicSettings.yStretch;
	}
}

function drawAxis(canvasId) {
	let canvas = retrieveCanvas(canvasId);
	let context = canvas.getContext('2d');
	context.beginPath();
	context.moveTo(canvasGraphicSettings.paddingLeft, canvasGraphicSettings.paddingTop);
	context.lineTo(canvasGraphicSettings.paddingLeft, canvas.height - canvasGraphicSettings.paddingBottom);
	if ((canvas.height - canvasGraphicSettings.yShift >= canvasGraphicSettings.paddingTop) && (canvasGraphicSettings.yShift >= canvasGraphicSettings.paddingBottom)) {
		context.moveTo(canvasGraphicSettings.paddingLeft, Math.round(canvas.height - canvasGraphicSettings.yShift));
		context.lineTo(canvas.width - canvasGraphicSettings.paddingRight, Math.round(canvas.height - canvasGraphicSettings.yShift));
	}
	context.lineWidth = 2;
	context.strokeStyle = 'black';
	context.stroke();
}

function retrievePointsX(pointIndex) {
	return canvasGraphicSettings.xShift + canvasGraphicSettings.xStretch * pointIndex;
}

function retrievePointsY(canvas, yPoint) {
	return canvas.height - canvasGraphicSettings.yShift - canvasGraphicSettings.yStretch * yPoint;
}

function drawGraphicUsingLine(canvasId) {
	let canvas = retrieveCanvas(canvasId);
	let context = canvas.getContext('2d');
	if (points.length > 0) {
		context.beginPath();
		context.moveTo(retrievePointsX(0), retrievePointsY(canvas, points[0]));
		for (let i = 1; i < points.length; i++) {
			context.lineTo(retrievePointsX(i), retrievePointsY(canvas, points[i]));
		}
		context.lineWidth = 2;
		context.strokeStyle = '#f67280';
		context.stroke();
	}
}

function drawGraphicUsingBezier(canvasId) {
	let canvas = retrieveCanvas(canvasId);
	let context = canvas.getContext('2d');
	var xStretch = canvasGraphicSettings.xStretch;
	var xStretchSqr = xStretch * xStretch;
	var yA, yB, yC, xA, subYaYb, subYaYc, k, s, xLeft, yLeft, xRight, yRight;
	context.beginPath();
	yA = retrievePointsY(canvas, points[0]);
	yC = retrievePointsY(canvas, points[1]);
	context.moveTo(retrievePointsX(0), yA);
	for (let i = 1; i < points.length; i++) {
		yB = yA;
		yA = yC;
		yC = retrievePointsY(canvas, points[i + 1]);
		xA = retrievePointsX(i);
		if (i < points.length - 1) {
			subYaYb = yA - yB;
			subYaYc = yA - yC;
			if (subYaYb != subYaYc) {
				k = (Math.sqrt((xStretchSqr + subYaYb * subYaYb) * (xStretchSqr + subYaYc * subYaYc)) - xStretchSqr - subYaYb * subYaYc) / (xStretch * (yC - yB));
			} else {
				k = 0;
			}
			s = xStretch / 2 * Math.sqrt(1 / (1 + k * k));
			xLeft = xA - s;
			yLeft = yA - k * s;
		}
		if (i == 1) {
			context.quadraticCurveTo(xLeft, yLeft, xA, yA);
		} else if (i < points.length - 1) {
			context.bezierCurveTo(xRight, yRight, xLeft, yLeft, xA, yA);
		} else {
			context.quadraticCurveTo(xRight, yRight, xA, yA);
		}
		if (i < points.length - 1) {
			xRight = xA + s;
			yRight = yA + k * s;
		}
	}
	context.lineWidth = 2;
	context.strokeStyle = '#355c7d';
	context.stroke();
}

function retrieveCanvas(canvasId) {
	return document.getElementById(canvasId);
}

function drawGraphic() {
	var canvasId = 'canvas';
	setCanvasGraphicSettings(canvasId);
	drawAxis(canvasId);
	drawGraphicUsingLine(canvasId);
	drawGraphicUsingBezier(canvasId);
}
