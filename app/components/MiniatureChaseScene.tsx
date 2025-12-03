"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const TRACK_LENGTH = 8;

function buildGround(): THREE.Group {
  const group = new THREE.Group();

  const groundGeometry = new THREE.PlaneGeometry(12, 6, 60, 30);
  groundGeometry.rotateX(-Math.PI / 2);

  const position = groundGeometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i);
    const z = position.getZ(i);
    const noise = Math.sin(z * 3 + y * 1.4) * 0.05 + (Math.random() - 0.5) * 0.02;
    position.setY(i, position.getY(i) + noise);
  }
  groundGeometry.computeVertexNormals();

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x496431,
    roughness: 0.9,
    metalness: 0.05,
    emissive: 0x102512,
    emissiveIntensity: 0.2
  });

  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  const roadGeometry = new THREE.PlaneGeometry(12, 1.15, 100, 6);
  roadGeometry.rotateX(-Math.PI / 2);
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x7d5234,
    roughness: 0.95,
    metalness: 0.01
  });
  const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
  roadMesh.position.y = 0.01;
  roadMesh.receiveShadow = true;
  group.add(roadMesh);

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xb7b1a2,
    roughness: 0.85,
    metalness: 0.1
  });

  const stoneGeometry = new THREE.IcosahedronGeometry(0.12, 1);
  for (let i = 0; i < 24; i += 1) {
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    const side = Math.random() > 0.5 ? 1 : -1;
    stone.position.set(
      -4 + Math.random() * 8,
      0.06,
      side * (1.4 + Math.random() * 1.2)
    );
    stone.rotation.set(Math.random(), Math.random(), Math.random());
    stone.castShadow = true;
    stone.receiveShadow = true;
    const scale = 0.7 + Math.random() * 0.6;
    stone.scale.setScalar(scale);
    group.add(stone);
  }

  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x6faa4a,
    roughness: 1
  });

  const bladeGeometry = new THREE.ConeGeometry(0.03, 0.24, 5);
  for (let i = 0; i < 120; i += 1) {
    const blade = new THREE.Mesh(bladeGeometry, grassMaterial);
    const radius = 2.5 + Math.random() * 2;
    const angle = Math.random() * Math.PI * 2;
    blade.position.set(Math.cos(angle) * radius - 0.6, 0.1, Math.sin(angle) * radius * 0.6);
    blade.rotation.z = (Math.random() - 0.5) * 0.5;
    blade.rotation.y = Math.random() * Math.PI;
    const scale = 0.8 + Math.random() * 0.4;
    blade.scale.setScalar(scale);
    blade.castShadow = true;
    group.add(blade);
  }

  return group;
}

function buildJax(): {
  group: THREE.Group;
  wheels: THREE.Mesh[];
} {
  const group = new THREE.Group();
  group.name = "Jax";

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xc4282e,
    roughness: 0.3,
    metalness: 0.5
  });

  const bodyGeometry = new THREE.BoxGeometry(0.9, 0.35, 0.55);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.position.y = 0.45;
  body.position.z = 0;
  body.geometry.translate(0, 0.2, 0);
  group.add(body);

  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf36848,
    roughness: 0.25,
    metalness: 0.35,
    transparent: true,
    opacity: 0.95
  });
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.45), cabinMaterial);
  cabin.position.set(0.05, 0.74, 0);
  cabin.castShadow = true;
  group.add(cabin);

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff1c5,
    emissiveIntensity: 0.7
  });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x1c2633 });

  const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), eyeMaterial);
  headlight.rotation.z = Math.PI / 2;
  headlight.position.set(0.38, 0.58, 0.18);
  headlight.castShadow = true;
  group.add(headlight);

  const headlight2 = headlight.clone();
  headlight2.position.z = -0.18;
  group.add(headlight2);

  const pupilGeometry = new THREE.SphereGeometry(0.04, 12, 12);
  const pupilL = new THREE.Mesh(pupilGeometry, pupilMaterial);
  pupilL.position.set(0.42, 0.59, 0.18);
  group.add(pupilL);
  const pupilR = pupilL.clone();
  pupilR.position.z = -0.18;
  group.add(pupilR);

  const bumperMaterial = new THREE.MeshStandardMaterial({
    color: 0x582f1b,
    roughness: 0.8,
    metalness: 0.2
  });
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.56), bumperMaterial);
  bumper.position.set(0.33, 0.3, 0);
  bumper.castShadow = true;
  group.add(bumper);

  const mudMaterial = new THREE.MeshStandardMaterial({
    color: 0x433020,
    roughness: 1,
    metalness: 0
  });
  const mud = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.12), mudMaterial);
  mud.position.set(0.42, 0.33, 0.28);
  mud.rotation.y = Math.PI / 8;
  mud.rotation.x = -Math.PI / 12;
  group.add(mud);

  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1b1d1f,
    roughness: 0.4,
    metalness: 0.2
  });
  const wheelGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 24);
  wheelGeometry.rotateZ(Math.PI / 2);
  const wheels: THREE.Mesh[] = [];

  const wheelPositions: [number, number, number][] = [
    [-0.25, 0.26, 0.25],
    [-0.25, 0.26, -0.25],
    [0.35, 0.26, 0.25],
    [0.35, 0.26, -0.25]
  ];
  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(...pos);
    wheel.castShadow = true;
    wheels.push(wheel);
    group.add(wheel);
  });

  const spareTire = new THREE.Mesh(wheelGeometry, wheelMaterial);
  spareTire.scale.setScalar(0.75);
  spareTire.position.set(-0.45, 0.55, 0);
  group.add(spareTire);

  return { group, wheels };
}

