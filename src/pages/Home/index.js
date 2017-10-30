import React, { Component } from "react";
import * as THREE from "three";
import ParticleCloud from "./ParticleCloud.three.js";
import Planet from "./Planet.three.js";
import Player from "./Player.three.js";
const generateKeyboard = array => {
  let response = {};
  array.forEach(el => (response = { ...response, [el]: { pressed: false, rate: 0 } }), this);
  return response;
};
export class Home extends Component {
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.player = new Player(
      "ship",
      (this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, -1)),
      this.renderer.domElement
    );
    let light = new THREE.PointLight(0x404040,1);
    light.position.y = 1000;
    let earth = new Planet(6371, 1737, 384400);
    earth.position.z = 1500;
    this.scene.add(earth);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040, 0.3));
    this.scene.add(this.player);
    this.keyboard = generateKeyboard(["w", "a", "s", "d", "q", "e", "space", "shift"]);
    this.scene.add(new ParticleCloud(1000000,0.00001));
  }
  calculatePlayerMove = () => {
    let { w, a, s, d, q, e, space, shift } = { ...this.keyboard };
    let damperStrength = 5 / 100;
    let accelStrength = 5 / 100;
    let maxSpeed = 5;

    //W
    w.pressed
      ? (w.rate = Math.min(maxSpeed, Math.max(1, w.rate + accelStrength)))
      : (w.rate = Math.max(0, w.rate - damperStrength));
    this.player.translateZ(w.rate);
    //S
    s.pressed
      ? (s.rate = Math.min(maxSpeed, Math.max(1, s.rate + accelStrength)))
      : (s.rate = Math.max(0, s.rate - damperStrength));
    this.player.translateZ(-s.rate);
    //A
    a.pressed ? (a.rate = 1) : (a.rate = Math.max(0, a.rate - damperStrength));
    this.player.rotateZ(a.rate * -0.01);
    //D
    d.pressed ? (d.rate = 1) : (d.rate = Math.max(0, d.rate - damperStrength));
    this.player.rotateZ(d.rate * 0.01);
    //Q
    q.pressed ? (q.rate = 1) : (q.rate = Math.max(0, q.rate - damperStrength));
    this.player.rotateY(q.rate * 0.008);
    //E
    e.pressed ? (e.rate = 1) : (e.rate = Math.max(0, e.rate - damperStrength));
    this.player.rotateY(e.rate * -0.008);
    //SPACE
    space.pressed ? (space.rate = 1) : (space.rate = Math.max(0, space.rate - damperStrength));
    this.player.rotateX(space.rate * -0.01);
    //SHIFT
    shift.pressed ? (shift.rate = 1) : (shift.rate = Math.max(0, shift.rate - damperStrength));
    this.player.rotateX(shift.rate * 0.01);
  };
  _keyDown = e => {
    let key = e.key === " " ? "space" : e.key.toLowerCase();
    this.keyboard[key] ? (this.keyboard[key].pressed = true) : void 0;
  };
  _keyUp = e => {
    let key = e.key === " " ? "space" : e.key.toLowerCase();
    this.keyboard[key] ? (this.keyboard[key].pressed = false) : void 0;
  };
  componentDidMount = () => {
    this.container.appendChild(this.renderer.domElement);
    document.addEventListener("keydown", this._keyDown);
    document.addEventListener("keyup", this._keyUp);

    this.animate();
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    this.calculatePlayerMove();
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    if (typeof window !== "undefined") {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      return (
        <div
          style={{ width: "inherit", height: "inherit", overflow: "hidden" }}
          ref={thisNode => (this.container = thisNode)}
        />
      );
    } else {
      return null;
    }
  }
}
