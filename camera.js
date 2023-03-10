import { m4 } from "./m4";
export { Camera };

class Camera {
  matrix;
  Keyboard;
  canvas;
  isPointerLocked;

  constructor() {
    this.matrix = m4.lookAt([80, 80, 110], [50, 0, 50], [0, 1, 0]);
  }

  translate(x, y, z) {
    this.matrix = m4.translate(this.matrix, x, y, z);
  }

  init() {
    this.canvas = document.querySelector("#c");
    this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.addEventListener('pointerlockchange', () => this.isPointerLocked = !this.isPointerLocked, false);
    this.canvas.onclick = () => {
      if(this.isPointerLocked) return;
      this.canvas.requestPointerLock();
    }
    this.canvas.addEventListener("mousemove", (e) => {
      log4(`mouse: ${e.clientX}:${e.clientY} mousemovementX: ${e.movementX} mousemovementY: ${e.movementY} canvas dim: ${this.canvas.width}:${this.canvas.height}`);

      if (this.isPointerLocked) {
        this.matrix = m4.yRotate(this.matrix, -0.001 * e.movementX);
        this.matrix = m4.xRotate(this.matrix, -0.001 * e.movementY);

      }
    }, false);

    this.Keyboard = {
      keys: {},
      keyPress: function (evt) {
        if (this.keys[evt.key] > 0) { return; }
        this.keys[evt.key] = evt.timeStamp || (new Date()).getTime();
        log4(JSON.stringify(this.keys));
      },
      keyRelease: function (evt) {
        this.keys[evt.key] = 0;
        log4(JSON.stringify(this.keys));
      }
    };
    window.addEventListener("keydown", this.Keyboard.keyPress.bind(this.Keyboard));
    window.addEventListener("keyup", this.Keyboard.keyRelease.bind(this.Keyboard));

  }

  update() {
    if (this.Keyboard.keys["w"] > 0) {
      this.translate(0, 0, -1.1);
    }
    if (this.Keyboard.keys["s"] > 0) {
      this.translate(0, 0, 1.1);
    }
    if (this.Keyboard.keys["a"] > 0) {
      this.translate(-1.1, 0, 0);
    }
    if (this.Keyboard.keys["d"] > 0) {
      this.translate(1.1, 0, 0);
    }
    if (this.Keyboard.keys["escape"] > 0) {
      document.exitPointerLock();
    }
  }
}