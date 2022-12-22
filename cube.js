import { cubeVertexShaderSource, cubeFragmentShaderSource } from "./shaders";
import { createShader, createProgram } from "./shaderutils";
import { m4 } from "./m4";
export { Cube }

class Cube {
  //██████████████████████████████████████████ GPU OPTIMIZATIONS ███████████████████████████████████████████\\

  static isInitCalled;
  static drawCode; //for identifiing during draw, so object with the same draw call will not call useProgram()

  //███████████████████████████████████████████████ VERTICES ███████████████████████████████████████████████\\

  static positions;
  //static colors;
  static normals;

  //███████████████████████████████████████████████ SHADERS ████████████████████████████████████████████████\\

  static vertexShader;
  static fragmentShader;
  static program;

  //███████████████████████████████████████████████ LOCATIONS ██████████████████████████████████████████████\\

  static positionAttributeLocation;
  //static colorAttributeLocation;
  static colorUniformLocation;
  static reverseLightDirectionLocation;  //for shading the sides
  static normalAttributeLocation;
  //static matrixLocation;
  static worldLocation;
  static worldViewProjectionLocation;

  //███████████████████████████████████████████████ BUFFERS ████████████████████████████████████████████████\\

  static vao;
  static positionBuffer;
  //static colorBuffer;
  static normalBuffer;

  //██████████████████████████████████████████████ LOCAL STATE █████████████████████████████████████████████\\

  positionMatrix;

  //████████████████████████████████████████████████████████████████████████████████████████████████████████\\

  constructor() {
    // Calling init only once per shape type, and saving everything to static context
    // During draw only the uniforms control the gpu items
    if (!Cube.isInitCalled) Cube.init();
    this.positionMatrix = m4.yRotation(0);
  }

  static init() {
    Cube.isInitCalled = true;
    Cube.generatePositions();
    //Cube.generateColors();
    Cube.generateNormals();
    Cube.drawCode = "cube";     //for reducing number of gl.useProgram() calls

    Cube.vertexShader = createShader(gl, gl.VERTEX_SHADER, cubeVertexShaderSource);
    Cube.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, cubeFragmentShaderSource);
    Cube.program = createProgram(gl, Cube.vertexShader, Cube.fragmentShader);
    //Cube.matrixLocation = gl.getUniformLocation(Cube.program, "u_matrix");

    Cube.worldViewProjectionLocation = gl.getUniformLocation(Cube.program, "u_worldViewProjection");
    Cube.worldLocation = gl.getUniformLocation(Cube.program, "u_world");

    Cube.positionAttributeLocation = gl.getAttribLocation(Cube.program, "a_position");
    Cube.colorUniformLocation = gl.getUniformLocation(Cube.program, "u_color");
    Cube.reverseLightDirectionLocation = gl.getUniformLocation(Cube.program, "u_reverseLightDirection");
    //Cube.colorAttributeLocation = gl.getAttribLocation(Cube.program, "a_color");
    Cube.normalAttributeLocation = gl.getAttribLocation(Cube.program, "a_normal");
    Cube.vao = gl.createVertexArray();
    gl.bindVertexArray(Cube.vao);

    Cube.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Cube.normals, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(Cube.normalAttributeLocation);
    gl.vertexAttribPointer(Cube.normalAttributeLocation, 3, gl.FLOAT, false, 0, 0); //below it's detailed which parameter means what

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    // Cube.colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, Cube.colors, gl.STATIC_DRAW);
    // // Turn on the attribute
    // gl.enableVertexAttribArray(Cube.colorAttributeLocation);
    // // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    // let size_v = 3;          // 3 components per iteration
    // let type_v = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    // let normalize_v = true;  // convert from 0-255 to 0.0-1.0
    // let stride_v = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    // let offset_v = 0;        // start at the beginning of the buffer
    // gl.vertexAttribPointer(Cube.colorAttributeLocation, size_v, type_v, normalize_v, stride_v, offset_v);

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

  draw(drawCode, modelViewProjectionMatrix) {
    if (drawCode != Cube.drawCode) {
      gl.useProgram(Cube.program);


      gl.uniform3fv(Cube.reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));
      gl.uniformMatrix4fv(Cube.worldLocation, false, m4.yRotation(0.0));
      gl.uniform4fv(Cube.colorUniformLocation, [0.2, 1.0, 0.2, 1]); // green
    }

    gl.uniformMatrix4fv(Cube.worldViewProjectionLocation, false, modelViewProjectionMatrix);

    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 36;
    gl.drawArrays(primitiveType, offset, count);
  }

  translate(x, y, z) {
    this.positionMatrix = m4.translate(this.positionMatrix, x, y, z);
  }

  scale(x, y, z) {
    this.positionMatrix = m4.scale(this.positionMatrix, x, y, z);
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

  static generateNormals() {
    Cube.normals = new Float32Array([
      //back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      //front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      //left
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      //right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      //top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      //bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ])
  };
};
