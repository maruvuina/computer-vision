var Algorithm;

(function (Algorithm) {
    var CSalg = (function () {
        function CSalg(config) {
            if (config === void 0) {
                config = {
                    lineCoords: [],
                    frameCoords: []
                };
            }
            this.param = config;
        }
        CSalg.prototype.init = function () {
            var opAlg = {
                retrieveBit: function (lineCoords, frameCoords) {
                    return 0 |
                        (lineCoords[0] < frameCoords[0]
                            ? 1
                            : lineCoords[0] > frameCoords[2]
                                ? 2
                                : 0) |
                        (lineCoords[1] < frameCoords[1]
                            ? 4
                            : lineCoords[1] > frameCoords[3]
                                ? 8
                                : 0);
                },
                retrieveIntersect: function (pointA, pointB, codeBit, frameCoords) {
                    return codeBit & 8
                        ? [
                            pointA[0] + ((pointB[0] - pointA[0]) * (frameCoords[3] - pointA[1])) / (pointB[1] - pointA[1]),
                            frameCoords[3]
                        ]
                        : codeBit & 4
                            ? [
                                pointA[0] + ((pointB[0] - pointA[0]) * (frameCoords[1] - pointA[1])) / (pointB[1] - pointA[1]),
                                frameCoords[1]
                            ]
                            : codeBit & 2
                                ? [
                                    frameCoords[2],
                                    pointA[1] + ((pointB[1] - pointA[1]) * (frameCoords[2] - pointA[0])) / (pointB[0] - pointA[0])
                                ]
                                : codeBit & 1
                                    ? [
                                        frameCoords[0],
                                        pointA[1] + ((pointB[1] - pointA[1]) * (frameCoords[0] - pointA[0])) / (pointB[0] - pointA[0])
                                    ]
                                    : null;
                },
                getClipArr: function (param) {
                    let _a, _b, _c;
                    let _d = [
                        opAlg.retrieveBit(param.lineCoords[0], param.frameCoords),
                        [],
                        [],
                        null,
                        null,
                        null,
                        null
                    ];
                    let cA = _d[0];
                    let tmpArrPoints = _d[1];
                    let result = _d[2];
                    let a = _d[3]; 
                    let b = _d[4];
                    let cB = _d[5]; 
                    let cLast = _d[6];
                    for (let i = 1; i < param.lineCoords.length; i++) {
                        _a = [param.lineCoords[i - 1], param.lineCoords[i]], a = _a[0], b = _a[1];
                        cB = cLast = opAlg.retrieveBit(b, param.frameCoords);
                        while (1) {
                            if (!(cA | cB)) {
                                tmpArrPoints.push(a);
                                if (cB !== cLast) {
                                    tmpArrPoints.push(b);
                                    if (i < param.lineCoords.length - 1) {
                                        result.push(tmpArrPoints);
                                        tmpArrPoints = [];
                                    }
                                }
                                else if (i === param.lineCoords.length - 1) {
                                    tmpArrPoints.push(b);
                                }
                                break;
                            }
                            if (cA & cB) {
                                break;
                            }
                            else {
                                cA
                                    ? (_b = [
                                        opAlg.retrieveIntersect(a, b, cA, param.frameCoords),
                                        opAlg.retrieveBit(a, param.frameCoords)
                                    ], a = _b[0], cA = _b[1], _b)
                                    : (_c = [
                                        opAlg.retrieveIntersect(a, b, cB, param.frameCoords),
                                        opAlg.retrieveBit(b, param.frameCoords)
                                    ], b = _c[0], cB = _c[1], _c);
                            }
                        }
                        cA = cLast;
                    }
                    if (tmpArrPoints.length) {
                        result.push(tmpArrPoints);
                    }
                    cA = tmpArrPoints = a = b = cB = cLast = undefined;
                    return result.flat();
                }
            };
            return opAlg.getClipArr(this.param);
        };
        return CSalg;
    }());
    Algorithm.CSalg = CSalg;
})(Algorithm || (Algorithm = {}));

var openCanvas = {
    elem: document.getElementById("canvas"),
    context: document.getElementById("canvas").getContext("2d"),
    draw: function () {
        let coordinatesOfRectangleAndLine = [
            [
                [
                    +document.getElementById("x1-line").value || 500,
                    +document.getElementById("y1-line").value || 100
                ],
                [
                    +document.getElementById("x2-line").value || 50,
                    +document.getElementById("y2-line").value || 170
                ]
            ],
            [
                +document.getElementById("x1-rect").value || 150,
                +document.getElementById("y1-rect").value || 90,
                +document.getElementById("x2-rect").value || 450,
                +document.getElementById("y2-rect").value || 200
            ]
        ];
        let coordsLine = coordinatesOfRectangleAndLine[0];
        let coordsFrame = coordinatesOfRectangleAndLine[1];
        openCanvas.context.clearRect(0, 0, openCanvas.elem.height * 2, openCanvas.elem.width * 2);
        openCanvas.context.beginPath();
        openCanvas.context.lineWidth = 3;
        openCanvas.context.strokeStyle = "#CCCC";
        openCanvas.context.moveTo(coordsLine[0][0], coordsLine[0][1]);
        openCanvas.context.lineTo(coordsLine[1][0], coordsLine[1][1]);
        openCanvas.context.stroke();
        openCanvas.context.beginPath();
        openCanvas.context.strokeStyle = "#ec38bc";
        openCanvas.context.rect(coordsFrame[0], coordsFrame[1], coordsFrame[2] - coordsFrame[0], coordsFrame[3] - coordsFrame[1]);
        openCanvas.context.stroke();
        coordsLine = new Algorithm.CSalg({
            lineCoords: [
                [coordsLine[0][0], coordsLine[0][1]],
                [coordsLine[1][0], coordsLine[1][1]]
            ],
            frameCoords: [
                coordsFrame[0],
                coordsFrame[1],
                coordsFrame[2],
                coordsFrame[3]
            ]
        }).init();
        openCanvas.context.beginPath();
        openCanvas.context.strokeStyle = "#7303c0";
        openCanvas.context.moveTo(coordsLine[0][0], coordsLine[0][1]);
        openCanvas.context.lineTo(coordsLine[1][0], coordsLine[1][1]);
        openCanvas.context.stroke();
    },
    events: {
        click: function (e) {
            if (e.target.id === "btn-draw") {
                openCanvas.draw();
            }
        }
    }
};

window.addEventListener("load", openCanvas.draw);
document.addEventListener("click", openCanvas.events.click);
window.addEventListener("beforeunload", function () {
    window.removeEventListener("load", openCanvas.draw);
    document.removeEventListener("click", openCanvas.events.click);
    openCanvas = undefined;
});
