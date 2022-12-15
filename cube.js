import { cubeVertexShaderSource, cubeFragmentShaderSource } from "./shaders";
import { createShader, createProgram } from "./shaderutils";
export { Cube }

class Cube {
  positions;
  colors;

  vertexShader;
  fragmentShader;
  program;
  positionAttributeLocation;
  colorAttributeLocation;
  matrixLocation;
  vao;
  positionBuffer;
  colorBuffer;

  constructor() {
    this.generatePositions();
    this.generateColors();
  }

  init() {
    this.vertexShader = createShader(gl, gl.VERTEX_SHADER, cubeVertexShaderSource);
    this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, cubeFragmentShaderSource);
    this.program = createProgram(gl, this.vertexShader, this.fragmentShader);
    this.positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
    this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    this.colorAttributeLocation = gl.getAttribLocation(this.program, "a_color");
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    // Turn on the attribute
    gl.enableVertexAttribArray(this.colorAttributeLocation);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    let size_v = 3;          // 3 components per iteration
    let type_v = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    let normalize_v = true;  // convert from 0-255 to 0.0-1.0
    let stride_v = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    let offset_v = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(this.colorAttributeLocation, size_v, type_v, normalize_v, stride_v, offset_v);

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    let size_f = 3;          // 2 components per iteration
    let type_f = gl.FLOAT;   // the data is 32bit floats
    let normalize_f = false; // don't normalize the data
    let stride_f = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset_f = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(this.positionAttributeLocation, size_f, type_f, normalize_f, stride_f, offset_f);
  }

  draw(matrix) {
    gl.useProgram(this.program);
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 36;
    // Set the matrix.
    gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    gl.drawArrays(primitiveType, offset, count);
  }

  generatePositions() {
    this.positions = new Float32Array([
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

  generateColors() {
    this.colors = new Uint8Array([
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
