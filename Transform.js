//Klasa odpowiedzialna za transformacje
class Transform {
  constructor() {
    this.position = new Vector3(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.rotation = new Vector3(0, 0, 0);
    this.matView = new Matrix4(); //pamięć do wyniku wywołania funkcji update matrix
    this.matNormal = new Float32Array(9);

    //wektory kierunków
    this.forward = new Float32Array(4);
    this.up = new Float32Array(4);
    this.right = new Float32Array(4);
  }

  //Aktualizacja Macierzy
  updateMatrix() {
    this.matView.reset();
    this.matView.vtranslate(this.position);
    this.matView.rotateX(this.rotation.x * Transform.deg2Rad);
    this.matView.rotateZ(this.rotation.z * Transform.deg2Rad);
    this.matView.rotateY(this.rotation.y * Transform.deg2Rad);
    this.matView.vscale(this.scale);

    Matrix4.normalMat3(this.matNormal, this.matView.raw);

    Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw);
    Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.raw);
    Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.raw);

    return this.matView.raw;
  }

  //Aktualizacja kierunku
  updateDirection() {
    Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw);
    Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.raw);
    Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.raw);

    return this;
  }

  //Pobranie Macierzy widoku
  getViewMatrix() {
    return this.matView.raw;
  }

  //Resetowanie Transformacji
  reset() {
    this.position.set(0, 0, 0);
    this.scale.set(1, 1, 1);
    this.rotation.set(0, 0, 0);
  }
}

Transform.deg2Rad = Math.PI / 180; // Poza klasą ponieważ nie musimy obliczać z każdym razem
