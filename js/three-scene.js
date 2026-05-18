(function () {
    'use strict';

    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // ── Star-field particles ──────────────────────────────────────────────────
    const STARS = 2800;
    const starPos = new Float32Array(STARS * 3);
    for (let i = 0; i < STARS; i++) {
        starPos[i * 3]     = (Math.random() - 0.5) * 32;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 32;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
        color: 0xffffff, size: 0.022, transparent: true, opacity: 0.55,
    }));
    scene.add(stars);

    // ── Main icosahedron (large wireframe diamond) ────────────────────────────
    const icoMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.3, 1),
        new THREE.MeshBasicMaterial({ color: 0x7042f8, wireframe: true, transparent: true, opacity: 0.13 })
    );
    icoMesh.position.set(2.6, 0, 0);
    scene.add(icoMesh);

    // Outer halo — same centre, slightly larger, cyan tint
    const haloMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.4, 1),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.04 })
    );
    haloMesh.position.copy(icoMesh.position);
    scene.add(haloMesh);

    // ── Torus knot (accent piece, offset left) ────────────────────────────────
    const tkMesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.65, 0.18, 80, 14),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.38 })
    );
    tkMesh.position.set(-3.4, -0.5, -1);
    scene.add(tkMesh);

    // ── Floating cubes (ambient detail) ──────────────────────────────────────
    function makeCube(size, color, opacity, x, y, z) {
        const m = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
        );
        m.position.set(x, y, z);
        scene.add(m);
        return m;
    }
    const cube1 = makeCube(0.55, 0x7042f8, 0.5,  -2.5,  2.2, -0.4);
    const cube2 = makeCube(0.32, 0x00d4ff, 0.4,   4.5,  1.6, -2.0);
    const cube3 = makeCube(0.42, 0x7042f8, 0.35,  1.8, -2.4, -1.5);

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const mouse  = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Touch support
    window.addEventListener('touchmove', (e) => {
        if (!e.touches.length) return;
        mouse.x =  (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // ── Animation loop ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock();

    (function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        // Smooth mouse lerp
        smooth.x += (mouse.x - smooth.x) * 0.045;
        smooth.y += (mouse.y - smooth.y) * 0.045;

        // Main icosahedron — slow steady rotation + mouse nudge
        icoMesh.rotation.x = t * 0.07;
        icoMesh.rotation.y = t * 0.11 + smooth.x * 0.35;
        icoMesh.position.y = Math.sin(t * 0.45 + 1) * 0.22;

        // Outer halo counter-rotates
        haloMesh.rotation.x = -t * 0.04;
        haloMesh.rotation.y = -t * 0.07;
        haloMesh.position.y = icoMesh.position.y;

        // Torus knot
        tkMesh.rotation.x = t * 0.22;
        tkMesh.rotation.z = t * 0.17;

        // Cubes float + spin
        cube1.rotation.x = t * 0.38; cube1.rotation.y = t * 0.55;
        cube1.position.y = 2.2 + Math.sin(t * 0.65) * 0.28;

        cube2.rotation.x = t * 0.3;  cube2.rotation.y = t * 0.48;
        cube2.position.y = 1.6 + Math.cos(t * 0.58) * 0.38;

        cube3.rotation.x = t * 0.45; cube3.rotation.z = t * 0.3;
        cube3.position.y = -2.4 + Math.sin(t * 0.7 + 2) * 0.25;

        // Stars — very slow drift + subtle mouse parallax
        stars.rotation.y = t * 0.009;
        stars.rotation.x = smooth.y * 0.04;

        // Camera parallax
        camera.position.x += (smooth.x * 0.55 - camera.position.x) * 0.03;
        camera.position.y += (smooth.y * 0.35 - camera.position.y) * 0.03;
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
