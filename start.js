//https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html alapján

import { m4 } from "./m4";
import { Cube } from "./cube";
import { Camera } from "./camera";

let logLevel = 0; //0..5, where 0 is off and 5 is trace inside a loop

globalThis.gl;
let cam;
let drawables = [];
let lastDrawCode;
let rot = 0;


function initWebGL() {
  var canvas = document.querySelector("#c");
  globalThis.gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("error: no webgl capability");
    return;
  }

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      let cube = new Cube();
      drawables.push(cube);
    }
  }

  cam = new Camera();
  cam.init();
  mainLoop();
}

function mainLoop() {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 0.1;
  var zFar = 500;
  var projectionMatrix = m4.perspective(m4.degToRad(75), aspect, zNear, zFar);

  var viewMatrix = m4.inverse(cam.matrix);
  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  rot += 0.01;

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      let matrix = m4.translate(viewProjectionMatrix, i * 2, 0, j * 2);
      //matrix = m4.xRotate(matrix, rot);
      //matrix = m4.yRotate(matrix, rot);
      //matrix = m4.zRotate(matrix, rot);
      drawables[20 * j + i].positionMatrix = matrix;
      drawables[20 * j + i].draw(lastDrawCode);
      lastDrawCode = drawables[20 * j + i].constructor.drawCode;
    }
  }
  cam.update();
  window.requestAnimationFrame(mainLoop);
}

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize = canvas.width !== displayWidth ||
    canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function initLog() {
  let logLevels = [1, 2, 3, 4, 5];
  logLevels.forEach((i) => {
    globalThis["log" + i] = function (m) {
      if (logLevel >= i) console.log(m);
    }
  });
}

initLog();
initWebGL();