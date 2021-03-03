class pnTriangles {
  constructor() {
    this.pnTrianglesMesh = [];
  }

  //funkcja odpowiedzialna za stworzenie trójkąta pn wraz z podmiana już istniejącego lub utworzeniem nowego w zależności od parametru numberOfPlane
  createModel(gl, keepRawData, pnVert, pnNorm, numberOfPlane = -1) {
    const { mesh, pnVert: Vertex, pnNorm: Normal } = this.createMesh({
      gl,
      keepRawData,
      pnVert,
      pnNorm,
    });

    const meshPN = new Modal(mesh);

    //zamiana istniejącego trójkąta pn nowo obliczonym
    if (numberOfPlane > -1) {
      this.pnTrianglesMesh[numberOfPlane] = {
        meshPN,
        Vertex,
        Normal,
      };
    } else {
      //dodanie nowo obliczonego trójkąta do tablicy
      this.pnTrianglesMesh[this.pnTrianglesMesh.length] = {
        meshPN,
        Vertex,
        Normal,
      };
    }
  }

  //usunięcie trójkąta polegające na zdjęcie ostatniego trójkąta z tablicy
  deleteLastModel() {
    this.pnTrianglesMesh.pop();
  }

  //Funkcja tworząca punkty kontrolne według wzoru
  createPnTrianglesControlPoints(pnVert, pnNorm) {
    let pnpnVert = [];
    let pnControlPoints = [];
    let pnControlPointsNormal = [];

    //obliczanie punktów kontrolnych
    let b300x = pnVert[0],
      b300y = pnVert[1],
      b300z = pnVert[2],
      b030x = pnVert[3],
      b030y = pnVert[4],
      b030z = pnVert[5],
      b003x = pnVert[6],
      b003y = pnVert[7],
      b003z = pnVert[8];

    let b012x =
      (2 * b003x + b030x - (b030x - b003x) * pnNorm[6] * pnNorm[6]) / 3;
    let b012y =
      (2 * b003y + b030y - (b030y - b003y) * pnNorm[7] * pnNorm[7]) / 3;
    let b012z =
      (2 * b003z + b030z - (b030z - b003z) * pnNorm[8] * pnNorm[8]) / 3;

    let b102x =
      (2 * b003x + b300x - (b300x - b003x) * pnNorm[6] * pnNorm[6]) / 3;
    let b102y =
      (2 * b003y + b300y - (b300y - b003y) * pnNorm[7] * pnNorm[7]) / 3;
    let b102z =
      (2 * b003z + b300z - (b300z - b003z) * pnNorm[8] * pnNorm[8]) / 3;

    let b120x =
      (2 * b030x + b300x - (b300x - b030x) * pnNorm[3] * pnNorm[3]) / 3;
    let b120y =
      (2 * b030y + b300y - (b300y - b030y) * pnNorm[4] * pnNorm[4]) / 3;
    let b120z =
      (2 * b030z + b300z - (b300z - b030z) * pnNorm[5] * pnNorm[5]) / 3;

    let b021x =
      (2 * b030x + b003x - (b003x - b030x) * pnNorm[3] * pnNorm[3]) / 3;
    let b021y =
      (2 * b030y + b003y - (b003y - b030y) * pnNorm[4] * pnNorm[4]) / 3;
    let b021z =
      (2 * b030z + b003z - (b003z - b030z) * pnNorm[5] * pnNorm[5]) / 3;

    let b201x =
      (2 * b300x + b003x - (b003x - b300x) * pnNorm[0] * pnNorm[0]) / 3;
    let b201y =
      (2 * b300y + b003y - (b003y - b300y) * pnNorm[1] * pnNorm[1]) / 3;
    let b201z =
      (2 * b300z + b003z - (b003z - b300z) * pnNorm[2] * pnNorm[2]) / 3;

    let b210x =
      (2 * b300x + b030x - (b030x - b300x) * pnNorm[0] * pnNorm[0]) / 3;
    let b210y =
      (2 * b300y + b030y - (b030y - b300y) * pnNorm[1] * pnNorm[1]) / 3;
    let b210z =
      (2 * b300z + b030z - (b030z - b300z) * pnNorm[2] * pnNorm[2]) / 3;

    let Ex = (b012x + b102x + b120x + b021x + b201x + b210x) / 6;
    let Vx = (b300x + b030x + b003x) / 3;
    let Ey = (b012y + b102y + b120y + b021y + b201y + b210y) / 6;
    let Vy = (b300y + b030y + b003y) / 3;
    let Ez = (b012z + b102z + b120z + b021z + b201z + b210z) / 6;
    let Vz = (b300z + b030z + b003z) / 3;

    let b111x = Ex + (Ex - Vx) / 2;
    let b111y = Ey + (Ey - Vy) / 2;
    let b111z = Ez + (Ez - Vz) / 2;

    //tworzenie modelu do podglądu
    pnpnVert.push(
      b201x,
      b201y,
      b201z,
      b300x,
      b300y,
      b300z,
      b210x,
      b210y,
      b210z,

      b102x,
      b102y,
      b102z,
      b201x,
      b201y,
      b201z,
      b111x,
      b111y,
      b111z,

      b111x,
      b111y,
      b111z,
      b201x,
      b201y,
      b201z,
      b210x,
      b210y,
      b210z,

      b111x,
      b111y,
      b111z,
      b210x,
      b210y,
      b210z,
      b120x,
      b120y,
      b120z,

      b003x,
      b003y,
      b003z,
      b102x,
      b102y,
      b102z,
      b012x,
      b012y,
      b012z,

      b012x,
      b012y,
      b012z,
      b102x,
      b102y,
      b102z,
      b111x,
      b111y,
      b111z,

      b012x,
      b012y,
      b012z,
      b111x,
      b111y,
      b111z,
      b021x,
      b021y,
      b021z,

      b021x,
      b021y,
      b021z,
      b111x,
      b111y,
      b111z,
      b120x,
      b120y,
      b120z,

      b021x,
      b021y,
      b021z,
      b120x,
      b120y,
      b120z,

      b030x,
      b030y,
      b030z
    );

    //Punkty Kontrolne dla wektorów normalnych

    let n200x = pnNorm[0];
    let n200y = pnNorm[1];
    let n200z = pnNorm[2];

    let n020x = pnNorm[3];
    let n020y = pnNorm[4];
    let n020z = pnNorm[5];

    let n002x = pnNorm[6];
    let n002y = pnNorm[7];
    let n002z = pnNorm[8];

    let n110x;
    let n110y;
    let n110z;

    let n011x;
    let n011y;
    let n011z;

    let n101x;
    let n101y;
    let n101z;

    if (pnVert[3] - pnVert[0] === 0) {
      n110x = n200x + n020x;
    } else {
      n110x =
        n200x +
        n020x -
        ((2 * ((pnVert[3] - pnVert[0]) * (n200x + n020x))) /
          ((pnVert[3] - pnVert[0]) * (pnVert[3] - pnVert[0]))) *
          (pnVert[3] - pnVert[0]);
    }

    if (pnVert[4] - pnVert[1] === 0) {
      n110y = n200y + n020y;
    } else {
      n110y =
        n200y +
        n020y -
        ((2 * ((pnVert[4] - pnVert[1]) * (n200y + n020y))) /
          ((pnVert[4] - pnVert[1]) * (pnVert[4] - pnVert[1]))) *
          (pnVert[4] - pnVert[1]);
    }

    if (pnVert[5] - pnVert[2] === 0) {
      n110z = n200z + n020z;
    } else {
      n110z =
        n200z +
        n020z -
        ((2 * ((pnVert[5] - pnVert[2]) * (n200z + n020z))) /
          ((pnVert[5] - pnVert[2]) * (pnVert[5] - pnVert[2]))) *
          (pnVert[5] - pnVert[2]);
    }

    if (pnVert[6] - pnVert[3] === 0) {
      n011x = n020x + n002x;
    } else {
      n011x =
        n020x +
        n002x -
        ((2 * ((pnVert[6] - pnVert[3]) * (n020x + n002x))) /
          ((pnVert[6] - pnVert[3]) * (pnVert[6] - pnVert[3]))) *
          (pnVert[6] - pnVert[3]);
    }
    if (pnVert[7] - pnVert[4] === 0) {
      n011y = n020y + n002y;
    } else {
      n011y =
        n020y +
        n002y -
        ((2 * ((pnVert[7] - pnVert[4]) * (n020y + n002y))) /
          ((pnVert[7] - pnVert[4]) * (pnVert[7] - pnVert[4]))) *
          (pnVert[7] - pnVert[4]);
    }

    if (pnVert[8] - pnVert[5] === 0) {
      n011z = n020z + n002z;
    } else {
      n011z =
        n020z +
        n002z -
        ((2 * ((pnVert[8] - pnVert[5]) * (n020z + n002z))) /
          ((pnVert[8] - pnVert[5]) * (pnVert[8] - pnVert[5]))) *
          (pnVert[8] - pnVert[5]);
    }

    if (pnVert[0] - pnVert[6] === 0) {
      n101x = n002x + n200x;
    } else {
      n101x =
        n002x +
        n200x -
        ((2 * ((pnVert[0] - pnVert[6]) * (n002x + n200x))) /
          ((pnVert[0] - pnVert[6]) * (pnVert[0] - pnVert[6]))) *
          (pnVert[0] - pnVert[6]);
    }

    if (pnVert[1] - pnVert[7] === 0) {
      n101y = n002y + n200y;
    } else {
      n101y =
        n002y +
        n200y -
        ((2 * ((pnVert[1] - pnVert[7]) * (n002y + n200y))) /
          ((pnVert[1] - pnVert[7]) * (pnVert[1] - pnVert[7]))) *
          (pnVert[1] - pnVert[7]);
    }

    if (pnVert[2] - pnVert[8] === 0) {
      n101z = n002z + n200z;
    } else {
      n101z =
        n002z +
        n200z -
        ((2 * ((pnVert[2] - pnVert[8]) * (n002z + n200z))) /
          ((pnVert[2] - pnVert[8]) * (pnVert[2] - pnVert[8]))) *
          (pnVert[2] - pnVert[8]);
    }

    pnControlPointsNormal.push(
      n200x,
      n200y,
      n200z,

      n020x,
      n020y,
      n020z,

      n002x,
      n002y,
      n002z,

      n110x,
      n110y,
      n110z,

      n011x,
      n011y,
      n011z,

      n101x,
      n101y,
      n101z
    );

    //Normalizacja obliczonych normalnych
    pnControlPointsNormal = [
      ...this.normalizeNormalVector(pnControlPointsNormal),
    ];

    //zapisanie punktów kontrolnych
    pnControlPoints.push(
      b300x,
      b300y,
      b300z,

      b030x,
      b030y,
      b030z,

      b003x,
      b003y,
      b003z,

      b012x,
      b012y,
      b012z,

      b102x,
      b102y,
      b102z,

      b120x,
      b120y,
      b120z,

      b021x,
      b021y,
      b021z,

      b201x,
      b201y,
      b201z,

      b210x,
      b210y,
      b210z,

      b111x,
      b111y,
      b111z
    );

    return [
      //wygenerowany model do podglądu punktów kontrolnych
      gl.fCreateMeshVAO("PnControl point", null, pnpnVert, null, null, 3),
      //Punkty kontrolne
      pnControlPoints,
      pnControlPointsNormal,
    ];
  }

  //Funkcjai
  normalizeNormalVector(pnNorm) {
    let newNormals = [];
    for (let i = 0; i < pnNorm.length; i += 3) {
      let newNormal = new Vector3(pnNorm[i], pnNorm[i + 1], pnNorm[i + 2]);
      newNormals.push(...newNormal.normalize().getArray());
    }

    return newNormals;
  }

  //funkcja tworząca cały trójkąt PN
  createMesh({ gl, keepRawData, pnVert, pnNorm }) {
    let points = [];

    //Normalizowanie wektorów normalnych
    pnNorm = this.normalizeNormalVector(pnNorm);

    //obliczenie punktów kontrolnych
    let returned = this.createPnTrianglesControlPoints(pnVert, pnNorm);
    let mesh = returned[0];
    let checkPoints = returned[1];
    let checkPointsNormal = returned[2];

    //tworzenie wektora trójwymiarowego do obliczenie tesselacji nowej powierzchni
    let a = new Vector3(pnVert[0], pnVert[1], pnVert[2]);
    let b = new Vector3(pnVert[3], pnVert[4], pnVert[5]);
    let c = new Vector3(pnVert[6], pnVert[7], pnVert[8]);

    //pobranie wartości tesselacji
    let multi = Number(document.getElementById("tesselation").value);

    //funkcja tworząca punkty oraz zapisująca je w zmiennej points
    this.tessellation(a, b, c, multi, points);

    //obliczenie pozycji wierzchołków oraz wektorów normalnych dla wszystkich punktów w nowej płaszczyźnie
    let [pnSurfacePoint, newNormalToPnSurface] = this.calculatePNSurfaces(
      points,
      checkPoints,
      checkPointsNormal,
      pnVert
    );

    //utworzenie modelu z obliczonych wierzchołków
    mesh = gl.fCreateMeshVAO(
      "PnSurface",
      null,
      pnSurfacePoint,
      newNormalToPnSurface,
      null,
      3
    );

    //ustawienie rysowanie na trójkąty
    mesh.drawMode = gl.TRIANGLES;

    //zapisanie pozycji trójkąta początkowego do generowania lini pokazujących wektory normalne podstawowego trójkąta
    if (keepRawData) {
      mesh.aVert = pnVert;
      mesh.aNorm = pnNorm;
    }

    return { mesh, pnVert, pnNorm };
  }

  //funkcja obliczająca pozycję dla każdego nowego punktu z tesselowanego trójkąta
  calculatePNSurfaces(surfacePoints, checkPoints, checkPointsNormal, pnVert) {
    //nowo obliczone współrzędne punktów
    let newPointsToPnSurface = [];
    let newNormalToPnSurface = [];

    //pętla przemieszczająca się co 3 pozycje w dostarczonej tablicy z nowymi punktami
    for (let i = 0; i < surfacePoints.length; i += 3) {
      let x = surfacePoints[i];
      let y = surfacePoints[i + 1];
      let z = surfacePoints[i + 2];

      //obliczanie współrzędnych barycentrycznych
      let barycentricPositionReturn = this.barycentricPosition(
        pnVert,
        new Vector3(x, y, z)
      );

      //przypisanie współrzędnych barycentrycznych do zmiennych u, v
      let u = barycentricPositionReturn[0];
      let v = barycentricPositionReturn[1];

      //generowanie współrzędnych nowych punktów oraz przypisanie ich do zmiennej
      let [sumX, sumY, sumZ, normalizeNormal] = this.calculateNewPNPoint(
        u,
        v,
        checkPoints,
        checkPointsNormal
      );

      newPointsToPnSurface.push(sumX, sumY, sumZ);
      newNormalToPnSurface.push(...normalizeNormal);
    }

    return [newPointsToPnSurface, newNormalToPnSurface];
  }

  //funkcja obliczająca według wzoru oraz współrzędnych barycentrycznych nowe współrzędne obliczanego punktu
  calculateNewPNPoint(u, v, checkPoints, checkPointsNormal) {
    let sumX = 0,
      sumY = 0,
      sumZ = 0;
    let w = 1 - u - v;

    //dla i=3
    sumX += Math.pow(w, 3) * checkPoints[0];
    sumY += Math.pow(w, 3) * checkPoints[1];
    sumZ += Math.pow(w, 3) * checkPoints[2];
    //dla j=3
    sumX += Math.pow(u, 3) * checkPoints[3];
    sumY += Math.pow(u, 3) * checkPoints[4];
    sumZ += Math.pow(u, 3) * checkPoints[5];
    //dla k=3
    sumX += Math.pow(v, 3) * checkPoints[6];
    sumY += Math.pow(v, 3) * checkPoints[7];
    sumZ += Math.pow(v, 3) * checkPoints[8];
    //dla i=0,j=1,k=2
    sumX += 3 * u * Math.pow(v, 2) * checkPoints[9];
    sumY += 3 * u * Math.pow(v, 2) * checkPoints[10];
    sumZ += 3 * u * Math.pow(v, 2) * checkPoints[11];
    //dla i=1,j=0,k=2
    sumX += 3 * w * Math.pow(v, 2) * checkPoints[12];
    sumY += 3 * w * Math.pow(v, 2) * checkPoints[13];
    sumZ += 3 * w * Math.pow(v, 2) * checkPoints[14];
    //dla i=1,j=2,k=0
    sumX += 3 * w * Math.pow(u, 2) * checkPoints[15];
    sumY += 3 * w * Math.pow(u, 2) * checkPoints[16];
    sumZ += 3 * w * Math.pow(u, 2) * checkPoints[17];
    //dla i=0,j=2,k=1
    sumX += 3 * v * Math.pow(u, 2) * checkPoints[18];
    sumY += 3 * v * Math.pow(u, 2) * checkPoints[19];
    sumZ += 3 * v * Math.pow(u, 2) * checkPoints[20];
    //dla i=2,j=0,k=1
    sumX += 3 * v * Math.pow(w, 2) * checkPoints[21];
    sumY += 3 * v * Math.pow(w, 2) * checkPoints[22];
    sumZ += 3 * v * Math.pow(w, 2) * checkPoints[23];
    //dla i=2,j=1,k=0
    sumX += 3 * u * Math.pow(w, 2) * checkPoints[24];
    sumY += 3 * u * Math.pow(w, 2) * checkPoints[25];
    sumZ += 3 * u * Math.pow(w, 2) * checkPoints[26];
    //dla i=1,j=1,k=1
    sumX += 6 * w * u * v * checkPoints[27];
    sumY += 6 * w * u * v * checkPoints[28];
    sumZ += 6 * w * u * v * checkPoints[29];

    //Obliczanie Wektorów normalnych

    let normX =
      Math.pow(w, 2) * checkPointsNormal[0] +
      Math.pow(u, 2) * checkPointsNormal[3] +
      Math.pow(v, 2) * checkPointsNormal[6] +
      w * u * checkPointsNormal[9] +
      w * v * checkPointsNormal[12] +
      u * v * checkPointsNormal[15];

    let normY =
      Math.pow(w, 2) * checkPointsNormal[1] +
      Math.pow(u, 2) * checkPointsNormal[4] +
      Math.pow(v, 2) * checkPointsNormal[7] +
      w * u * checkPointsNormal[10] +
      w * v * checkPointsNormal[13] +
      u * v * checkPointsNormal[16];

    let normZ =
      Math.pow(w, 2) * checkPointsNormal[2] +
      Math.pow(u, 2) * checkPointsNormal[5] +
      Math.pow(v, 2) * checkPointsNormal[8] +
      w * u * checkPointsNormal[11] +
      w * v * checkPointsNormal[14] +
      u * v * checkPointsNormal[17];

    let normals = [normX, normY, normZ];

    let normalizeNormal = this.normalizeNormalVector(normals);

    return [sumX, sumY, sumZ, normalizeNormal];
  }

  //funkcja zapasująca współrzędne punktów dla trójkąta
  triangle(a, b, c, points) {
    points.push(...a.getArray(), ...b.getArray(), ...c.getArray());
  }

  //funkcja wykonująca tesselację
  tessellation(a, b, c, count, points) {
    if (count === 0) {
      //wykorzystanie funkcji zapisującej współrzędne wierzchołków trójkąta
      this.triangle(a, b, c, points);
    } else {
      //obliczanie sierotka dla współrzędnych wierzchołków
      let ab = a.mix(b, 0.5);
      let ac = a.mix(c, 0.5);
      let bc = b.mix(c, 0.5);

      --count;

      //Wykorzystanie funkcji rekurencyjnej do tworzenia odpowiedniej ilości tesselacji
      this.tessellation(a, ab, ac, count, points);
      this.tessellation(c, ac, bc, count, points);
      this.tessellation(b, bc, ab, count, points);
      this.tessellation(ac, bc, ab, count, points);
    }
  }
  //obliczanie współrzędnych barycentrycznych, zwraca tablice z (u i v) [u,v];
  barycentricPosition(calculateTriangle, calculatePoint) {
    let u, v;
    let triangleCAPArea, triangleABPArea, triangleABCArea;
    //Punkty trójkąta
    let trianglePoint1 = new Vector3(
      calculateTriangle[0],
      calculateTriangle[1],
      calculateTriangle[2]
    );
    let trianglePoint2 = new Vector3(
      calculateTriangle[3],
      calculateTriangle[4],
      calculateTriangle[5]
    );
    let trianglePoint3 = new Vector3(
      calculateTriangle[6],
      calculateTriangle[7],
      calculateTriangle[8]
    );

    // obliczanie powierzchni poszczególnych pul dla obliczeń

    triangleABCArea = this.calculateArea(
      trianglePoint1,
      trianglePoint2,
      trianglePoint3
    );

    triangleCAPArea = this.calculateArea(
      trianglePoint3,
      trianglePoint1,
      calculatePoint
    );

    triangleABPArea = this.calculateArea(
      trianglePoint1,
      trianglePoint2,
      calculatePoint
    );

    //obliczanie współrzędnych barycentrycznych
    u = triangleCAPArea / triangleABCArea;

    v = triangleABPArea / triangleABCArea;

    return [u, v];
  }

  //obliczanie długości boku
  calculateSide(point1, point2) {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2) +
        Math.pow(point1.z - point2.z, 2)
    );
  }

  //obliczanie pola powierzchni zadanego trójkąta
  calculateArea(point1, point2, point3) {
    let a = Number(this.calculateSide(point1, point2).toFixed(5));
    let b = Number(this.calculateSide(point1, point3).toFixed(5));
    let c = Number(this.calculateSide(point2, point3).toFixed(5));

    let s = Number(((a + b + c) / 2).toFixed(5));

    // obcięcie do 5 miejsc po przecinku ponieważ występował błąd w obliczeniach (pierwiastek z ujemnej liczby)
    if (s <= a || s <= b || s <= c) {
      return 0;
    } else {
      let Area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return Area;
    }
  }
}

