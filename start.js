//https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html alapján

var vertexShaderSource =
  `#version 300 es
     
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
 
// all shaders have a main function
void main() {
  // Scale the position
  vec2 scaledPosition = a_position * u_scale;

  vec2 rotatedPosition = vec2(
    scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
    scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

  // Add in the translation
  vec2 position = rotatedPosition + u_translation;

  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource =
  `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

var translation = [0, 150];
var rotation = [0, 1];
var scale = [1, 1];
var rotationInRadian = 0;
var color = [Math.random(), Math.random(), Math.random(), 1];
var resolutionUniformLocation;
var rotationLocation;
var translationLocation;
var colorLocation;
var scaleLocation;
var program;
var gl;
var dir = 1;

function initWebGL() {
  var canvas = document.querySelector("#c");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("error: no webgl capability");
    return;
  }
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = createProgram(gl, vertexShader, fragmentShader);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  translationLocation = gl.getUniformLocation(program, "u_translation");
  colorLocation = gl.getUniformLocation(program, "u_color");
  rotationLocation = gl.getUniformLocation(program, "u_rotation");
  scaleLocation = gl.getUniformLocation(program, "u_scale");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  drawScene(gl);
}

function drawScene() {
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  // Pass in the canvas resolution so we can convert from
  // pixels to clip space in the shader
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  // Set the color.
  gl.uniform4fv(colorLocation, color);
  // Set the translation.
  console.log(translation[0]);

  if (translation[0] == 0) {
    //translation[0]++;
    dir = 1;
  }

  if (translation[0] == 400) {
    //translation[0]--;
    dir = -1;
  }

  translation[0] += dir * 1;
  rotationInRadian += 0.1;
  scale[0] += 0.1;
  scale[1] += 0.1;
  rotation[0] = Math.sin(rotationInRadian);
  rotation[1] = Math.cos(rotationInRadian);

  gl.uniform2fv(translationLocation, translation);
  // Set the rotation.
  gl.uniform2fv(rotationLocation, rotation);
  // Set the scale.
  var scaleSin = [];
  scaleSin[0] = Math.sin(scale[0]);
  scaleSin[1] = Math.sin(scale[1]);
  gl.uniform2fv(scaleLocation, scaleSin);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);
  window.requestAnimationFrame(drawScene);
}

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0, 0,
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,

      // top rung
      30, 0,
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,

      // middle rung
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90]),
    gl.STATIC_DRAW);
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
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