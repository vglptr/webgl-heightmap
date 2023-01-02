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
let fps = document.querySelector("#fps");
let cubes = 100;
let imgData;
let elapsedSinceLastFPSdraw = 0;


function initWebGL() {
  var canvas = document.querySelector("#c");
  globalThis.gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("error: no webgl capability");
    return;
  }

  generateTerrain();

  cam = new Camera();
  cam.init();
  mainLoop();
}

function generateTerrain() {
  let grayscale = [];
  let j = 0;
  for (let i = 0; i < imgData.data.length; i += 4) {
    grayscale[j] = ((0.2126 * imgData.data[i + 0] + 0.7152 * imgData.data[i + 1] + 0.0722 * imgData.data[i + 2])) / 10;
    j++;
  }


  drawables = [];
  for (let i = 0; i < cubes; i++) {
    for (let j = 0; j < cubes; j++) {
      let cube = new Cube();
      cube.scale(1, grayscale[cubes * j + i], 1);
      cube.translate(i * 1.0, 0, j * 1.0);
      drawables.push(cube);
    }
  }
}

function mainLoop() {
  let start = Date.now();
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
  for (let i = 0; i < cubes; i++) {
    for (let j = 0; j < cubes; j++) {
      let m = m4.multiply(viewProjectionMatrix, drawables[cubes * j + i].positionMatrix);
      //matrix = m4.xRotate(matrix, rot);
      //matrix = m4.yRotate(matrix, rot);
      //matrix = m4.zRotate(matrix, rot);
      drawables[cubes * j + i].draw(lastDrawCode, m);
      lastDrawCode = drawables[cubes * j + i].constructor.drawCode;
    }
  }
  cam.update();
  if (elapsedSinceLastFPSdraw > 1000) {
    fps.textContent = `FPS: ${1000 / (Date.now() - start)}`;
    elapsedSinceLastFPSdraw = 0;
  } else {
    elapsedSinceLastFPSdraw += (Date.now() - start);
  }
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

function getImgData() {
  let images = document.querySelectorAll(".image");
  let currentImage = 0;
  return function (isNext) {
    isNext ? currentImage++ : currentImage--;
    if (currentImage < 0) {
      currentImage = 0;
      return;
    }
    if (currentImage >= images.length) {
      currentImage = images.length - 1;
      return;
    }
    let c = document.querySelector("#imgc");
    log5(c.width + " " + c.height);
    let ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(images[currentImage], 0, 0, 100, 100);
    imgData = ctx.getImageData(0, 0, c.width, c.height);
    log5(imgData);
  }
}

function initGui(switchImg) {
  let buttonNext = document.querySelector("#nextImage");
  buttonNext.addEventListener("click", () => {
    switchImg(true);
    generateTerrain();
  });
  let buttonPrev = document.querySelector("#prevImage");
  buttonPrev.addEventListener("click", () => {
    switchImg(false);
    generateTerrain();
  });
}

window.addEventListener('load', (event) => {
  initLog();
  const switchImg = getImgData(); //using closure to store images[] state
  switchImg(true);
  initGui(switchImg);
  initWebGL();
});