//funkcja ustawiająca wszystkie zmienne do input w zależności od wybranego trójkąta
function setValueToInterface() {
  const numberOfPlane =
    Number(document.getElementById("plane-number").value) - 1;

  document.getElementById("position-first-x").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[0];
  document.getElementById("position-first-y").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[1];
  document.getElementById("position-first-z").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[2];

  document.getElementById("position-second-x").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[3];
  document.getElementById("position-second-y").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[4];
  document.getElementById("position-second-z").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[5];

  document.getElementById("position-third-x").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[6];
  document.getElementById("position-third-y").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[7];
  document.getElementById("position-third-z").value =
    Pn.pnTrianglesMesh[numberOfPlane].Vertex[8];

  document.getElementById("normal-first-x").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[0];
  document.getElementById("normal-first-y").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[1];
  document.getElementById("normal-first-z").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[2];

  document.getElementById("normal-second-x").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[3];
  document.getElementById("normal-second-y").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[4];
  document.getElementById("normal-second-z").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[5];

  document.getElementById("normal-third-x").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[6];
  document.getElementById("normal-third-y").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[7];
  document.getElementById("normal-third-z").value =
    Pn.pnTrianglesMesh[numberOfPlane].Normal[8];
}

//aktualizacja lini normalnych
function updateNormalLine() {
  mDebugLine = new NormalLine(gl);

  //obliczanie nowych lini pokazujących wektory normalne dla każdego trójkąta pn
  for (let i = 0; i < Pn.pnTrianglesMesh.length; i++) {
    mDebugLine
      .addColor("#00FF00")
      .addMeshNormal(0, 0.3, Pn.pnTrianglesMesh[i].meshPN.mesh)
      .finalize();
  }
}