function buildNino(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Nino";

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b7bd9,
    emissive: 0x12314f,
    emissiveIntensity: 0.3,
    roughness: 0.35,
    metalness: 0.6
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x8cc6ff,
    roughness: 0.2,
    metalness: 0.4
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f1d2e,
    roughness: 0.6,
    metalness: 0.3
  });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.18), metalMaterial);
  torso.position.y = 0.53;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.2), metalMaterial);
  head.position.y = 0.78;
  head.castShadow = true;
  group.add(head);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.015, 0.16, 8), accentMaterial);
  antenna.position.set(0, 0.93, 0);
  group.add(antenna);
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), accentMaterial);
  antennaTip.position.set(0, 1.02, 0);
  group.add(antennaTip);

  const eyeGeometry = new THREE.CircleGeometry(0.04, 16);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x9cc9ff,
    emissiveIntensity: 0.5
  });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x1a2636 });

  const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eyeLeft.position.set(0.05, 0.8, 0.105);
  eyeLeft.rotation.y = -Math.PI / 2;
  group.add(eyeLeft);
  const eyeRight = eyeLeft.clone();
  eyeRight.position.x = -0.05;
  group.add(eyeRight);

  const pupilGeometry = new THREE.CircleGeometry(0.02, 16);
  const pupilLeft = new THREE.Mesh(pupilGeometry, pupilMaterial);
  pupilLeft.position.set(0.05, 0.8, 0.11);
  pupilLeft.rotation.y = -Math.PI / 2;
  group.add(pupilLeft);
  const pupilRight = pupilLeft.clone();
  pupilRight.position.x = -0.05;
  group.add(pupilRight);

  const armGeometry = new THREE.CylinderGeometry(0.03, 0.035, 0.32, 12);
  const leftArm = new THREE.Mesh(armGeometry, accentMaterial);
  leftArm.rotation.z = Math.PI / 3;
  leftArm.position.set(0.23, 0.48, 0);
  group.add(leftArm);
  const rightArm = leftArm.clone();
  rightArm.rotation.z = -Math.PI / 2.4;
  rightArm.position.set(-0.23, 0.52, 0);
  group.add(rightArm);

  const legGeometry = new THREE.CylinderGeometry(0.04, 0.05, 0.28, 14);
  const leftLeg = new THREE.Mesh(legGeometry, darkMaterial);
  leftLeg.position.set(0.08, 0.2, 0);
  group.add(leftLeg);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = -0.08;
  group.add(rightLeg);

  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.12), darkMaterial);
  backpack.position.set(0, 0.52, -0.16);
  backpack.castShadow = true;
  group.add(backpack);

  const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x182635, roughness: 0.7 });
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 12, 20), strapMaterial);
  strap.rotation.x = Math.PI / 2;
  strap.position.set(0, 0.54, -0.08);
  group.add(strap);

  return group;
}

