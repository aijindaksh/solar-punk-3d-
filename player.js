import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class Player {
  constructor(scene) {
    this.speed = 7;
    this.keys = {};
    this.velocity = new THREE.Vector3();

    this.mesh = this.createPlayerMesh();
    this.mesh.position.set(0, 0.65, 0);
    scene.add(this.mesh);

    window.addEventListener("keydown", (event) => {
      this.keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.code] = false;
    });
  }

  createPlayerMesh() {
    const group = new THREE.Group();

    const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffd166, flatShading: true });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.45;
    body.castShadow = true;
    group.add(body);

    const headGeometry = new THREE.SphereGeometry(0.28, 12, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x7bdff2, flatShading: true });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.05;
    head.castShadow = true;
    group.add(head);

    return group;
  }

  update(deltaTime) {
    const input = new THREE.Vector3();

    if (this.keys.KeyW) input.z -= 1;
    if (this.keys.KeyS) input.z += 1;
    if (this.keys.KeyA) input.x -= 1;
    if (this.keys.KeyD) input.x += 1;
    if (input.lengthSq() > 0) {
      input.normalize();
      this.velocity.lerp(input.multiplyScalar(this.speed), 0.18);
      this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
    } else {
      this.velocity.lerp(new THREE.Vector3(0, 0, 0), 0.12);
    }

    this.mesh.position.addScaledVector(this.velocity, deltaTime);

    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -24, 24);
    this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -24, 24);
  }

  getPosition() {
    return this.mesh.position.clone();
  }
}

