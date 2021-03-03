const POSITION_NAME = "a_position";
const POSITION_LOC = 0;
const NORMAL_NAME = "a_normal";
const NORMAL_LOC = 1;
const UV_NAME = "a_uv";
const UV_LOC = 2;

//Obiekt GL kontekstu
function GLInstance(canvasID) {
  var canvas = document.getElementById(canvasID);
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    console.error("WebGL context is not available");
    return null;
  }

  // Ustawienie wszystkich domyślnych ustawień
  gl.mMeshCache = []; // zmienna do przechowywania wszystkich danych siatek(mesh).
  gl.mTextureCache = [];

  //Ustawienia gl

  //Dla ułatwienia nie zostało zastosowane renderowanie tyko jednej strony obiektu
  gl.frontFace(gl.CCW);
  gl.enable(gl.DEPTH_TEST); //Renderowanie tych rzeczy które są bliżej kamery za pomocą parametru z
  gl.depthFunc(gl.LEQUAL); // dalsze obiekty są bardziej rozmyte
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //ustawienia jak ma mieszać kanał alpha

  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Ustawienie domyślnego koloru

  //Resetowanie canvasa z ustawionym kolorem tła
  gl.fClear = function () {
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);

    return this;
  };

  gl.fCreateArrayBuffer = function (floatAry, isStatic = true) {
    var staticOption = isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW;

    var buf = this.createBuffer();
    this.bindBuffer(this.ARRAY_BUFFER, buf);
    this.bufferData(this.ARRAY_BUFFER, floatAry, staticOption);
    this.bindBuffer(this.ARRAY_BUFFER, null);
    return buf;
  };

  //Zamiana tablice siatek na buffor GL
  gl.fCreateMeshVAO = function (
    name,
    aryInd,
    aryVert,
    aryNorm,
    aryUV,
    vertLen
  ) {
    var rtn = { drawMode: this.TRIANGLES };

    //Stworzenie oraz powiązanie z VAO
    rtn.vao = this.createVertexArray();
    this.bindVertexArray(rtn.vao); //Powiązanie zapisuje w VAO

    //Ustawienie wierzchołków
    if (aryVert !== undefined && aryVert != null) {
      rtn.bufVertices = this.createBuffer(); //Tworzenie bufora
      rtn.vertexComponentLen = vertLen || 3; //Jak dużo zmiennych tworzy wierzchołek
      rtn.vertexCount = aryVert.length / rtn.vertexComponentLen; //Ile wierzchołków jest w tablicy

      this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(aryVert),
        this.STATIC_DRAW
      ); // Dodanie tablicy do bufora
      this.enableVertexAttribArray(POSITION_LOC); //Włączanie lokalizacji
      this.vertexAttribPointer(
        POSITION_LOC,
        rtn.vertexComponentLen,
        this.FLOAT,
        false,
        0,
        0
      ); //Dodanie bufora lokalizacji do VAO
    }

    //Ustawienie normalnych
    if (aryNorm !== undefined && aryNorm != null) {
      rtn.bufNormals = this.createBuffer();

      this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(aryNorm),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(NORMAL_LOC);
      this.vertexAttribPointer(NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
    }
    // Ustawienie pozycji UV
    if (aryUV !== undefined && aryUV != null) {
      rtn.bufUV = this.createBuffer();
      this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(aryUV),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(UV_LOC);
      this.vertexAttribPointer(UV_LOC, 2, this.FLOAT, false, 0, 0); //UV wymaga tylko dwóch zmiennych na wierzchołek
    }

    //Ustawienie Index
    if (aryInd !== undefined && aryInd != null) {
      rtn.bufIndex = this.createBuffer();
      rtn.indexCount = aryInd.length;

      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
      this.bufferData(
        this.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(aryInd),
        this.STATIC_DRAW
      );
    }

    //Czyszczenie
    this.bindVertexArray(null);
    this.bindBuffer(this.ARRAY_BUFFER, null);

    if (aryInd != null && aryInd !== undefined) {
      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
    }

    this.mMeshCache[name] = rtn;
    return rtn;
  };

  //Funkcja ładująca Tekstury do skymap. Tablica imgAry musi przechowywać 6 zdjęć
  gl.fLoadCubeMap = function (name, imgAry) {
    if (imgAry.length != 6) {
      return null;
    }

    var tex = this.createTexture();
    this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

    //Dodawanie tekstur do mapy kostki
    for (var i = 0; i < 6; i++) {
      this.texImage2D(
        this.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0,
        this.RGBA,
        this.RGBA,
        this.UNSIGNED_BYTE,
        imgAry[i]
      );
    }

    this.texParameteri(
      this.TEXTURE_CUBE_MAP,
      this.TEXTURE_MAG_FILTER, // Ustawienie skalowania tekstury w górę
      this.LINEAR
    );
    this.texParameteri(
      this.TEXTURE_CUBE_MAP,
      this.TEXTURE_MIN_FILTER, // Ustawienie skalowania tekstury w dół
      this.LINEAR
    );
    this.texParameteri(
      this.TEXTURE_CUBE_MAP,
      this.TEXTURE_WRAP_S, // Rozciąganie tekstury w osi x
      this.CLAMP_TO_EDGE
    );
    this.texParameteri(
      this.TEXTURE_CUBE_MAP,
      this.TEXTURE_WRAP_T, // Rozciąganie tekstury w osi y
      this.CLAMP_TO_EDGE
    );
    this.texParameteri(
      this.TEXTURE_CUBE_MAP,
      this.TEXTURE_WRAP_R, // Rozciąganie tekstury w osi z
      this.CLAMP_TO_EDGE
    );

    this.bindTexture(this.TEXTURE_CUBE_MAP, null);
    this.mTextureCache[name] = tex;
    return tex;
  };

  //Metoda do ustawienia wielkości canvasa  oraz obszaru renderu
  gl.fSetSize = function (w, h) {
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.canvas.width = w;
    this.canvas.height = h;

    //Po ustawieniu rozmiaru canvasa należy zresetować widok

    this.viewport(0, 0, w, h);
    return this;
  };

  //Funkcja do ustawiania szerokości oraz wysokości canvasa
  gl.fFitScreen = function (wp, hp) {
    return this.fSetSize(
      window.innerWidth * (wp || 1),
      window.innerHeight * (hp || 1)
    );
  };

  return gl;
}
