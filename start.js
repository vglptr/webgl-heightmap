//https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html alapján

import { m4 } from "./m4";
import { Cube } from "./cube";
import { Camera } from "./camera";

let logLevel = 0; //0..5, where 0 is off and 5 is trace inside a loop

globalThis.gl;
let cam;
let cubes = [];


function initWebGL() {
  var canvas = document.querySelector("#c");
  globalThis.gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("error: no webgl capability");
    return;
  }



  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      let cube = new Cube();
      cubes.push(cube);
    }
  }
  //Cube.init();

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
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      let matrix = m4.translate(viewProjectionMatrix, i * 2, j * 2, 0);
      //cube.draw(matrix);
      cubes[50 * j + i].draw(matrix, "cube");
      //cubes[0].draw(matrix, "cube");
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