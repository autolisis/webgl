(function() {
  "use strict";
  let size = 2000;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 110, 0);

  let canvas = document.getElementById("canvas");
  let renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

  scene.add(skybox());
  scene.add(bottomPlane(size));
  scene.add(buildings());

  addLight();
  addCars();

  let controls = new THREE.FlyControls(camera);
  controls.movementSpeed = 10;
  controls.domElement = renderer.domElement;
  controls.rollSpeed = Math.PI / 24;
  controls.autoForward = false;
  controls.dragToLook = false;
  controls.enabled = true;
  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    var keycode = event.which;
    if (keycode == 32) {
      controls.enabled = !controls.enabled;
    }
  }

  function animate(time) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (controls.enabled) {
      controls.update(0.1);
    } else {
      camera.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  function bottomPlane(size) {
    let material = new THREE.MeshBasicMaterial({ color: 0x191919 });
    let geometry = new THREE.PlaneGeometry(size, size);
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = (-90 * Math.PI) / 180;
    return plane;
  }

  function skybox() {
    var imagePrefix = "../static/skybox/";
    // var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var directions = ["posx", "negx", "posy", "negy", "posz", "negz"];
    var imageSuffix = ".jpg";
    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push(
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(
            imagePrefix + directions[i] + imageSuffix
          ),
          side: THREE.BackSide
        })
      );
    var skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    // skyBox.rotation.x += Math.PI / 2;
    return skyBox;
  }

  function addLight() {
    var light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(light);
    var light = new THREE.DirectionalLight(0xffffff, 1);
    var target = new THREE.Object3D();
    target.position.set(-1, 0.9, -0.75);
    light.target = target;
    scene.add(light.target);
    scene.add(light);
  }

  function buildings() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    let uv = geometry.faceVertexUvs[0];
    geometry.faces.splice(6, 2);
    uv.splice(6, 2);

    let buildingMesh = new THREE.Mesh(geometry);
    let cityGeometry = new THREE.Geometry();
    for (var i = (size * size) / 200; i >= 0; ) {
      var posx = Math.random();
      var smallNoise = Math.pow(Math.random(), 2);
      if (Math.sin((posx * 2 * Math.PI * size) / 160) > -0.55) {
        var posz = Math.random();
        // var smallNoise = Math.random() * Math.random() * Math.random() * Math.random();
        if (Math.sin((posz * 2 * Math.PI * size) / 160) > -0.55) {
          buildingMesh.position.x = posx * size - size / 2;
          buildingMesh.position.z = posz * size - size / 2;
          buildingMesh.scale.x =
            Math.random() * Math.random() * Math.random() * Math.random() * 50 +
            10;
          buildingMesh.scale.y =
            Math.random() *
              Math.random() *
              Math.random() *
              buildingMesh.scale.x *
              8 +
            8;
          buildingMesh.scale.z = buildingMesh.scale.x;
          buildingMesh.updateMatrix();
          cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
          i--;
        }
      }
    }
    let material = new THREE.MeshLambertMaterial({ color: 0x2ec184 });

    var cityMesh = new THREE.Mesh(cityGeometry, material);
    return cityMesh;
  }

  function addCars() {
    for (var i = 0; i < 100; i++) {
      var c1 = 30;
      var c2 = 12.5;
      var car = addCar();
      car.position.x =
        -size / c1 + (-size / c2) * Math.floor(Math.random() * 10);
      car.position.y = 3;
      scene.add(car);
    }
  }

  function addCar() {
    let carWidth = 6;
    let carLength = 16.58;

    var car = new THREE.Group();
    var particleTexture = new THREE.TextureLoader().load(
      "../static/particle.png"
    );

    var tailLights = new THREE.Geometry();
    var pMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      size: 5
    });
    var leftLight = new THREE.Vector3(-carWidth / 2, 0, -carLength / 2);
    tailLights.vertices.push(leftLight);
    var rightLight = new THREE.Vector3(carWidth / 2, 0, -carLength / 2);
    tailLights.vertices.push(rightLight);
    var particleSystem = new THREE.Points(tailLights, pMaterial);
    car.add(particleSystem);

    var headLights = new THREE.Geometry();
    var pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      size: 5
    });
    var leftLight = new THREE.Vector3(-carWidth / 2, 0, +carLength / 2);
    headLights.vertices.push(leftLight);
    var rightLight = new THREE.Vector3(carWidth / 2, 0, +carLength / 2);
    headLights.vertices.push(rightLight);
    var particleSystem = new THREE.Points(headLights, pMaterial);
    car.add(particleSystem);

    return car;
  }
  function cars() {
    carsFrontMaterial = createAnimatedParticleMaterial(
      0xffffff,
      flareA,
      500,
      true
    );
    carsBackMaterial = createAnimatedParticleMaterial(
      0xff0000,
      flareA,
      250,
      true
    );

    carsFrontMaterial2 = createAnimatedParticleMaterial(
      0xffffff,
      flareA,
      500,
      false
    );
    carsBackMaterial2 = createAnimatedParticleMaterial(
      0xff0000,
      flareA,
      250,
      false
    );

    // car lights

    var carsFrontGeo = new THREE.Geometry();
    var carsBackGeo = new THREE.Geometry();

    var carsFrontGeo2 = new THREE.Geometry();
    var carsBackGeo2 = new THREE.Geometry();

    var dd = 4150,
      xx = 400,
      xxs = xx / 2 - 50;

    for (var j = -7; j < 6; j++)
      for (var i = -55; i < 55; i++) {
        // front lights

        var vertex = new THREE.Vector3();
        vertex.x = i * xx + THREE.Math.randFloatSpread(xxs);
        vertex.y = -1900;
        vertex.z = 2150 + j * dd + THREE.Math.randFloatSpread(50);
        carsFrontGeo.vertices.push(vertex);

        var vertexCopy = vertex.clone();
        vertexCopy.z += 50;
        carsFrontGeo.vertices.push(vertexCopy);

        var vertex = new THREE.Vector3();
        vertex.z = i * xx + THREE.Math.randFloatSpread(xxs);
        vertex.y = -1900;
        vertex.x = 2150 + j * dd + THREE.Math.randFloatSpread(50);
        carsFrontGeo2.vertices.push(vertex);

        var vertexCopy = vertex.clone();
        vertexCopy.x += 50;
        carsFrontGeo2.vertices.push(vertexCopy);

        // back lights

        var vertex = new THREE.Vector3();
        vertex.x = i * xx + THREE.Math.randFloatSpread(xxs);
        vertex.y = -1900;
        vertex.z = 2000 + j * dd + THREE.Math.randFloatSpread(50);
        carsBackGeo.vertices.push(vertex);

        var vertexCopy = vertex.clone();
        vertexCopy.z += 50;
        carsBackGeo.vertices.push(vertexCopy);

        var vertex = new THREE.Vector3();
        vertex.z = i * xx + THREE.Math.randFloatSpread(xxs);
        vertex.y = -1900;
        vertex.x = 2000 + j * dd + THREE.Math.randFloatSpread(50);
        carsBackGeo2.vertices.push(vertex);

        var vertexCopy = vertex.clone();
        vertexCopy.x += 50;
        carsBackGeo2.vertices.push(vertexCopy);
      }

    var particles = new THREE.ParticleSystem(carsFrontGeo, carsFrontMaterial);
    particles.frustumCulled = true;
    scene.add(particles);

    var particles = new THREE.ParticleSystem(carsBackGeo, carsBackMaterial);
    particles.frustumCulled = true;
    scene.add(particles);

    //

    var particles = new THREE.ParticleSystem(carsFrontGeo2, carsFrontMaterial2);
    particles.frustumCulled = true;
    scene.add(particles);

    var particles = new THREE.ParticleSystem(carsBackGeo2, carsBackMaterial2);
    particles.frustumCulled = true;
    scene.add(particles);
  }

  function createAnimatedParticleMaterial(color, map, size, xMove) {
    var delta = new THREE.Vector3(),
      offset = new THREE.Vector3(),
      modulo = new THREE.Vector3();

    if (xMove) {
      delta.set(200, 0, 0);
      offset.set(27000, 5000, 27000);
      modulo.set(50000, 5000, 50000);
    } else {
      delta.set(0, 0, 200);
      offset.set(27000, 5000, 27000);
      modulo.set(50000, 5000, 50000);
    }

    var ShaderParticles = {
      particles: {
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib["particle"],
          THREE.UniformsLib["shadowmap"],

          {
            delta: { type: "v3", value: delta },
            modulo: { type: "v3", value: modulo },
            offset: { type: "v3", value: offset },
            time: { type: "f", value: 0 }
          }
        ]),

        vertexShader: [
          "uniform float size;",
          "uniform float scale;",

          "uniform float time;",

          "uniform vec3 delta;",
          "uniform vec3 modulo;",
          "uniform vec3 offset;",

          THREE.ShaderChunk["color_pars_vertex"],
          THREE.ShaderChunk["shadowmap_pars_vertex"],

          "void main() {",

          THREE.ShaderChunk["color_vertex"],

          "vec3 newPosition = mod( position + offset + delta * time, modulo ) - offset;",

          "vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
          "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
          "#else",
          "gl_PointSize = size;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk["shadowmap_vertex"],

          "}"
        ].join("\n"),

        fragmentShader: [
          "uniform vec3 psColor;",
          "uniform float opacity;",

          THREE.ShaderChunk["color_pars_fragment"],
          THREE.ShaderChunk["map_particle_pars_fragment"],
          THREE.ShaderChunk["fog_pars_fragment"],
          THREE.ShaderChunk["shadowmap_pars_fragment"],

          "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          THREE.ShaderChunk["map_particle_fragment"],
          THREE.ShaderChunk["alphatest_fragment"],
          THREE.ShaderChunk["color_fragment"],
          THREE.ShaderChunk["shadowmap_fragment"],
          THREE.ShaderChunk["fog_fragment"],

          "}"
        ].join("\n")
      }
    };

    var shader = ShaderParticles["particles"];

    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms.psColor.value.setHex(color);
    uniforms.map.value = map;
    uniforms.size.value = size;
    uniforms.scale.value = SCREEN_HEIGHT / 2.0;

    var material = new THREE.ShaderMaterial({
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      uniforms: uniforms,
      fog: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    material.size = size;
    material.sizeAttenuation = true;
    material.map = map;

    return material;
  }
})();