//zmiana współrzędnych punktów wybranym trójkącie
function changePointsValue() {
  if (!(Pn == null) || !(Pn == undefined)) {
    const numberOfPlane = document.getElementById("plane-number").value;

    if (numberOfPlane - 1 < Pn.pnTrianglesMesh.length) {
      let vertex = [];
      let normal = [];

      vertex.push(Number(document.getElementById("position-first-x").value));
      vertex.push(Number(document.getElementById("position-first-y").value));
      vertex.push(Number(document.getElementById("position-first-z").value));

      vertex.push(Number(document.getElementById("position-second-x").value));
      vertex.push(Number(document.getElementById("position-second-y").value));
      vertex.push(Number(document.getElementById("position-second-z").value));

      vertex.push(Number(document.getElementById("position-third-x").value));
      vertex.push(Number(document.getElementById("position-third-y").value));
      vertex.push(Number(document.getElementById("position-third-z").value));

      normal.push(Number(document.getElementById("normal-first-x").value));
      normal.push(Number(document.getElementById("normal-first-y").value));
      normal.push(Number(document.getElementById("normal-first-z").value));

      normal.push(Number(document.getElementById("normal-second-x").value));
      normal.push(Number(document.getElementById("normal-second-y").value));
      normal.push(Number(document.getElementById("normal-second-z").value));

      normal.push(Number(document.getElementById("normal-third-x").value));
      normal.push(Number(document.getElementById("normal-third-y").value));
      normal.push(Number(document.getElementById("normal-third-z").value));

      Pn.createModel(gl, true, vertex, normal, numberOfPlane - 1);

      updateNormalLine();
    }
  }
}

