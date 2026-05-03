import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class TreeSystem {
  constructor(scene) {
    this.scene = scene;
    this.trees = [];
    this.energyCost = 3;
  }

  plantTree(position, availableEnergy) {
    if (availableEnergy < this.energyCost) {
      return false;
    }

    const tree = this.createTreeMesh();
    tree.position.set(position.x, 0, position.z);
    tree.scale.setScalar(0.08);
    tree.userData.growth = 0.08;
    tree.userData.maxGrowth = THREE.MathUtils.randFloat(0.9, 1.25);

    this.scene.add(tree);
    this.trees.push(tree);
    return true;
  }

  createTreeMesh() {
    const group = new THREE.Group();

    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8d5524, flatShading: true });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x35a852, flatShading: true });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.1, 6), trunkMaterial);
    trunk.position.y = 0.55;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    const lowerLeaves = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.15, 7), leafMaterial);
    lowerLeaves.position.y = 1.35;
    lowerLeaves.castShadow = true;
    group.add(lowerLeaves);

    const upperLeaves = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.9, 7), leafMaterial);
    upperLeaves.position.y = 2.0;
    upperLeaves.castShadow = true;
    group.add(upperLeaves);

    return group;
  }

  update(deltaTime) {
    for (const tree of this.trees) {
      if (tree.userData.growth < tree.userData.maxGrowth) {
        tree.userData.growth += deltaTime * 0.28;
        tree.scale.setScalar(Math.min(tree.userData.growth, tree.userData.maxGrowth));
      }
    }
  }

  getCount() {
    return this.trees.length;
  }
}
