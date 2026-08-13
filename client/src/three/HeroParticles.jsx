import { useEffect, useRef } from "react";
import * as THREE from "three";

function HeroParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let animationId;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      1,
      10000
    );

    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    /* -------------------------------- */
    /* PARTICLE CONFIG                   */
    /* -------------------------------- */

    const particleCount = 18000;

    const positions = new Float32Array(
      particleCount * 3
    );

    const targetPositions = new Float32Array(
      particleCount * 3
    );

    const velocities = new Float32Array(
      particleCount * 3
    );

    /* -------------------------------- */
    /* CREATE TARGET TEXT               */
    /* -------------------------------- */

    const canvas = document.createElement("canvas");

    canvas.width = 1600;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.font = "900 150px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "NEXATECH",
      canvas.width / 2,
      canvas.height / 2
    );

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const points = [];

    for (
      let y = 0;
      y < canvas.height;
      y += 5
    ) {
      for (
        let x = 0;
        x < canvas.width;
        x += 5
      ) {
        const index =
          (y * canvas.width + x) * 4;

        if (imageData.data[index + 3] > 100) {

          const px =
            (x - canvas.width / 2) * 0.075;

          const py =
            -(y - canvas.height / 2) * 0.075;

          points.push({
            x: px,
            y: py,
            z: 0,
          });

        }
      }
    }

    /* -------------------------------- */
    /* INITIAL PARTICLE POSITIONS       */
    /* -------------------------------- */

    for (let i = 0; i < particleCount; i++) {

      const i3 = i * 3;

      const point =
        points[i % points.length];

      targetPositions[i3] = point.x;
      targetPositions[i3 + 1] = point.y;
      targetPositions[i3 + 2] =
        (Math.random() - 0.5) * 12;

      positions[i3] =
        (Math.random() - 0.5) * 180;

      positions[i3 + 1] =
        (Math.random() - 0.5) * 100;

      positions[i3 + 2] =
        (Math.random() - 0.5) * 100;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

    }

    /* -------------------------------- */
    /* GEOMETRY                         */
    /* -------------------------------- */

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    /* -------------------------------- */
    /* MATERIAL                         */
    /* -------------------------------- */

    const material =
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.55,
        transparent: true,
        opacity: 0.8,
        blending:
          THREE.AdditiveBlending,
        depthWrite: false,
      });

    const particles =
      new THREE.Points(
        geometry,
        material
      );

    scene.add(particles);

    /* -------------------------------- */
    /* MOUSE                            */
    /* -------------------------------- */

    const mouse = new THREE.Vector2(
      9999,
      9999
    );

    const mouseTarget =
      new THREE.Vector2(
        9999,
        9999
      );

    const handleMouseMove = (event) => {

      mouseTarget.x =
        (event.clientX /
          window.innerWidth) *
          2 -
        1;

      mouseTarget.y =
        -(event.clientY /
          window.innerHeight) *
          2 +
        1;

    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    /* -------------------------------- */
    /* CLICK EXPLOSION                  */
    /* -------------------------------- */

    const handleClick = () => {

      for (let i = 0; i < particleCount; i++) {

        const i3 = i * 3;

        velocities[i3] +=
          (Math.random() - 0.5) * 1.5;

        velocities[i3 + 1] +=
          (Math.random() - 0.5) * 1.5;

        velocities[i3 + 2] +=
          (Math.random() - 0.5) * 1.5;

      }

    };

    window.addEventListener(
      "click",
      handleClick
    );

    /* -------------------------------- */
    /* RESIZE                           */
    /* -------------------------------- */

    const handleResize = () => {

      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /* -------------------------------- */
    /* ANIMATION                        */
    /* -------------------------------- */

    const clock = new THREE.Clock();

    const animate = () => {

      animationId =
        requestAnimationFrame(
          animate
        );

      const time =
        clock.getElapsedTime();

      mouse.lerp(
        mouseTarget,
        0.08
      );

      const pos =
        geometry.attributes.position;

      for (
        let i = 0;
        i < particleCount;
        i++
      ) {

        const i3 = i * 3;

        let x =
          positions[i3];

        let y =
          positions[i3 + 1];

        let z =
          positions[i3 + 2];

        const tx =
          targetPositions[i3];

        const ty =
          targetPositions[i3 + 1];

        const tz =
          targetPositions[i3 + 2];

        /* Form text */

        x += (tx - x) * 0.025;
        y += (ty - y) * 0.025;
        z += (tz - z) * 0.025;

        /* Floating */

        x +=
          Math.sin(
            time * 0.5 + i
          ) * 0.002;

        y +=
          Math.cos(
            time * 0.4 + i
          ) * 0.002;

        /* Mouse */

        const mouseX =
          mouse.x * 45;

        const mouseY =
          mouse.y * 25;

        const dx =
          x - mouseX;

        const dy =
          y - mouseY;

        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        if (distance < 18) {

          const force =
            (18 - distance) /
            18;

          x +=
            (dx / (distance || 1)) *
            force *
            4;

          y +=
            (dy / (distance || 1)) *
            force *
            4;

        }

        /* Velocity */

        x += velocities[i3];

        y += velocities[i3 + 1];

        z += velocities[i3 + 2];

        velocities[i3] *= 0.94;
        velocities[i3 + 1] *= 0.94;
        velocities[i3 + 2] *= 0.94;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        pos.setXYZ(
          i,
          x,
          y,
          z
        );

      }

      pos.needsUpdate = true;

      particles.rotation.y =
        Math.sin(time * 0.15) *
        0.015;

      renderer.render(
        scene,
        camera
      );

    };

    animate();

    /* -------------------------------- */
    /* CLEANUP                          */
    /* -------------------------------- */

    return () => {

      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "click",
        handleClick
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();

      renderer.dispose();

      if (
        renderer.domElement.parentNode
      ) {
        renderer.domElement.parentNode.removeChild(
          renderer.domElement
        );
      }

    };

  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}

export default HeroParticles;