import { cubeVertexShaderSource, cubeFragmentShaderSource } from "./shaders";
import { createShader, createProgram } from "./shaderutils";
export { Cube }

class Cube {
  static isInitCalled;
  static drawCode; //for identifiing during draw, so object with the same draw call will not call useProgram()
  static drawCodeUsed;
  static positions;
  static colors;

  static vertexShader;
  static fragmentShader;
  static program;
  static positionAttributeLocation;
  static colorAttributeLocation;
  static matrixLocation;
  static vao;
  static positionBuffer;
  static colorBuffer;

  constructor() {
    // Calling init only once per shape type, and saving everything to static context
    // During draw only the uniforms control the gpu items
    if (!Cube.isInitCalled) Cube.init();
  }

  static init() {
    Cube.isInitCalled = true;
    Cube.generatePositions();
    Cube.generateColors();
    Cube.drawCode = "cube";
    Cube.drawCodeUsed = false;

    Cube.vertexShader = createShader(gl, gl.VERTEX_SHADER, cubeVertexShaderSource);
    Cube.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, cubeFragmentShaderSource);
    Cube.program = createProgram(gl, Cube.vertexShader, Cube.fragmentShader);
    Cube.positionAttributeLocation = gl.getAttribLocation(Cube.program, "a_position");
    Cube.matrixLocation = gl.getUniformLocation(Cube.program, "u_matrix");
    Cube.colorAttributeLocation = gl.getAttribLocation(Cube.program, "a_color");
    Cube.vao = gl.createVertexArray();
    gl.bindVertexArray(Cube.vao);

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    Cube.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Cube.colors, gl.STATIC_DRAW);
    // Turn on the attribute
    gl.enableVertexAttribArray(Cube.colorAttributeLocation);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    let size_v = 3;          // 3 components per iteration
    let type_v = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    let normalize_v = true;  // convert from 0-255 to 0.0-1.0
    let stride_v = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    let offset_v = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(Cube.colorAttributeLocation, size_v, type_v, normalize_v, stride_v, offset_v);

    Cube.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Cube.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(Cube.positionAttributeLocation);
    let size_f = 3;          // 2 components per iteration
    let type_f = gl.FLOAT;   // the data is 32bit floats
    let normalize_f = false; // don't normalize the data
    let stride_f = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset_f = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(Cube.positionAttributeLocation, size_f, type_f, normalize_f, stride_f, offset_f);
  }

  draw(matrix, drawCode) {
    if (drawCode != Cube.drawCode || Cube.drawCodeUsed == false) {
      gl.useProgram(Cube.program);
      Cube.drawCodeUsed = true;
    }
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 36;
    // Set the matrix.
    gl.uniformMatrix4fv(Cube.matrixLocation, false, matrix);
    gl.drawArrays(primitiveType, offset, count);
  }

  static generatePositions() {
    Cube.positions = new Float32Array([
      //back
      1, 0, 0,
      0, 0, 0,
      0, 1, 0,
      1, 1, 0,
      1, 0, 0,
      0, 1, 0,

      //front

      0, 0, 1,
      1, 0, 1,
      1, 1, 1,
      0, 1, 1,
      0, 0, 1,
      1, 1, 1,

      //left
      0, 0, 0,
      0, 0, 1,
      0, 1, 1,
      0, 1, 0,
      0, 0, 0,
      0, 1, 1,

      //right
      1, 1, 1,
      1, 0, 1,
      1, 0, 0,
      1, 1, 1,
      1, 0, 0,
      1, 1, 0,

      //top
      0, 1, 1,
      1, 1, 1,
      1, 1, 0,
      0, 1, 0,
      0, 1, 1,
      1, 1, 0,

      //bottom
      0, 0, 0,
      1, 0, 0,
      1, 0, 1,
      0, 0, 1,
      0, 0, 0,
      1, 0, 1,
    ]);
  }

  static generateColors() {
    Cube.colors = new Uint8Array([
      //back
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,

      //front
      0, 0, 255,
      0, 0, 255,
      255, 255, 0,
      0, 0, 255,
      0, 0, 255,
      0, 0, 255,

      //left
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,

      //right
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,

      //top
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,

      //bottom
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,
      255, 0, 0,
      0, 255, 0,
      0, 0, 255,
    ]);
  }
};
