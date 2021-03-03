//Klasa skyMapy
class SkyMap {
  constructor(gl, w, h, d) {
    this.gl = gl;
    this.mDayTex = -1;
    this.mNightTex = -1;
    this.mTime = 0.0;
    this.createMesh(w || 20, h || 20, d || 20);
  }

  //Ustawienie blendowania grup tekstur
  setTime(t) {
    this.mTime = t;
    return this;
  }

  //Ustawienie tekstur dla dnia
  setDayTex() {
    if (arguments.length == 6) {
      this.mDayTex = gl.fLoadCubeMap("SkyMap_Day", arguments);
    }
    return this;
  }

  //Pobranie tekstur z DOM
  setDayTexByDom() {
    if (arguments.length != 6) {
      console.log("Tekstury nieba muszą byc w ilości = 6");
      return this;
    }

    var ary = [];
    for (var i = 0; i < 6; i++) {
      ary.push(document.getElementById(arguments[i]));
    }

    this.mDayTex = gl.fLoadCubeMap("SkyMap_Day", ary);
    return this;
  }

  //Ustawienie tekstur dla nocy
  setNightTex() {
    if (arguments.length == 6) {
      this.mNightTex = gl.fLoadCubeMap("SkyMap_Night", arguments);
    }
    return this;
  }

  //Pobranie tekstur dla nocy z DOM
  setNightTexByDom() {
    if (arguments.length != 6) {
      console.log("Tekstury nieba muszą byc w ilości = 6");
      return this;
    }

    var ary = [];
    for (var i = 0; i < 6; i++) {
      ary.push(document.getElementById(arguments[i]));
    }

    this.mNightTex = gl.fLoadCubeMap("SkyMap_Night", ary);
    return this;
  }

  //Przygotowanie shadera do renderownia
  finalize() {
    this.createShader();
    return this;
  }

  //Funkcja Renderująca
  render(camera) {
    //Ustawienie programu do renderowania
    this.gl.useProgram(this.mShader);
    this.gl.bindVertexArray(this.mesh.vao);

    //Ustawienie Uniformów
    this.gl.uniformMatrix4fv(this.mUniProj, false, camera.projectionMatrix);
    this.gl.uniformMatrix4fv(this.mUniCamera, false, camera.viewMatrix);

    //Ustawienie tekstur dnia w buforze
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.mDayTex);
    this.gl.uniform1i(this.mUniDayTex, 0);

    this.gl.uniform1f(this.mUniTime, this.mTime);

    //Ustawienie tekstur nocy w bufforze
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.mNightTex);
    this.gl.uniform1i(this.mUniNightTex, 1);

    //Renderowanie skyMap
    this.gl.drawElements(
      this.mesh.drawMode,
      this.mesh.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );

    //Czyszczenie po wykonaniu rendera
    this.gl.bindVertexArray(null);
    this.gl.useProgram(null);
  }

  //Funkcja tworząca shader
  createShader() {
    //Shader wierzchołków
    var vShader =
      "#version 300 es\n" +
      "layout(location=0) in vec3 a_position;" +
      "uniform mat4 uPMatrix;" +
      "uniform mat4 uCameraMatrix;" +
      "out highp vec3 texCoord;" +
      "void main(void){" +
      "texCoord = a_position.xyz;" +
      "gl_Position = uPMatrix * uCameraMatrix * vec4(a_position.xyz, 1.0);" +
      "}";

    //Shader fragmentów
    var fShader =
      "#version 300 es\n" +
      "precision mediump float;" +
      "out vec4 finalColor;" +
      "in highp vec3 texCoord;" +
      "uniform samplerCube uDayTex;";

    //Jeśli nie zostały załadowane tekstury dla nocy to shader wykorzystuje tylko tekstury z dnia
    if (this.mNightTex == -1) {
      fShader += "void main(void){ finalColor = texture(uDayTex, texCoord";
    } else {
      // Jeśli zostały załadowane tekstury blendują się po ustawieniu uTime
      fShader +=
        "uniform samplerCube uNightTex; uniform float uTime;" +
        "void main(void){finalColor = mix(texture(uDayTex,texCoord), texture(uNightTex, texCoord),uTime);}";
    }

    //Tworzenie programu z tekstu
    this.mShader = ShaderUtil.createProgramFromText(
      this.gl,
      vShader,
      fShader,
      true
    );
    this.mUniProj = this.gl.getUniformLocation(this.mShader, "uPMatrix");
    this.mUniCamera = this.gl.getUniformLocation(this.mShader, "uCameraMatrix");
    this.mUniDayTex = this.gl.getUniformLocation(this.mShader, "uDayTex");

    if (this.nNightTex != -1) {
      this.mUniNightTex = this.gl.getUniformLocation(this.mShader, "uNightTex");
      this.mUniTime = this.gl.getUniformLocation(this.mShader, "uTime");
    }
  }

  //Tworzenie modelu boksa na który będzie nałożona tekstura
  createMesh(width, height, depth) {
    var w = width * 0.5,
      h = height * 0.5,
      d = depth * 0.5;
    var x0 = -w,
      x1 = w,
      y0 = -h,
      y1 = h,
      z0 = -d,
      z1 = d;

    var aVert = [
      x0,
      y1,
      z1,
      x0,
      y0,
      z1,
      x1,
      y0,
      z1,
      x1,
      y1,
      z1,
      x1,
      y1,
      z0,
      x1,
      y0,
      z0,
      x0,
      y0,
      z0,
      x0,
      y1,
      z0,
      x0,
      y1,
      z0,
      x0,
      y0,
      z0,
      x0,
      y0,
      z1,
      x0,
      y1,
      z1,
      x0,
      y0,
      z1,
      x0,
      y0,
      z0,
      x1,
      y0,
      z0,
      x1,
      y0,
      z1,
      x1,
      y1,
      z1,
      x1,
      y0,
      z1,
      x1,
      y0,
      z0,
      x1,
      y1,
      z0,
      x0,
      y1,
      z0,
      x0,
      y1,
      z1,
      x1,
      y1,
      z1,
      x1,
      y1,
      z0,
    ];

    var aIndex = [];
    for (var i = 0; i < aVert.length / 3; i += 2)
      aIndex.push(Math.floor(i / 4) * 4 + ((i + 2) % 4), i + 1, i);

    //Tworzenie modelu boksa
    this.mesh = this.gl.fCreateMeshVAO("SkymapCube", aIndex, aVert, null, null);
  }
}