function buildDustSystem(count = 60) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 1] = 0.15 + Math.random() * 0.12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    speeds[i] = 0.4 + Math.random() * 0.6;
    lifetimes[i] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("lifetime", new THREE.BufferAttribute(lifetimes, 1));

  const material = new THREE.PointsMaterial({
    color: 0xcfa984,
    size: 0.12,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  return { points, lifetimes, speeds };
}

const MiniatureChaseScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => undefined;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1724);
    scene.fog = new THREE.Fog(0x0d1724, 6, 14);

    const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 50);
    camera.position.set(-2.2, 0.62, 1.2);

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const ambient = new THREE.AmbientLight(0x4e6378, 0.65);
    scene.add(ambient);
    const hemi = new THREE.HemisphereLight(0xfff1c5, 0x1f2b38, 0.6);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffdfb2, 1.25);
    sun.position.set(4, 4.5, -1.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 10;
    sun.shadow.camera.left = -4;
    sun.shadow.camera.right = 4;
    sun.shadow.camera.top = 4;
    sun.shadow.camera.bottom = -3;
    scene.add(sun);
    scene.add(sun.target);

    const lightWrapper = new THREE.Group();
    const godray = new THREE.SpotLight(0xfff1c5, 0.4, 20, Math.PI / 4, 0.7, 1.1);
    godray.position.set(2.5, 5.6, -0.8);
    godray.target.position.set(0, 0, 0);
    godray.castShadow = false;
    lightWrapper.add(godray);
    lightWrapper.add(godray.target);
    scene.add(lightWrapper);

    const ground = buildGround();
    scene.add(ground);

    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.6, 0, -0.2),
      new THREE.Vector3(-2.1, 0, -0.3),
      new THREE.Vector3(-0.8, 0, 0.05),
      new THREE.Vector3(0.8, 0, 0.32),
      new THREE.Vector3(2.4, 0, 0.15),
      new THREE.Vector3(3.6, 0, -0.08)
    ]);
    path.curveType = "catmullrom";

    const { group: jax, wheels } = buildJax();
    scene.add(jax);

    const nino = buildNino();
    scene.add(nino);

    const { points: dust, lifetimes, speeds } = buildDustSystem();
    jax.add(dust);

    const clock = new THREE.Clock();
    let elapsedTotal = 0;

    const tempVec = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    const frameTargets = new THREE.Group();
    const focusPoint = new THREE.Object3D();
    frameTargets.add(focusPoint);
    scene.add(frameTargets);

    let isMounted = true;

    const animate = () => {
      if (!isMounted) {
        return;
      }
      const delta = clock.getDelta();
      elapsedTotal += delta;
      const elapsed = elapsedTotal;
      const t = (elapsed % TRACK_LENGTH) / TRACK_LENGTH;
      const ninoT = (elapsed % TRACK_LENGTH) / TRACK_LENGTH - 0.08;

      path.getPointAt(t, tempVec);
      path.getTangentAt(t, tangent);

      tempVec.y = 0.18 + Math.sin(elapsed * 6) * 0.01;
      jax.position.lerp(tempVec, 0.35);

      const forward = tangent.clone().normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), forward);
      jax.quaternion.slerp(quaternion, 0.2);

      focusPoint.position.copy(jax.position).add(forward.clone().multiplyScalar(0.2));

      const speed = tangent.length() * 3.5 + 2.2;
      wheels.forEach((wheel) => {
        wheel.rotation.x -= speed * delta * 3.4;
      });

      dust.rotation.y += 0.0025;
      const posAttr = dust.geometry.getAttribute("position") as THREE.BufferAttribute;
      const lifetimeAttr = dust.geometry.getAttribute("lifetime") as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i += 1) {
        const baseIndex = i * 3;
        let life = lifetimes[i];
        life += speeds[i] * 0.01;
        if (life > 1) {
          life = 0;
          posAttr.setX(i, (Math.random() - 0.5) * 0.3 - 0.2);
          posAttr.setZ(i, (Math.random() - 0.5) * 0.3);
          posAttr.setY(i, 0.1 + Math.random() * 0.2);
        }
        lifetimes[i] = life;
        posAttr.setY(i, posAttr.getY(i) + 0.004 * speeds[i]);
        posAttr.setX(i, posAttr.getX(i) - 0.003);
        lifetimeAttr.setX(i, life);
      }
      posAttr.needsUpdate = true;
      lifetimeAttr.needsUpdate = true;
      (dust.material as THREE.PointsMaterial).opacity = 0.4 + Math.sin(elapsed * 2) * 0.05;

      const adjustedNinoT = ((ninoT % 1) + 1) % 1;
      const ninoPos = path.getPointAt(adjustedNinoT);
      const ninoTan = path.getTangentAt(adjustedNinoT, tangent).normalize();
      const jitter = Math.sin(elapsed * 9) * 0.05;
      nino.position.lerp(
        new THREE.Vector3(ninoPos.x - 0.2, 0.15 + Math.abs(Math.sin(elapsed * 6)) * 0.12, ninoPos.z + 0.22 + jitter),
        0.34
      );
      nino.lookAt(nino.position.clone().add(ninoTan));
      nino.rotation.x = Math.sin(elapsed * 4) * 0.08;
      nino.rotation.z = Math.sin(elapsed * 3) * 0.15;

      const camTarget = jax.position.clone().add(forward.clone().multiplyScalar(0.4));
      camTarget.y = 0.42;
      const desiredCamPos = jax.position
        .clone()
        .add(forward.clone().multiplyScalar(-0.9))
        .add(new THREE.Vector3(-0.4, 0.32, 0.3));
      camera.position.lerp(desiredCamPos, 0.08);
      camera.lookAt(camTarget);

      const sunTarget = jax.position.clone().add(new THREE.Vector3(1.6, 0.2, -0.6));
      sun.position.lerp(new THREE.Vector3(4, 4.5, -1.5), 0.02);
      sun.target.position.copy(sunTarget);
      sun.target.updateMatrixWorld();

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      isMounted = false;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.traverse((object) => {
        if ((object as THREE.Mesh).geometry) {
          (object as THREE.Mesh).geometry.dispose();
        }
        if ((object as THREE.Mesh).material) {
          const material = (object as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MiniatureChaseScene;
