import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class EnergySystem {
  constructor(scene) {
    this.scene = scene;
    this.orbs = [];
    this.spawnTimer = 0;

    for (let i = 0; i < 12; i++) {
      this.spawnOrb();
    }
  }

  spawnOrb() {
    const orbGeometry = new THREE.SphereGeometry(0.35, 16, 12);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff176,
      emissive: 0xffc400,
      emissiveIntensity: 1.4,
      roughness: 0.35
    });

    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(
      THREE.MathUtils.randFloatSpread(42),
      1.2,
      THREE.MathUtils.randFloatSpread(42)
    );
    orb.userData.baseY = orb.position.y;
    orb.userData.spinSpeed = THREE.MathUtils.randFloat(1.2, 2.4);
    this.scene.add(orb);
    this.orbs.push(orb);
  }

  update(deltaTime, playerPosition) {
    let collected = 0;
    this.spawnTimer += deltaTime;

    if (this.spawnTimer > 4 && this.orbs.length < 18) {
      this.spawnTimer = 0;
      this.spawnOrb();
    }

    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];
      orb.rotation.y += deltaTime * orb.userData.spinSpeed;
      orb.position.y = orb.userData.baseY + Math.sin(performance.now() * 0.004 + i) * 0.22;

      const distance = orb.position.distanceTo(playerPosition);
      if (distance < 1.15) {
        this.scene.remove(orb);
        orb.geometry.dispose();
        orb.material.dispose();
        this.orbs.splice(i, 1);
        collected += 1;
      }
    }

    return collected;
  }
}
