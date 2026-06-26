(function () {
    'use strict';

    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // ── Star-field with gradient coloring ─────────────────────────────────────
    const STARS = 3200;
    const starPos = new Float32Array(STARS * 3);
    const starColors = new Float32Array(STARS * 3);
    const starSizes = new Float32Array(STARS);
    const purple = new THREE.Color(0x7042f8);
    const cyan   = new THREE.Color(0x00d4ff);
    const white  = new THREE.Color(0xffffff);

    for (let i = 0; i < STARS; i++) {
        const x = (Math.random() - 0.5) * 36;
        const y = (Math.random() - 0.5) * 36;
        const z = (Math.random() - 0.5) * 36;
        starPos[i * 3]     = x;
        starPos[i * 3 + 1] = y;
        starPos[i * 3 + 2] = z;

        const t = (y / 36 + 0.5);
        const color = new THREE.Color();
        if (t < 0.5) {
            color.lerpColors(purple, white, t * 2);
        } else {
            color.lerpColors(white, cyan, (t - 0.5) * 2);
        }
        starColors[i * 3]     = color.r;
        starColors[i * 3 + 1] = color.g;
        starColors[i * 3 + 2] = color.b;
        starSizes[i] = Math.random() * 2.5 + 0.5;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float uTime;
            void main() {
                vColor = color;
                vec3 pos = position;
                pos.y += sin(uTime * 0.15 + position.x * 0.5) * 0.08;
                vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (200.0 / -mv.z);
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float d = length(gl_PointCoord - 0.5);
                if (d > 0.5) discard;
                float alpha = smoothstep(0.5, 0.1, d) * 0.6;
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Glow orbs (replaces wireframes) ──────────────────────────────────────
    function makeGlowOrb(radius, color, opacity, x, y, z) {
        const geo = new THREE.SphereGeometry(radius, 32, 32);
        const mat = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity,
            blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        return mesh;
    }

    const orb1 = makeGlowOrb(2.2, 0x7042f8, 0.09, 3, 0, -2);
    const orb2 = makeGlowOrb(1.5, 0x00d4ff, 0.06, -2.5, 1.2, -3);
    const orb3 = makeGlowOrb(2.5, 0x5228d8, 0.05, 0, -1.5, -4);
    const orb4 = makeGlowOrb(1.0, 0xa78bfa, 0.08, -4, -0.8, -1.5);

    // ── Subtle wireframe accent (small, delicate) ────────────────────────────
    const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.01, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x7042f8, transparent: true, opacity: 0.12 })
    );
    ringMesh.position.set(2.8, 0, -1);
    ringMesh.rotation.x = Math.PI * 0.35;
    scene.add(ringMesh);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.008, 16, 80),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.1 })
    );
    ring2.position.set(-2, 0.5, -2);
    ring2.rotation.x = Math.PI * 0.6;
    ring2.rotation.z = Math.PI * 0.25;
    scene.add(ring2);

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const mouse  = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!e.touches.length) return;
        mouse.x =  (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // ── Scroll depth ──────────────────────────────────────────────────────────
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        const heroH = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
        scrollProgress = Math.min(window.scrollY / heroH, 1);
    }, { passive: true });

    // ── Animation loop ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const baseZ = 6.5;

    (function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();
        starMat.uniforms.uTime.value = t;

        // Smooth mouse lerp
        smooth.x += (mouse.x - smooth.x) * 0.04;
        smooth.y += (mouse.y - smooth.y) * 0.04;

        // Orbs — slow floating + breathing
        orb1.position.y = Math.sin(t * 0.3) * 0.5;
        orb1.position.x = 3 + Math.cos(t * 0.2) * 0.3;
        orb1.scale.setScalar(1 + Math.sin(t * 0.5) * 0.08);

        orb2.position.y = 1.2 + Math.cos(t * 0.35) * 0.4;
        orb2.position.x = -2.5 + Math.sin(t * 0.25) * 0.25;
        orb2.scale.setScalar(1 + Math.cos(t * 0.6) * 0.06);

        orb3.position.y = -1.5 + Math.sin(t * 0.28 + 1) * 0.35;
        orb3.scale.setScalar(1 + Math.sin(t * 0.4 + 2) * 0.05);

        orb4.position.y = -0.8 + Math.cos(t * 0.4 + 3) * 0.3;
        orb4.position.x = -4 + Math.sin(t * 0.18) * 0.2;

        // Rings — slow rotation
        ringMesh.rotation.z = t * 0.08;
        ringMesh.rotation.y = t * 0.05 + smooth.x * 0.2;
        ringMesh.position.y = Math.sin(t * 0.3) * 0.3;

        ring2.rotation.z = -t * 0.06;
        ring2.rotation.y = -t * 0.04;

        // Stars — slow drift + mouse parallax
        stars.rotation.y = t * 0.008;
        stars.rotation.x = t * 0.003 + smooth.y * 0.05;

        // Camera — parallax + scroll depth
        const targetX = smooth.x * 1.0;
        const targetY = smooth.y * 0.6;
        const targetZ = baseZ - scrollProgress * 2.5;
        camera.position.x += (targetX - camera.position.x) * 0.03;
        camera.position.y += (targetY - camera.position.y) * 0.03;
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }());

    // ── Resize ────────────────────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}());
