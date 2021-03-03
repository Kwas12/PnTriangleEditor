//Klasa pętli renderowania
class RenderLoop {
  constructor(callback, fps) {
    var oThis = this;
    this.msLastFrame = null; //Czas w milisekundach od ostatniej klatki
    this.callBack = callback; //Jaka funkcja wywołuje każdą klatkę
    this.isActive = false; //Aktywacja dezaktywacja pętli renderującej
    this.fps = 0;

    if (fps != undefined && fps > 0) {
      //Ustalenie górnego limitu fps
      this.msFpsLimit = 1000 / fps; //Obliczanie ile zajmuje renderowanie jednej klatki

      this.run = function () {
        //Obliczanie czasu delta pomiędzy klatkami i Fps
        var msCurrent = performance.now();
        var msDelta = msCurrent - oThis.msLastFrame;
        var deltaTime = msDelta / 1000.0; //Jak dużo czasu delta jest w sekundzie

        if (msDelta >= oThis.msFpsLimit) {
          //Sprawdzenie czy obliczenie klatki przekroczyło dozwolony czas
          oThis.fps = Math.floor(1 / deltaTime);
          oThis.msLastFrame = msCurrent;
          oThis.callBack(deltaTime);
        }

        if (oThis.isActive) {
          window.requestAnimationFrame(oThis.run);
        }
      };
    } else {
      //Budowanie metody run
      this.run = function () {
        var msCurrent = performance.now();
        var deltaTime = (msCurrent - oThis.msLastFrame) / 1000.0; //Czas generowania jednej klatki podzielony przez sekundę kla uzyskania ilości klatek na sekundę

        oThis.fps = Math.floor(1 / deltaTime);
        oThis.msLastFrame = msCurrent;

        oThis.callBack(deltaTime);

        if (oThis.isActive) {
          window.requestAnimationFrame(oThis.run);
        }
      };
    }
  }

  //Funkcja startująca pętlę
  start() {
    this.isActive = true;
    this.msLastFrame = performance.now();
    window.requestAnimationFrame(this.run);
    return this;
  }

  // Funkcja zatrzymująca pętlę
  stop() {
    this.isActive = false;
  }
}
