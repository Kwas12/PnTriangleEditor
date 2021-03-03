//Klasa kamery
class Camera {
  constructor(gl, fov, near, far) {
    //Ustawienie macierzy perspektywy
    this.projectionMatrix = new Float32Array(16);
    var ratio = gl.canvas.width / gl.canvas.height;
    Matrix4.perspective(
      this.projectionMatrix,
      fov || 45,
      ratio,
      near || 0.1,
      far || 100.0
    );

    this.transform = new Transform(); //Ustawienia dla poruszania się kamery
    this.viewMatrix = new Float32Array(16); //zmienna do przechowywania macierzy transformacji

    this.mode = Camera.MODE_ORBIT;
  }

  //Obrót Kamery w osi x
  panX(v) {
    this.updateViewMatrix();
    var ratio = Math.abs(this.transform.rotation.y % 360);

    if (ratio < 90 || ratio > 270) {
      this.transform.position.x += this.transform.right[0] * v;
    } else {
      this.transform.position.x += this.transform.right[0] * -v;
    }
    if (this.mode == Camera.MODE_ORBIT) {
      return;
    }
    this.transform.position.y += this.transform.right[1] * v;
    this.transform.position.z += this.transform.right[2] * v;
  }
  //Obrót kamery wokół osi y
  panY(v) {
    this.updateViewMatrix();
    this.transform.position.y += this.transform.up[1] * v;
    if (this.mode == Camera.MODE_ORBIT) {
      return;
    }
    this.transform.position.x += this.transform.up[0] * v;
    this.transform.position.z += this.transform.up[2] * v;
  }
  //Obrót kamery wokół osi z
  panZ(v) {
    this.updateViewMatrix();
    if (this.mode == Camera.MODE_ORBIT) {
      this.transform.position.z += v;
    } else {
      this.transform.position.x += this.transform.up[0] * v;
      this.transform.position.y += this.transform.up[1] * v;
      this.transform.position.z += this.transform.up[2] * v;
    }
  }

  //Aktualizacja macierzy
  updateViewMatrix() {
    if (this.mode == Camera.MODE_FREE) {
      this.transform.matView
        .reset()
        .vtranslate(this.transform.position)
        .rotateY(this.transform.rotation.y * Transform.deg2Red)
        .rotateX(this.transform.rotation.x * Transform.deg2Red);
    } else {
      this.transform.matView
        .reset()
        .rotateY(this.transform.rotation.y * Transform.deg2Rad)
        .rotateX(this.transform.rotation.x * Transform.deg2Rad)
        .vtranslate(this.transform.position);
    }

    this.transform.updateDirection();

    // Kamera jest sztucznym tworem, tak naprawdę przesuwamy wszystko wokół niej
    Matrix4.invert(this.viewMatrix, this.transform.matView.raw);
    return this.viewMatrix;
  }

  //Pobranie macierzy bez translacji
  getTranslatelessMatrix() {
    var mat = new Float32Array(this.viewMatrix);
    mat[12] = mat[13] = mat[14] = 0.0; //Reset przekształcenia pozycji w macierzy na zero
    return mat;
  }
}

Camera.MODE_FREE = 0;
Camera.MODE_ORBIT = 1;

//Klasa do obsługi sterowania kamerą
class CameraController {
  constructor(gl, camera) {
    var oThis = this;
    var box = gl.canvas.getBoundingClientRect();
    this.canvas = gl.canvas;
    this.camera = camera;

    //jak szybko ma sie przemieszczać kamera
    this.rotateRate = -300;
    this.panRate = 5;
    this.zoomRate = 200;

    //pomaga wyliczyć pozycje myszki
    this.offsetX = box.left;
    this.offsetY = box.top;

    this.initX = 0;
    this.initY = 0;
    this.prevX = 0;
    this.prevY = 0;

    this.onUpHandler = function (e) {
      oThis.onMouseUp(e);
    };

    this.onMoveHandler = function (e) {
      oThis.onMouseMove(e);
    };

    this.canvas.addEventListener("mousedown", function (e) {
      oThis.onMouseDown(e);
    });

    this.canvas.addEventListener("mousewheel", function (e) {
      oThis.onMouseWheel(e);
    });
  }

  getMouseVec2(e) {
    return { x: e.pageX - this.offsetX, y: e.pageY - this.offsetY };
  }

  //dodanie nasłuchiwania na ruch
  onMouseDown(e) {
    this.initX = this.prevX = e.pageX - this.offsetX;
    this.initY = this.prevY = e.pageY - this.offsetY;

    this.canvas.addEventListener("mouseup", this.onUpHandler);
    this.canvas.addEventListener("mousemove", this.onMoveHandler);
  }

  //zdjęcie nasłuchiwania na ruch
  onMouseUp(e) {
    this.canvas.removeEventListener("mouseup", this.onUpHandler);
    this.canvas.removeEventListener("mousemove", this.onMoveHandler);
  }

  //Reakcja na obrót scroll
  onMouseWheel(e) {
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)); //mapowanie obrotu scroll  do liczb między -1 a 1
    this.camera.panZ(delta * (this.zoomRate / this.canvas.height)); //utrzymywanie tej samej prędkości pomimo większej rożnicy
  }

  //reakcja na ruch myszką
  onMouseMove(e) {
    //początek pozycyj canvas
    var x = e.pageX - this.offsetX;
    var y = e.pageY - this.offsetY;
    //różnica między ostatnim ruchem myszki
    var dx = x - this.prevX;
    var dy = y - this.prevY;

    //jeśli nie jest wciśnięty shift obracamy się
    if (!e.ctrlKey) {
      this.camera.transform.rotation.y +=
        dx * (this.rotateRate / this.canvas.width);

      this.camera.transform.rotation.x +=
        dy * (this.rotateRate / this.canvas.height);
    } else {
      this.camera.panX(-dx * (this.panRate / this.canvas.width));
      this.camera.panY(dy * (this.panRate / this.canvas.height));
    }

    this.prevX = x;
    this.prevY = y;
  }
}
