//Klasa przechowująca dane modelu oraz jego transformacje  model
class Modal {
  constructor(meshData) {
    this.transform = new Transform();
    this.mesh = meshData;
  }

  //Ustawienie skali dla modelu
  setScale(x, y, z) {
    this.transform.scale.set(x, y, z);
    return this;
  }

  //Ustalenie pozycji dla modelu
  setPosition(x, y, z) {
    this.transform.position.set(x, y, z);
    return this;
  }

  //Ustawienie rotacji dla modelu
  setRotation(x, y, z) {
    this.transform.rotation.set(x, y, z);
    return this;
  }

  //Dodanie wartości do skali
  addScale(x, y, z) {
    this.transform.scale.x += x;
    this.transform.scale.y += y;
    this.transform.scale.z += z;
    return this;
  }

  //Dodanie wartości do pozycji
  addPosition(x, y, z) {
    this.transform.position.x += x;
    this.transform.position.y += y;
    this.transform.position.z += z;

    return this;
  }

  //Dodanie wartości do rotacji
  addRotation(x, y, z) {
    this.transform.rotation.x += x;
    this.transform.rotation.y += y;
    this.transform.rotation.z += z;

    return this;
  }

  //Przygotowanie do renderu
  preRender() {
    this.transform.updateMatrix();
    return this;
  }
}