//dodanie nowego trójkąta PN
function addNewPlain() {
  if (!(Pn == null) || !(Pn == undefined)) {
    const numberOfPlane = document.getElementById("plane-number").value;

    if (numberOfPlane - 1 < Pn.pnTrianglesMesh.length) {
      let vertex = [];
      let normal = [];

      vertex.push(Number(document.getElementById("position-first-x").value));
      vertex.push(Number(document.getElementById("position-first-y").value));
      vertex.push(Number(document.getElementById("position-first-z").value));

      vertex.push(Number(document.getElementById("position-second-x").value));
      vertex.push(Number(document.getElementById("position-second-y").value));
      vertex.push(Number(document.getElementById("position-second-z").value));

      vertex.push(Number(document.getElementById("position-third-x").value));
      vertex.push(Number(document.getElementById("position-third-y").value));
      vertex.push(Number(document.getElementById("position-third-z").value));

      normal.push(Number(document.getElementById("normal-first-x").value));
      normal.push(Number(document.getElementById("normal-first-y").value));
      normal.push(Number(document.getElementById("normal-first-z").value));

      normal.push(Number(document.getElementById("normal-second-x").value));
      normal.push(Number(document.getElementById("normal-second-y").value));
      normal.push(Number(document.getElementById("normal-second-z").value));

      normal.push(Number(document.getElementById("normal-third-x").value));
      normal.push(Number(document.getElementById("normal-third-y").value));
      normal.push(Number(document.getElementById("normal-third-z").value));

      Pn.createModel(gl, true, vertex, normal);

      updateNormalLine();
    }
  }
}

//usuwanie ostatnięgo trójkąta z listy trójkątów możliwe dopóki jest więcej niź jeden trójkąt na liście
function deleteLast() {
  if (Pn.pnTrianglesMesh.length > 1) {
    Pn.deleteLastModel();
    updateNormalLine();
  }
}
