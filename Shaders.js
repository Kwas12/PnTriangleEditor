class ShaderBuilder {
  constructor(gl, vertShader, fragShader) {
    //Tworzenie shadera w zależności od długości tekstu w nim zawartego. Jeśli dłuższy niż 30 jest to shader do utworzenia z zmiennej.
    if (vertShader.length < 30)
      this.program = ShaderUtil.createShaderProgramFromDom(
        gl,
        vertShader,
        fragShader,
        true
      );
    else
      this.program = ShaderUtil.createProgramFromText(
        gl,
        vertShader,
        fragShader,
        true
      );

    if (this.program != null) {
      this.gl = gl;
      gl.useProgram(this.program);
      this.mUniformList = [];
      this.mTextureList = [];

      this.noCulling = false; //Jeśli jest true zostaje wyłączony culling.
      this.doBlending = false; //Jeśli jest true oblicza dodatkowo kanał alpha.
    }
  }

  //Metody do przygotowania danych takich jak uniformy itp
  //Pobiera argumenty grupuje je po dwie
  prepareUniforms() {
    if (arguments.length % 2 != 0) {
      console.log("przygotowanie uniformów wymaga pary nazwy oraz typu.");
      return this;
    }

    var loc = 0;
    for (var i = 0; i < arguments.length; i += 2) {
      loc = this.gl.getUniformLocation(this.program, arguments[i]);
      if (loc != null)
        this.mUniformList[arguments[i]] = { loc: loc, type: arguments[i + 1] };
    }
    return this;
  }

  //Przygotowanie tekstur Argumenty należy grupować po dwie jak w przykładzie (UniformName,CacheTextureName): "uMask01","tex001";
  prepareTextures() {
    if (arguments.length % 2 != 0) {
      console.log("Błąd: prepareTextures nie ma pary argumentów");
      return this;
    }
    var loc = 0,
      tex = "";
    for (var i = 0; i < arguments.length; i += 2) {
      tex = this.gl.mTextureCache[arguments[i + 1]];
      if (tex === undefined) {
        console.log("Tekstura nieodnaleziona w pamięci " + arguments[i + 1]);
        continue;
      }

      loc = gl.getUniformLocation(this.program, arguments[i]);
      if (loc != null) this.mTextureList.push({ loc: loc, tex: tex });
    }
    return this;
  }

  //Funkcja ustawiająca wartość dla ustawianego uniformu
  setUniforms() {
    if (arguments.length % 2 != 0) {
      console.log("Błąd: setUniforms nie ma pary argumentów.");
      return this;
    }

    var name;
    for (var i = 0; i < arguments.length; i += 2) {
      name = arguments[i];
      if (this.mUniformList[name] === undefined) {
        console.log("Błąd: nie odnaleziono uniformu " + name);
        return this;
      }

      //Zapisanie danych w odpowiednim formacie
      switch (this.mUniformList[name].type) {
        case "2fv":
          this.gl.uniform2fv(
            this.mUniformList[name].loc,
            new Float32Array(arguments[i + 1])
          );
          break;
        case "3fv":
          this.gl.uniform3fv(
            this.mUniformList[name].loc,
            new Float32Array(arguments[i + 1])
          );
          break;
        case "4fv":
          this.gl.uniform4fv(
            this.mUniformList[name].loc,
            new Float32Array(arguments[i + 1])
          );
          break;
        case "mat3":
          this.gl.uniformMatrix3fv(
            this.mUniformList[name].loc,
            false,
            arguments[i + 1]
          );
          break;
        case "mat4":
          this.gl.uniformMatrix4fv(
            this.mUniformList[name].loc,
            false,
            arguments[i + 1]
          );
          break;
        default:
          console.log("nieznany typ uniformu " + name);
          break;
      }
    }

    return this;
  }

  //Aktywacja programu
  activate() {
    this.gl.useProgram(this.program);
    return this;
  }
  //Dezaktywacja programu
  deactivate() {
    this.gl.useProgram(null);
    return this;
  }

  preRender() {
    this.gl.useProgram(this.program); // Aktywacja Programu shadera do renderowania

    //Ustawienie wartości uniformów przed renderowaniem jeśli takie zostały podane
    if (arguments.length > 0) this.setUniforms.apply(this, arguments);

    //Bindowanie tekstur które będą używane
    if (this.mTextureList.length > 0) {
      var texSlot;
      for (var i = 0; i < this.mTextureList.length; i++) {
        texSlot = this.gl["TEXTURE" + i];
        this.gl.activeTexture(texSlot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mTextureList[i].tex);
        this.gl.uniform1i(this.mTextureList[i].loc, i);
      }
    }

    return this;
  }

  //Uchwyt do renderowania modelu
  renderModel(model, doShaderClose) {
    this.setUniforms("uMVMatrix", model.transform.getViewMatrix());
    this.gl.bindVertexArray(model.mesh.vao);

    if (model.mesh.noCulling || this.noCulling)
      this.gl.disable(this.gl.CULL_FACE);
    if (model.mesh.doBlending || this.doBlending) this.gl.enable(this.gl.BLEND);

    //Renderowanie modelu w zależności czy jest indeksowany czy nie
    if (model.mesh.indexCount)
      this.gl.drawElements(
        model.mesh.drawMode,
        model.mesh.indexCount,
        gl.UNSIGNED_SHORT,
        0
      );
    else this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

    //Czyszczenie po renderowaniu
    this.gl.bindVertexArray(null);
    if (model.mesh.noCulling || this.noCulling)
      this.gl.enable(this.gl.CULL_FACE);
    if (model.mesh.doBlending || this.doBlending)
      this.gl.disable(this.gl.BLEND);

    if (doShaderClose) this.gl.useProgram(null);

    return this;
  }
}

