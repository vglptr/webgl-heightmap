import { m4 } from "./m4";
export { Camera };

class Camera {
  //cameraMatrix = m4.lookAt([-1, 2, 2], [0, 0, 0], [0, 1, 0]);
  matrix;

  constructor() {
    this.matrix = m4.lookAt([2, 2, 2], [0, 0, 0], [0, 1, 0]);
  }

  translate(x, y, z) {
    this.matrix = m4.translate(this.matrix, x, y, z);
    //12-14 is x,y,z camera pos
    this.matrix = m4.lookAt([this.matrix[12], this.matrix[13], this.matrix[14]], [0, 0, 0], [0, 1, 0]);
  }


  init() {
    document.addEventListener('keydown', (e) => {
      if (e.key == "w") {
        this.translate(0, 0, -0.1);
      }
      if (e.key == "s") {
        this.translate(0, 0, 0.1);
      }
      if (e.key == "a") {
        this.translate(-0.1, 0, 0);
      }
      if (e.key == "d") {
        this.translate(0.1, 0, 0);
      }
      if (e.key == "q") {
        this.translate(0.0, 0.1, 0.0);
      }
      if (e.key == "y") {
        this.translate(0.0, -0.1, 0.0);
      }
    });
  }
}