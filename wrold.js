import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.dullColor = new THREE.Color(0x777777);
    this.greenColor = new THREE.Color(0x64b96a);
    this.dayLength = 1200;

    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: this.dullColor.clone(),
      roughness: 0.9,
      metalness: 0.0
    });

    this.createLights();
    this.createGround();
    this.createDecorations();
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xf4ffe8, 0.65);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff2aa, 1.25);
    sunLight.position.set(8, 14, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.scene.add(sunLight);
  }

  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(60, 60, 20, 20);
    this.ground = new THREE.Mesh(groundGeometry, this.groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  createDecorations() {
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x8b8f89, flatShading: true });
    const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xb9d8c2, flatShading: true });
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x4f8a8b, flatShading: true });

    for (let i = 0; i < 18; i++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(THREE.MathUtils.randFloat(0.25, 0.7), 0),
        rockMaterial
      );
      rock.position.set(
        THREE.MathUtils.randFloatSpread(48),
        0.25,
        THREE.MathUtils.randFloatSpread(48)
      );
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.scene.add(rock);
    }

    for (let i = 0; i < 5; i++) {
      const house = new THREE.Group();

      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 2.4), houseMaterial);
      base.position.y = 0.75;
      base.castShadow = true;
      base.receiveShadow = true;
      house.add(base);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.0, 4), roofMaterial);
      roof.position.y = 2.0;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);

      const angle = (i / 5) * Math.PI * 2;
      house.position.set(Math.cos(angle) * 26, 0, Math.sin(angle) * 26);
      house.lookAt(0, 0, 0);
      this.scene.add(house);
    }
  }

  updateEnvironment(treeCount) {
    const progress = THREE.MathUtils.clamp(treeCount / 18, 0, 1);
    const newColor = this.dullColor.clone().lerp(his.greenColor, progress);
    this.groundMaterial.color.copy(newColor);

    this.scene.background = new THREE.Color(0x9aa0a6).lerp(new THREE.Color(0x92dce5), progress);
    this.scene.fog.color.copy(this.scene.background);
  }
}