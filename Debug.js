//Klasa obsługi lini przedstawiających wektory normalne
class NormalLine {
  constructor(gl) {
    this.transform = new Transform();

    this.gl = gl;
    this.mColor = [];
    this.mVerts = [];
    this.mVertBuffer = 0;
    this.mVertCount = 0;
    this.mVertexComponentLen = 4;
  }

  //Nadanie koloru lini
  addColor() {
    if (arguments.length == 0) return this;

    for (var i = 0, c, p; i < arguments.length; i++) {
      if (arguments[i].length < 6) continue;
      //Sprawdzenie czy został dodany znak # przed numerem koloru w Hex
      c = arguments[i];
      p = c[0] == "#" ? 1 : 0; // Jeśli tak to pomijamy zerowy argument w string podczas wyliczeń

      //Dodanie wyliczonego koloru do tablicy kolorów
      this.mColor.push(
        parseInt(c[p] + c[p + 1], 16) / 255.0,
        parseInt(c[p + 2] + c[p + 3], 16) / 255.0,
        parseInt(c[p + 4] + c[p + 5], 16) / 255.0
      );
    }
    return this;
  }

  //Dodanie lini do tablicy
  addLine(x1, y1, z1, x2, y2, z2, cIndex) {
    this.mVerts.push(x1, y1, z1, cIndex, x2, y2, z2, cIndex);
    this.mVertCount = this.mVerts.length / this.mVertexComponentLen;
    return this;
  }

  //Obliczenie i dodanie Wektorów normalnych dla podanego modelu
  addMeshNormal(cIndex, nLen, mesh) {
    if (mesh.aVert === undefined || mesh.aNorm === undefined) return this;

    var len = mesh.aVert.length,
      n = 0;
    for (var i = 0; i < len; i += mesh.vertexComponentLen) {
      this.mVerts.push(
        mesh.aVert[i],
        mesh.aVert[i + 1],
        mesh.aVert[i + 2],
        cIndex,
        mesh.aVert[i] + mesh.aNorm[n] * nLen,
        mesh.aVert[i + 1] + mesh.aNorm[n + 1] * nLen,
        mesh.aVert[i + 2] + mesh.aNorm[n + 2] * nLen,
        cIndex
      );
      n += 3;
    }

    this.mVertCount = this.mVerts.length / this.mVertexComponentLen;
    return this;
  }

  //Funkcja tworząca shader dla lini
  createShader() {
    //Shader wierzchołków
    var vShader =
      "#version 300 es\n" +
      "layout(location=0) in vec4 a_position;" +
      "uniform mat4 uPMatrix;" +
      "uniform mat4 uCameraMatrix;" +
      "uniform mat4 uMVMatrix;" +
      "uniform vec3 uniformColorArray[6];" +
      "out lowp vec4 color;" +
      "void main(void){" +
      "color = vec4(uniformColorArray[ int(a_position.w) ],1.0);" +
      "gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0);" +
      "}";

    //Shader fragmentów
    var fShader =
      "#version 300 es\n" +
      "precision mediump float;" +
      "in vec4 color;" +
      "out vec4 finalColor;" +
      "void main(void){ finalColor = color; }";

    //........................................
    //Funkcja tworząca shader z tekstu
    this.mShader = ShaderUtil.createProgramFromText(
      this.gl,
      vShader,
      fShader,
      true
    );
    //Pobranie lokalizacji Uniformu koloru
    this.mUniformColor = this.gl.getUniformLocation(
      this.mShader,
      "uniformColorArray"
    );

    this.mUniformProj = this.gl.getUniformLocation(this.mShader, "uPMatrix");
    this.mUniformCamera = this.gl.getUniformLocation(
      this.mShader,
      "uCameraMatrix"
    );
    this.mUniformModelV = this.gl.getUniformLocation(this.mShader, "uMVMatrix");

    //........................................
    //Ustaniecie uniformu koloru dla lini
    this.gl.useProgram(this.mShader);
    this.gl.uniform3fv(this.mUniformColor, new Float32Array(this.mColor));
    this.gl.useProgram(null);
  }

  //Finalizowanie tworzenie shadera prze renderowaniem
  finalize() {
    this.mVertBuffer = this.gl.fCreateArrayBuffer(
      new Float32Array(this.mVerts),
      true
    );
    this.createShader();
    return this;
  }

  render(camera) {
    //Aktualizacja Macierzy transformacji
    this.transform.updateMatrix();

    //Przygotowanie shadera do renderowania
    this.gl.useProgram(this.mShader);

    //Aktualizacja uniformów
    this.gl.uniformMatrix4fv(this.mUniformProj, false, camera.projectionMatrix);
    this.gl.uniformMatrix4fv(this.mUniformCamera, false, camera.viewMatrix);
    this.gl.uniformMatrix4fv(
      this.mUniformModelV,
      false,
      this.transform.getViewMatrix()
    );

    //Dodanie lini do bufora Activate Vertice Buffer Array
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mVertBuffer);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(
      0,
      this.mVertexComponentLen,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    //Funkcja rysująca
    this.gl.drawArrays(this.gl.LINES, 0, this.mVertCount);

    //Czyszczenie po wykonanym renderze renderze
    this.gl.disableVertexAttribArray(0);
    this.gl.useProgram(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
