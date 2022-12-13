export { vertexShaderSource, fragmentShaderSource };

var vertexShaderSource =
  `#version 300 es

  in vec4 a_color;
  in vec4 a_position;
  uniform mat4 u_matrix;

  // a varying the color to the fragment shader
  out vec4 v_color;
   
  void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    // Pass the color to the fragment shader.
    v_color = a_color;
  }
`;

var fragmentShaderSource =
  `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// the varied color passed from the vertex shader
in vec4 v_color;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = v_color;
}
`;