//Zbiór funkcji przydatnych przy tworzeniu shadera
class ShaderUtil {
  //Pobranie shadera z pliku html
  static domShaderSrc(elmentID) {
    var element = document.getElementById(elmentID);

    if (!element || element.text == "") {
      console.log(elmentID + " nie można odczytać tekstu.");
      return;
    }

    return element.text;
  }

  //Tworzenie shadera
  static createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    //Pobranie błędu jeśli shader sie nie skompiluje
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Błąd: " + src, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return;
    }

    return shader;
  }

  //Tworzenie programu shadera. Dwa skompilowane shader są używane do stworzenia programu shadera renderującego
  static createProgram(gl, vShader, fShader, doValidate) {
    //Stworzenie Programu shadera
    var programShader = gl.createProgram();
    gl.attachShader(programShader, vShader);
    gl.attachShader(programShader, fShader);

    //Przyczepianie zdefiniowanej z góry lokalizacji fal odpowiednich atrybutów
    gl.bindAttribLocation(programShader, POSITION_LOC, POSITION_NAME);
    gl.bindAttribLocation(programShader, NORMAL_LOC, NORMAL_NAME);
    gl.bindAttribLocation(programShader, UV_LOC, UV_NAME);

    gl.linkProgram(programShader);

    //Sprawdzenie czy udało się połączyć shadery
    if (!gl.getProgramParameter(programShader, gl.LINK_STATUS)) {
      console.error(
        "Błąd: coś poszło nie tak przy tworzeniu shadera.",
        gl.getProgramInfoLog(programShader)
      );
      gl.deleteProgram(programShader);
      return;
    }

    //Dla sprawdzenia
    if (doValidate) {
      gl.validateProgram(programShader);
      if (!gl.getProgramParameter(programShader, gl.VALIDATE_STATUS)) {
        console.error(
          "Błąd: coś poszło nie tak przy sprawdzaniu shadera.",
          gl.getProgramInfoLog(programShader)
        );
        gl.deleteProgram(programShader);
        return;
      }
    }

    //Czyszczenie
    gl.detachShader(programShader, vShader);
    gl.detachShader(programShader, fShader);
    gl.deleteShader(fShader);
    gl.deleteShader(vShader);

    return programShader;
  }

  //Shadera z html
  static createShaderProgramFromDom(gl, vecID, fragID, doValidate) {
    var vShaderTex = ShaderUtil.domShaderSrc(vecID);
    if (!vShaderTex) {
      return null;
    }
    var fShaderTex = ShaderUtil.domShaderSrc(fragID);
    if (!fShaderTex) {
      return null;
    }
    var vShader = ShaderUtil.createShader(gl, vShaderTex, gl.VERTEX_SHADER);
    if (!vShader) {
      return null;
    }
    var fShader = ShaderUtil.createShader(gl, fShaderTex, gl.FRAGMENT_SHADER);
    if (!fShader) {
      gl.deleteShader(vShader);
      return null;
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, true);
  }

  //Shader z zmiennej
  static createProgramFromText(gl, vShaderTxt, fShaderTxt, doValidate) {
    var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
    if (!vShader) return null;
    var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
    if (!fShader) {
      gl.deleteShader(vShader);
      return null;
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, true);
  }

  //Pobiera lokalizację atrybutu.
  static getStandardAttribLocations(gl, program) {
    return {
      position: gl.getAttribLocation(program, POSITION_NAME),
      norm: gl.getAttribLocation(program, NORMAL_NAME),
      uv: gl.getAttribLocation(program, UV_NAME),
    };
  }

  //Pobiera lokalizację uniformu
  static getStandardUniformLocations(gl, program) {
    return {
      perspective: gl.getUniformLocation(program, "uPMatrix"),
      modalMatrix: gl.getUniformLocation(program, "uMVMatrix"),
      cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix"),
      mainTexture: gl.getUniformLocation(program, "uMainTex"),
    };
  }
}
