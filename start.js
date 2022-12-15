//https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html alapján

import { m4 } from "./m4";
import { Cube } from "./cube";
import { Camera } from "./camera";

globalThis.gl;
let cam;
let cube;
let cube2;

function initWebGL() {
  var canvas = document.querySelector("#c");
  globalThis.gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("error: no webgl capability");
    return;
  }

  cube = new Cube();
  cube.init();

  cube2 = new Cube();
  cube2.init();

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

  // add in the translation for this F
  //ezt még lehet, hogy majd máshogy kell...
  let matrix = m4.translate(viewProjectionMatrix, 0, 0, 0);
  cube.draw(matrix);
  let matrix2 = m4.translate(viewProjectionMatrix, 2, 0, 0);
  cube2.draw(matrix2);
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

initWebGL();