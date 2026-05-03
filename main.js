import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import { Player } from "./player.js";
import { World } from "./world.js";
import { EnergySystem } from "./energy.js";
import { TreeSystem } from "./tree.js";

const canvas = document.querySelector("#game-canvas");
const energyText = document.querySelector("#energy-count");
const treeText = document.querySelector("#tree-count");
const pollutionLevelText = document.querySelector("#pollution-level");
const passiveGainText = document.querySelector("#passive-gain");
const machineDrainText = document.querySelector("#machine-drain");


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9aa0a6);
scene.fog = new THREE.Fog(0x9aa0a6, 28, 70);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();
const world = new World(scene);
const player = new Player(scene);
const energySystem = new EnergySystem(scene);
const treeSystem = new TreeSystem(scene);

let energy = 0;

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !event.repeat) {
    event.preventDefault();
    const planted = treeSystem.plantTree(player.getPosition(), energy);

    if (planted) {
      energy -= treeSystem.energyCost;
      updateUI();
      pollutionLevelText.textContent = `${Math.round(world.getPollutionLevel() * 100)}%`;
      passiveGainText.textContent = `+${energySystem.getPassiveRate().toFixed(1)}/s`;
      machineDrainText.textContent = `-${energySystem.getDrainRate().toFixed(1)}/s`;

    }
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function updateCamera() {
  const playerPosition = player.getPosition();
  const cameraTarget = new THREE.Vector3(
    playerPosition.x,
    playerPosition.y + 9,
    playerPosition.z + 11
  );

  camera.position.lerp(cameraTarget, 0.08);
  camera.lookAt(playerPosition.x, playerPosition.y + 0.8, playerPosition.z);
}

function updateUI() {
  energyText.textContent = energy;
  treeText.textContent = treeSystem.getCount();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  const deltaTime = Math.min(clock.getDelta(), 0.05);

  player.update(deltaTime);
  energy += energySystem.update(deltaTime, player.getPosition());
  treeSystem.update(deltaTime);
  world.updateEnvironment(treeSystem.getCount());
  updateCamera();
  updateUI();

  renderer.render(scene, camera);
}

updateCamera();
updateUI();
gameLoop();
