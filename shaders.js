export { cubeVertexShaderSource, cubeFragmentShaderSource };

let cubeVertexShaderSource =
  `#version 300 es

  //in vec4 a_color;
  in vec4 a_position;
  in vec3 a_normal;
  uniform mat4 u_matrix;

  // a varying the color to the fragment shader
  //out vec4 v_color;
  out vec3 v_normal;
   
  void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    // Pass the color to the fragment shader.
    //v_color = a_color;
    
    // Pass the normal to the fragment shader
    v_normal = a_normal;
  }
`;

let cubeFragmentShaderSource =
  `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// the varied color passed from the vertex shader
//in vec4 v_color;

// Passed in and varied from the vertex shader.
in vec3 v_normal;
 
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // outColor = v_color;

  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);
 
  // compute the light by taking the dot product
  // of the normal to the light's reverse direction
  float light = dot(normal, u_reverseLightDirection);
 
  outColor = u_color;
 
  // Lets multiply just the color portion (not the alpha)
  // by the light
  outColor.rgb *= light;
}
`;