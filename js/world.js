/* ————————————————————————————————
   TAHA BIN YOUSUF — THE STACK (WORLD)
   Ten bespoke 3D sets built with Three.js:
   1. Prologue: 40,000-particle portrait cloud + code matrix
   2. Layer 01: Sketch to Stack (Isometric studio architecture & drafting desk)
   3. Layer 02: Transaction Engines (POS terminals, receipt ribbons, cash coins)
   4. Layer 03: Distributed Web & Auto (Gemstone, Housing grid, CarZone chassis)
   5. Layer 04: Healthcare Kernel (Glowing medical cross + real-time ECG pulse wave)
   6. Layer 05: Neural Frontier (DIVA AI: 3D pose-estimation skeleton & couture mesh)
   7. Layer 06: Production Telemetry (The Triad: 3 enterprise server towers)
   8. Layer 07: Core Algorithms (Parallel computing matrix & compiler stack)
   9. Layer 08: Verified Protocols (Concentric golden accreditation laurels)
   10. Layer 09: System Directory (Warp starfield & directory beacon)
   ———————————————————————————————— */
(function () {
  "use strict";
  const T = window.THREE;
  const TAU = Math.PI * 2;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const ease = (k) => k * k * (3 - 2 * k);

  function solid(geo, col) {
    return new T.Mesh(geo, new T.MeshBasicMaterial({ color: col }));
  }

  function wire(geo, col, op = 0.55) {
    return new T.LineSegments(
      new T.EdgesGeometry(geo, 22),
      new T.LineBasicMaterial({ color: col, transparent: true, opacity: op })
    );
  }

  // Radial glow sprite generator
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const rad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rad.addColorStop(0, "rgba(255,255,255,1)");
    rad.addColorStop(0.25, "rgba(255,255,255,0.45)");
    rad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rad;
    g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  })();

  function glowSprite(col, size = 80, op = 0.35) {
    const mat = new T.SpriteMaterial({
      map: glowTex,
      color: col,
      transparent: true,
      opacity: op,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    const s = new T.Sprite(mat);
    s.scale.set(size, size, 1);
    return s;
  }

  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      let x = Math.imul(s ^ (s >>> 15), 1 | s);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pointsCloud(positions, color, size, opacity) {
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    return new T.Points(geo, new T.PointsMaterial({
      color, size, map: glowTex, transparent: true, opacity: opacity || 0.9,
      blending: T.AdditiveBlending, depthWrite: false,
    }));
  }

  // ============================================================
  // 0 — LAYER 00: THE REEL — 3D Particle Cloud Face Portrait
  // ============================================================
  function buildHero() {
    const g = new T.Group();
    const AC = 0x00f5a0; // Emerald

    // Ambient space dust
    const rnd = mulberry32(7);
    const pos = [];
    for (let i = 0; i < 450; i++) {
      pos.push((rnd() - 0.5) * 320, (rnd() - 0.5) * 180, (rnd() - 0.5) * 500);
    }
    const dust = pointsCloud(pos, 0xf4f6fa, 1.5, 0.45);
    g.add(dust);

    // Subtle outer halo ring
    const ring = new T.Mesh(
      new T.TorusGeometry(36, 0.14, 8, 160),
      new T.MeshBasicMaterial({ color: AC, transparent: true, opacity: 0.3 })
    );
    const ring2 = ring.clone();
    ring2.scale.setScalar(1.24);
    ring2.material = ring.material.clone();
    ring2.material.opacity = 0.14;
    ring2.rotation.x = 0.4;
    g.add(ring, ring2);

    const glow = glowSprite(AC, 110, 0.25);
    glow.position.z = -45;
    g.add(glow);

    // The face — Photographic 3D Particle Cloud
    const portrait = new T.Group();
    portrait.position.set(0, 2, -24);
    g.add(portrait);
    const port = { pts: null, lines: null, tgt: null, scat: null, cur: null, lastK: -1 };

    function initPortraitFromData(data) {
      if (!data || !data.tgt || !data.tgt.length) return false;
      try {
        const tgt = data.tgt;
        const scat = data.scat;
        const colArr = data.cols;
        const lpos = data.lines || [];

        const geo = new T.BufferGeometry();
        const cur = new Float32Array(tgt.slice()); // Start already assembled for instant crisp visibility!
        geo.setAttribute("position", new T.BufferAttribute(cur, 3));
        geo.setAttribute("color", new T.Float32BufferAttribute(colArr, 3));
        const pts = new T.Points(geo, new T.PointsMaterial({
          size: 0.85, vertexColors: true, map: glowTex, transparent: true,
          opacity: 0.98, blending: T.AdditiveBlending, depthWrite: false,
        }));
        portrait.add(pts);

        if (lpos.length >= 6) {
          const lgeo = new T.BufferGeometry();
          lgeo.setAttribute("position", new T.Float32BufferAttribute(lpos, 3));
          const lines = new T.LineSegments(lgeo, new T.LineBasicMaterial({
            color: 0x00f5a0, transparent: true, opacity: 0.82,
            blending: T.AdditiveBlending, depthWrite: false,
          }));
          portrait.add(lines);
          port.lines = lines;
        }

        port.pts = pts;
        port.tgt = tgt;
        port.scat = scat;
        port.cur = cur;
        port.lastK = 1.0;
        console.log("Photographic 3D particle portrait loaded synchronously:", (tgt.length / 3) + " vertices");
        return true;
      } catch (err) {
        console.error("Error setting up pre-baked portrait:", err);
        return false;
      }
    }

    // Try pre-baked data first (instant 0ms)
    if (!initPortraitFromData(window.TAHA_PORTRAIT_DATA)) {
      // Fallback to runtime canvas sampling
      (function loadPortraitFallback() {
        const img = new Image();
        img.onload = () => {
          try {
            const iw = 380;
            const ih = Math.max(2, Math.round((img.height / img.width) * iw));
            const cv = document.createElement("canvas");
            cv.width = iw; cv.height = ih;
            const g2 = cv.getContext("2d");
            g2.drawImage(img, 0, 0, iw, ih);
            const data = g2.getImageData(0, 0, iw, ih).data;

            const lum = (x, y) => {
              const k = (y * iw + x) * 4;
              return (data[k] * 0.299 + data[k + 1] * 0.587 + data[k + 2] * 0.114) / 255;
            };

            const MOB = window.innerWidth <= 820;
            const S = (MOB ? 70 : 84) / ih;
            const STEP = MOB ? 3 : 2;

            const mask = (x, y) => {
              const nx = (x - iw / 2) / (iw * 0.44);
              const ny = (y - ih * 0.40) / (ih * 0.54);
              return nx * nx + ny * ny;
            };

            const tgt = [], scat = [], colArr = [];
            for (let y = 0; y < ih; y += STEP) {
              for (let x = 0; x < iw; x += STEP) {
                const d = mask(x, y);
                if (d > 1) continue;
                const L = lum(x, y);
                if (L < 0.08) continue;
                const edgeFade = 1 - Math.max(0, (d - 0.55) / 0.45) * 0.9;
                tgt.push((x - iw / 2) * S, (ih / 2 - y) * S, L * 7.5);
                scat.push((Math.random() - 0.5) * 160, (Math.random() - 0.5) * 110, (Math.random() - 0.5) * 90);
                const cc = (0.36 + Math.pow(L, 0.72) * 0.68) * edgeFade;
                colArr.push(Math.min(1.0, cc * 0.88), Math.min(1.0, cc * 1.12), Math.min(1.0, cc * 0.95));
              }
            }

            const geo = new T.BufferGeometry();
            const cur = new Float32Array(tgt.slice());
            geo.setAttribute("position", new T.BufferAttribute(cur, 3));
            geo.setAttribute("color", new T.Float32BufferAttribute(colArr, 3));
            const pts = new T.Points(geo, new T.PointsMaterial({
              size: 0.85, vertexColors: true, map: glowTex, transparent: true,
              opacity: 0.98, blending: T.AdditiveBlending, depthWrite: false,
            }));
            portrait.add(pts);

            port.pts = pts;
            port.tgt = tgt; port.scat = scat; port.cur = cur; port.lastK = 1.0;
          } catch (e) {
            console.error("Fallback portrait loading issue:", e);
          }
        };
        img.src = "assets/taha.jpg";
      })();
    }

    return {
      group: g,
      update(t, p) {
        ring.rotation.z = t * 0.08;
        ring2.rotation.z = -t * 0.05;
        const fade = clamp01(1 - p * 1.6);
        ring.material.opacity = 0.3 * fade;
        ring2.material.opacity = 0.14 * fade;
        dust.rotation.y = t * 0.008;

        const isMob = window.innerWidth <= 860 || (window.innerWidth / Math.max(1, window.innerHeight) < 0.9);
        const targetScale = isMob ? 0.52 : 1.0;
        portrait.scale.setScalar(targetScale);
        portrait.position.y = isMob ? -1.2 : 2;
        ring.scale.setScalar(isMob ? 0.65 : 1.0);
        ring2.scale.setScalar(isMob ? 0.65 : 1.0);

        if (port.pts) {
          // Immediately solid on load, subtly breathing, dissolves into flight out on scroll
          const assemble = ease(clamp01((t + 0.4) * 2.0));
          const holdThreshold = isMob ? 0.22 : 0.48;
          const dissolveSpeed = isMob ? 4.2 : 3.2;
          const k = assemble * (1 - ease(clamp01((p - holdThreshold) * dissolveSpeed)));
          if (Math.abs(k - port.lastK) > 0.0008) {
            port.lastK = k;
            const { cur, tgt, scat } = port;
            for (let i = 0; i < cur.length; i += 3) {
              cur[i] = tgt[i] * k + scat[i] * (1 - k);
              cur[i + 1] = tgt[i + 1] * k + scat[i + 1] * (1 - k);
              cur[i + 2] = tgt[i + 2] * k + scat[i + 2] * (1 - k);
            }
            port.pts.geometry.attributes.position.needsUpdate = true;
            port.pts.material.opacity = 0.35 + k * 0.63;
            if (port.lines) port.lines.material.opacity = Math.max(0, k - 0.4) * 1.6 * 0.82;
          }
          portrait.rotation.y = Math.sin(t * 0.18) * 0.08;
        }
      },
      // Start clearly framed, then dolly in smoothly on scroll
      mod: (p) => {
        const isMob = window.innerWidth <= 860 || (window.innerWidth / Math.max(1, window.innerHeight) < 0.9);
        const pushZ = isMob ? 30 : 78;
        return {
          dx: 0,
          dy: (isMob ? 0 : 1.5) + 1.5 * ease(p),
          dz: 48 - pushZ * ease(p),
          df: (isMob ? -1 : -3) * ease(p)
        };
      },
    };
  }

  // ============================================================
  // 1 — LAYER 01: SKETCH TO STACK (The Studio & 4 Connected Nodes)
  // ============================================================
  function buildSketchToStack() {
    const g = new T.Group();
    const AC = 0xf59e0b; // Studio Amber / Gold

    // Central isometric drafting cube with expanding layers
    const coreGeo = new T.BoxGeometry(16, 16, 16);
    const core = solid(coreGeo, 0x161005);
    const coreEdges = wire(coreGeo, AC, 0.75);
    const mainCube = new T.Group();
    mainCube.add(core, coreEdges);
    mainCube.rotation.set(0.6, 0.6, 0);
    g.add(mainCube);

    // 4 satellite blocks (The 4 commercial builds) orbiting the studio
    const satellites = [];
    const satGeo = new T.BoxGeometry(4.5, 4.5, 4.5);
    for (let i = 0; i < 4; i++) {
      const sat = new T.Group();
      sat.add(solid(satGeo, 0x090c12), wire(satGeo, 0x00f5a0, 0.7));
      g.add(sat);
      satellites.push(sat);
    }

    // Grid blueprint planes
    const grid = new T.GridHelper(90, 24, AC, 0x222a36);
    grid.position.y = -22;
    g.add(grid);

    const halo = glowSprite(AC, 100, 0.3);
    halo.position.set(0, 0, -25);
    g.add(halo);

    return {
      group: g,
      update(t, p) {
        mainCube.rotation.x = 0.6 + Math.sin(t * 0.3) * 0.15;
        mainCube.rotation.y = t * 0.25;
        grid.rotation.y = t * 0.02;

        satellites.forEach((sat, idx) => {
          const angle = t * 0.4 + (idx * Math.PI) / 2;
          const radius = 24 + Math.sin(t * 0.8 + idx) * 3;
          sat.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.5) * 6, Math.sin(angle) * radius);
          sat.rotation.x = t * 0.5;
          sat.rotation.y = t * 0.7;
        });
      },
      mod: (p) => ({ dx: 2, dy: -2 * ease(p), dz: 54 - 64 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 2 — LAYER 02: TRANSACTION ENGINES (POS Hardware & Ledgers)
  // ============================================================
  function buildPOS() {
    const g = new T.Group();
    const AC = 0xff6b4a; // Coral Flame

    // Two dual POS touchscreens
    const screenGeo = new T.BoxGeometry(18, 11, 1.2);
    const screenMat = new T.MeshBasicMaterial({ color: 0x140a08 });
    const screen1 = new T.Group();
    screen1.add(new T.Mesh(screenGeo, screenMat), wire(screenGeo, AC, 0.85));
    screen1.position.set(-12, 4, 0);
    screen1.rotation.y = 0.35;
    g.add(screen1);

    const screen2 = new T.Group();
    screen2.add(new T.Mesh(screenGeo, screenMat), wire(screenGeo, 0x00f5a0, 0.85));
    screen2.position.set(12, 4, -4);
    screen2.rotation.y = -0.35;
    g.add(screen2);

    // Floating continuous receipt ribbon
    const ribbonGeo = new T.PlaneGeometry(7, 48, 1, 30);
    const ribbonMat = new T.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      side: T.DoubleSide
    });
    const ribbon = new T.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0, -6, 8);
    ribbon.rotation.x = -Math.PI * 0.35;
    g.add(ribbon);

    // Floating currency coin tokens
    const coins = [];
    const coinGeo = new T.CylinderGeometry(2.4, 2.4, 0.5, 24);
    for (let i = 0; i < 7; i++) {
      const coin = new T.Group();
      coin.add(solid(coinGeo, 0x221804), wire(coinGeo, 0xf59e0b, 0.85));
      coin.position.set((Math.random() - 0.5) * 36, (Math.random() - 0.5) * 20 - 4, (Math.random() - 0.5) * 20);
      g.add(coin);
      coins.push(coin);
    }

    // Barcode scanner laser beam
    const laserGeo = new T.BoxGeometry(32, 0.15, 0.15);
    const laser = new T.Mesh(laserGeo, new T.MeshBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.8 }));
    laser.position.set(0, 3, 4);
    g.add(laser);

    return {
      group: g,
      update(t, p) {
        screen1.position.y = 4 + Math.sin(t * 0.6) * 0.8;
        screen2.position.y = 4 + Math.cos(t * 0.6) * 0.8;
        laser.position.y = 2 + Math.sin(t * 2.5) * 4;
        ribbon.position.z = 8 + (t * 4) % 12;

        coins.forEach((c, idx) => {
          c.rotation.x = t * 1.2 + idx;
          c.rotation.y = t * 0.8 + idx;
        });
      },
      mod: (p) => ({ dx: 0, dy: 1, dz: 58 - 72 * ease(p), df: 2 }),
    };
  }

  // ============================================================
  // 3 — LAYER 03: DISTRIBUTED WEB & AUTO (Jewelry, Housing, CarZone)
  // ============================================================
  function buildWebAuto() {
    const g = new T.Group();
    const AC = 0xa855f7; // Amethyst Purple

    // 1. Multifaceted rotating diamond facet (Jewelry boutique)
    const gemGeo = new T.OctahedronGeometry(9, 1);
    const gem = new T.Group();
    gem.add(solid(gemGeo, 0x180924), wire(gemGeo, 0xd8b4fe, 0.9));
    gem.position.set(-16, 6, 4);
    g.add(gem);

    // 2. Isometric wireframe housing plots grid (Housing Society)
    const housingGrid = new T.GridHelper(38, 12, AC, 0x3b2554);
    housingGrid.position.set(0, -12, 0);
    housingGrid.rotation.y = 0.4;
    g.add(housingGrid);

    // 3. Aerodynamic automobile chassis wireframe (CarZone & Showroom)
    const carBodyGeo = new T.BoxGeometry(22, 5, 10);
    const carCabinGeo = new T.BoxGeometry(12, 4.5, 8.5);
    const car = new T.Group();
    car.add(solid(carBodyGeo, 0x0c1018), wire(carBodyGeo, 0x00f5a0, 0.75));
    const cabin = new T.Group();
    cabin.add(solid(carCabinGeo, 0x070b12), wire(carCabinGeo, 0x00d2ff, 0.75));
    cabin.position.set(-1.5, 4.5, 0);
    car.add(cabin);
    car.position.set(15, -2, -6);
    car.rotation.set(0.15, -0.45, 0);
    g.add(car);

    return {
      group: g,
      update(t, p) {
        gem.rotation.y = t * 0.4;
        gem.rotation.x = Math.sin(t * 0.3) * 0.3;
        housingGrid.rotation.y = 0.4 + t * 0.04;
        car.position.y = -2 + Math.sin(t * 0.8) * 0.6;
        car.rotation.y = -0.45 + Math.sin(t * 0.25) * 0.1;
      },
      mod: (p) => ({ dx: -1, dy: 0, dz: 62 - 76 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 4 — LAYER 04: MISSION CRITICAL (Healthcare Clinic & Pharmacy OS)
  // ============================================================
  // 5 — LAYER 05: HEALTHCARE KERNEL (Clinic & Pharmacy OS + Map Hub)
  // Modular Healthcare ERP, Supplier Ingestion & Geolocation Network Map
  // ============================================================
  function buildClinic() {
    const g = new T.Group();
    const AC_CYAN = 0x00d2ff;   // Clinical Cyan
    const AC_EMERALD = 0x00f5a0; // Pharmacy Emerald
    const AC_AMBER = 0xf59e0b;   // Supplier Amber

    // 1. 3D Glowing Medical Cross (Hovering above the central hub)
    const crossV = new T.BoxGeometry(5.2, 18, 5.2);
    const crossH = new T.BoxGeometry(18, 5.2, 5.2);
    const crossGroup = new T.Group();
    crossGroup.add(solid(crossV, 0x041822), wire(crossV, AC_CYAN, 0.85));
    crossGroup.add(solid(crossH, 0x041822), wire(crossH, AC_CYAN, 0.85));
    crossGroup.position.set(0, 6, 0);
    g.add(crossGroup);

    // 2. Geolocation Healthcare Network Map Grid Plane
    const mapGroup = new T.Group();
    mapGroup.position.set(0, -12, 0);

    const mapGrid = new T.GridHelper(88, 22, AC_CYAN, 0x0a2233);
    mapGroup.add(mapGrid);

    // 3. Multi-Branch Node Beacons on the Map (Central Clinic, Pharmacy, Supplier, Satellite)
    const beaconGeo = new T.CylinderGeometry(1.2, 1.2, 4, 16);
    const ringGeo = new T.RingGeometry(2.0, 2.5, 24);

    const beaconData = [
      { id: "clinic", x: 0, z: 0, col: AC_CYAN },       // Central Clinic Hub
      { id: "pharmacy", x: 18, z: 12, col: AC_EMERALD }, // Standalone Pharmacy
      { id: "supplier", x: -22, z: 14, col: AC_AMBER },  // Supplier Warehouse Depot
      { id: "satellite", x: -14, z: -18, col: 0x38bdf8 } // Satellite Clinic Counter
    ];

    const beaconMeshes = [];
    beaconData.forEach(b => {
      const beaconGroup = new T.Group();
      beaconGroup.position.set(b.x, 2, b.z);

      const pillar = new T.Mesh(beaconGeo, new T.MeshBasicMaterial({ color: b.col }));
      pillar.scale.set(0.8, 1, 0.8);
      const pillarWire = wire(beaconGeo, 0xffffff, 0.8);
      beaconGroup.add(pillar, pillarWire);

      const ring = new T.Mesh(ringGeo, new T.MeshBasicMaterial({
        color: b.col, transparent: true, opacity: 0.6, side: T.DoubleSide
      }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.8;
      beaconGroup.add(ring);

      mapGroup.add(beaconGroup);
      beaconMeshes.push({ beaconGroup, ring, baseScale: 1 });
    });

    // 4. Pulsing Inter-Branch Network Route Lines (Supplier -> Pharmacy -> Clinic -> Satellite)
    const routePairs = [
      [2, 1], // Supplier -> Pharmacy
      [1, 0], // Pharmacy -> Central Clinic
      [0, 3], // Clinic -> Satellite
      [2, 0]  // Supplier -> Central Clinic
    ];
    const routeLines = [];
    routePairs.forEach(([i1, i2]) => {
      const p1 = new T.Vector3(beaconData[i1].x, 0.2, beaconData[i1].z);
      const p2 = new T.Vector3(beaconData[i2].x, 0.2, beaconData[i2].z);
      const lgeo = new T.BufferGeometry().setFromPoints([p1, p2]);
      const lmat = new T.LineBasicMaterial({
        color: beaconData[i1].col,
        transparent: true,
        opacity: 0.75
      });
      const line = new T.Line(lgeo, lmat);
      mapGroup.add(line);
      routeLines.push(line);
    });

    g.add(mapGroup);

    // 5. Live pulsating ECG heart waveform line
    const ecgPoints = [];
    const ptsCount = 140;
    for (let i = 0; i < ptsCount; i++) {
      const x = (i - ptsCount / 2) * 0.65;
      ecgPoints.push(new T.Vector3(x, 0, 0));
    }
    const ecgGeo = new T.BufferGeometry().setFromPoints(ecgPoints);
    const ecgLine = new T.Line(ecgGeo, new T.LineBasicMaterial({
      color: AC_EMERALD,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    }));
    ecgLine.position.set(0, -6, 6);
    g.add(ecgLine);

    // 6. Floating pharmaceutical capsules
    const capsules = [];
    const capGeo = new T.CylinderGeometry(1.5, 1.5, 3.8, 16);
    for (let i = 0; i < 6; i++) {
      const cap = new T.Group();
      cap.add(solid(capGeo, 0x061c28), wire(capGeo, i % 2 === 0 ? AC_CYAN : AC_AMBER, 0.85));
      cap.position.set((Math.random() - 0.5) * 44, 4 + (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
      g.add(cap);
      capsules.push(cap);
    }

    const halo = glowSprite(AC_CYAN, 120, 0.35);
    halo.position.set(0, 4, -22);
    g.add(halo);

    return {
      group: g,
      update(t, p) {
        crossGroup.rotation.y = t * 0.25;
        crossGroup.rotation.z = Math.sin(t * 0.4) * 0.08;

        // Map beacon radar pulse
        beaconMeshes.forEach((bm, i) => {
          const pulse = 1 + Math.sin(t * 2.5 + i * 1.2) * 0.35;
          bm.ring.scale.set(pulse, pulse, 1);
          bm.ring.material.opacity = 0.8 - (pulse - 0.65) * 0.5;
        });

        // Dynamic ECG heart pulse
        const pos = ecgLine.geometry.attributes.position;
        for (let i = 0; i < ptsCount; i++) {
          const phase = (i * 0.22 - t * 6) % (Math.PI * 2);
          let y = 0;
          if (phase > 2.0 && phase < 2.3) y = Math.sin((phase - 2.0) * 10) * 4.5;
          else if (phase >= 2.3 && phase < 2.6) y = -Math.sin((phase - 2.3) * 10) * 2.2;
          else y = Math.sin(phase * 0.8) * 0.4;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;

        capsules.forEach((c, idx) => {
          c.rotation.x = t * 0.6 + idx;
          c.rotation.y = t * 0.9 + idx;
        });
      },
      mod: (p) => ({ dx: 1, dy: 1, dz: 60 - 74 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 3 — LAYER 03: NEURAL FRONTIER (DIVA AI - Pose & Computer Vision)
  // Holographic 3D Virtual Couture & AI Scanner Portal
  // ============================================================
  function buildDiva() {
    const g = new T.Group();
    const AC_ROSE = 0xec4899;    // Couture Magenta
    const AC_EMERALD = 0x00f5a0; // CV Green
    const AC_CYAN = 0x38bdf8;    // Telemetry Cyan

    // 1. Ambient Couture Glow Volume
    const glow = glowSprite(AC_ROSE, 110, 0.3);
    glow.position.set(0, 4, -18);
    g.add(glow);

    // 2. Holographic Scanner Arch: Outer Couture Ring & Inner Telemetry Ring
    const archGroup = new T.Group();
    archGroup.position.set(0, 4, 0);

    const outerRingGeo = new T.TorusGeometry(17, 0.22, 12, 80);
    const outerRing = new T.Mesh(outerRingGeo, new T.MeshBasicMaterial({
      color: AC_ROSE,
      transparent: true,
      opacity: 0.85
    }));
    outerRing.scale.set(0.85, 1.35, 1.0); // Upright oval couture smart mirror
    archGroup.add(outerRing);

    const innerRingGeo = new T.TorusGeometry(13.5, 0.16, 12, 64);
    const innerRing = new T.Mesh(innerRingGeo, new T.MeshBasicMaterial({
      color: AC_EMERALD,
      transparent: true,
      opacity: 0.6
    }));
    innerRing.scale.set(0.88, 1.32, 1.0);
    archGroup.add(innerRing);

    // Secondary tilted holographic gyro ring
    const gyroGeo = new T.TorusGeometry(15, 0.14, 8, 64);
    const gyroRing = new T.Mesh(gyroGeo, new T.MeshBasicMaterial({
      color: AC_CYAN,
      transparent: true,
      opacity: 0.35
    }));
    gyroRing.rotation.x = Math.PI / 3;
    archGroup.add(gyroRing);

    g.add(archGroup);

    // 3. Central Faceted Bridal Couture Gemstone / Prism Polyhedron
    const coreGroup = new T.Group();
    coreGroup.position.set(0, 4, 0);

    // Multifaceted outer bridal crystal
    const gemGeo = new T.OctahedronGeometry(7.2, 0);
    const gemMat = new T.MeshBasicMaterial({
      color: 0x180a1d,
      transparent: true,
      opacity: 0.75
    });
    const gemMesh = new T.Mesh(gemGeo, gemMat);
    const gemWire = wire(gemGeo, AC_ROSE, 0.9);
    coreGroup.add(gemMesh, gemWire);

    // Inner glowing neural nucleus
    const nucGeo = new T.IcosahedronGeometry(3.2, 0);
    const nucMesh = new T.Mesh(nucGeo, new T.MeshBasicMaterial({
      color: 0x051b14,
      transparent: true,
      opacity: 0.85
    }));
    const nucWire = wire(nucGeo, AC_EMERALD, 0.95);
    coreGroup.add(nucMesh, nucWire);

    g.add(coreGroup);

    // 4. Sweeping Laser Measurement Scanline Disc
    const scanGeo = new T.RingGeometry(0.8, 12.8, 48);
    const scanMat = new T.MeshBasicMaterial({
      color: AC_EMERALD,
      transparent: true,
      opacity: 0.65,
      side: T.DoubleSide
    });
    const scanDisc = new T.Mesh(scanGeo, scanMat);
    scanDisc.rotation.x = Math.PI / 2;
    scanDisc.scale.set(0.85, 1.0, 1.0);
    g.add(scanDisc);

    // Sweeping beam perimeter pulse wire
    const edgePts = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * TAU;
      edgePts.push(new T.Vector3(Math.cos(a) * 11, 0, Math.sin(a) * 13));
    }
    const scanEdgeGeo = new T.BufferGeometry().setFromPoints(edgePts);
    const scanLine = new T.Line(scanEdgeGeo, new T.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    }));
    g.add(scanLine);

    // 5. DensePose 3D Measurement Nodes & Dynamic Caliper Lines
    const calipersGroup = new T.Group();
    calipersGroup.position.set(0, 4, 0);

    const nodeGeo = new T.SphereGeometry(0.55, 10, 10);
    const nodeMatRose = new T.MeshBasicMaterial({ color: AC_ROSE });
    const nodeMatEmerald = new T.MeshBasicMaterial({ color: AC_EMERALD });

    // Keypoint landmarks (Head, L/R Shoulders, L/R Waist, L/R Hips, L/R Hem)
    const keypointData = [
      { id: "head", x: 0, y: 16.5, z: 0, col: AC_EMERALD },
      { id: "l_sh", x: -7.5, y: 11.5, z: 1.5, col: AC_ROSE },
      { id: "r_sh", x: 7.5, y: 11.5, z: 1.5, col: AC_ROSE },
      { id: "l_wst", x: -5.2, y: 3.5, z: 0.8, col: AC_EMERALD },
      { id: "r_wst", x: 5.2, y: 3.5, z: 0.8, col: AC_EMERALD },
      { id: "l_hip", x: -7.8, y: -4.5, z: 1.2, col: AC_ROSE },
      { id: "r_hip", x: 7.8, y: -4.5, z: 1.2, col: AC_ROSE },
      { id: "l_hem", x: -9.5, y: -13.5, z: 0, col: AC_CYAN },
      { id: "r_hem", x: 9.5, y: -13.5, z: 0, col: AC_CYAN }
    ];

    const nodes = [];
    keypointData.forEach(kp => {
      const dot = new T.Mesh(nodeGeo, kp.col === AC_ROSE ? nodeMatRose : nodeMatEmerald);
      dot.position.set(kp.x, kp.y, kp.z);
      // Outer reticle ring
      const retGeo = new T.RingGeometry(0.9, 1.15, 16);
      const ret = new T.Mesh(retGeo, new T.MeshBasicMaterial({
        color: kp.col,
        transparent: true,
        opacity: 0.7,
        side: T.DoubleSide
      }));
      dot.add(ret);
      calipersGroup.add(dot);
      nodes.push({ dot, kp });
    });

    // Measurement Caliper Line Pairs: [Shoulders, Waist, Hips, Hem]
    const caliperPairs = [
      [1, 2], // Shoulders
      [3, 4], // Waist
      [5, 6], // Hips
      [7, 8]  // Hem
    ];
    const caliperLines = [];
    caliperPairs.forEach(([a, b]) => {
      const p1 = nodes[a].dot.position;
      const p2 = nodes[b].dot.position;
      const lgeo = new T.BufferGeometry().setFromPoints([p1, p2]);
      const lmat = new T.LineBasicMaterial({
        color: AC_EMERALD,
        transparent: true,
        opacity: 0.65
      });
      const line = new T.Line(lgeo, lmat);
      calipersGroup.add(line);
      caliperLines.push({ line, a, b });
    });

    // 6. Corner AR Target Viewport Brackets
    const bracketMat = new T.LineBasicMaterial({ color: AC_ROSE, transparent: true, opacity: 0.75 });
    const bracketSize = 3.5;
    const boxW = 15;
    const boxH = 22;
    const corners = [
      [-boxW, boxH], [boxW, boxH], [-boxW, -boxH], [boxW, -boxH]
    ];
    corners.forEach(([cx, cy]) => {
      const sx = Math.sign(cx);
      const sy = Math.sign(cy);
      const bgeo = new T.BufferGeometry().setFromPoints([
        new T.Vector3(cx - sx * bracketSize, cy, 0),
        new T.Vector3(cx, cy, 0),
        new T.Vector3(cx, cy - sy * bracketSize, 0)
      ]);
      const bMesh = new T.Line(bgeo, bracketMat);
      archGroup.add(bMesh);
    });

    // 7. Ambient Floating Sparkle Swarm
    const rnd = mulberry32(42);
    const dustPos = [];
    for (let i = 0; i < 90; i++) {
      dustPos.push((rnd() - 0.5) * 28, (rnd() - 0.5) * 44, (rnd() - 0.5) * 22);
    }
    const coutureDust = pointsCloud(dustPos, AC_ROSE, 1.4, 0.6);
    g.add(coutureDust);

    g.add(calipersGroup);

    return {
      group: g,
      update(t, p) {
        // Smooth rotation of scanner rings
        archGroup.rotation.y = Math.sin(t * 0.3) * 0.22;
        gyroRing.rotation.z = t * 0.45;
        gyroRing.rotation.y = -t * 0.3;

        // Central couture gem multifaceted tumbling
        gemMesh.rotation.y = t * 0.5;
        gemMesh.rotation.x = Math.sin(t * 0.35) * 0.25;
        gemWire.rotation.y = gemMesh.rotation.y;
        gemWire.rotation.x = gemMesh.rotation.x;

        nucMesh.rotation.y = -t * 0.7;
        nucMesh.rotation.z = Math.cos(t * 0.4) * 0.3;
        nucWire.rotation.y = nucMesh.rotation.y;
        nucWire.rotation.z = nucMesh.rotation.z;

        // Laser scanline sweeping up and down through the portal
        const scanY = 4 + Math.sin(t * 1.7) * 16;
        scanDisc.position.y = scanY;
        scanLine.position.y = scanY;

        // Gentle measurement breathing / calibration pulse on keypoints
        const breathe = Math.sin(t * 2.2) * 0.4;
        nodes[1].dot.position.x = nodes[1].kp.x - breathe * 0.6; // L shoulder
        nodes[2].dot.position.x = nodes[2].kp.x + breathe * 0.6; // R shoulder
        nodes[3].dot.position.x = nodes[3].kp.x - breathe * 0.4; // L waist
        nodes[4].dot.position.x = nodes[4].kp.x + breathe * 0.4; // R waist
        nodes[5].dot.position.x = nodes[5].kp.x - breathe * 0.5; // L hip
        nodes[6].dot.position.x = nodes[6].kp.x + breathe * 0.5; // R hip

        caliperLines.forEach(({ line, a, b }) => {
          const pos = line.geometry.attributes.position;
          pos.setXYZ(0, nodes[a].dot.position.x, nodes[a].dot.position.y, nodes[a].dot.position.z);
          pos.setXYZ(1, nodes[b].dot.position.x, nodes[b].dot.position.y, nodes[b].dot.position.z);
          pos.needsUpdate = true;
        });

        // Reticle rings spin subtly
        nodes.forEach(({ dot }) => {
          if (dot.children[0]) {
            dot.children[0].rotation.z = t * 1.2;
          }
        });
      },
      mod: (p) => ({ dx: 0, dy: 1, dz: 64 - 78 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 6 — LAYER 06: PRODUCTION TELEMETRY (The Internship Triad)
  // ============================================================
  function buildInternships() {
    const g = new T.Group();
    const AC = 0x38bdf8; // Sky Blue

    // 3 Enterprise Server Towers (Solution AI, Arch Tech, Fentix Tech)
    const towerGeo = new T.BoxGeometry(8, 28, 8);
    const towers = [];
    const positions = [[-18, 2, 0], [0, 6, -8], [18, 2, 0]];
    const accents = [0x00f5a0, 0xf59e0b, AC];

    positions.forEach((pos, i) => {
      const tower = new T.Group();
      tower.add(solid(towerGeo, 0x070c14), wire(towerGeo, accents[i], 0.85));
      tower.position.set(pos[0], pos[1], pos[2]);
      g.add(tower);
      towers.push(tower);
    });

    // Pulsing data stream beams connecting the 3 towers
    const beamGeo = new T.BufferGeometry().setFromPoints([
      new T.Vector3(-18, 10, 0),
      new T.Vector3(0, 14, -8),
      new T.Vector3(18, 10, 0),
      new T.Vector3(-18, 10, 0)
    ]);
    const beam = new T.Line(beamGeo, new T.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    }));
    g.add(beam);

    return {
      group: g,
      update(t, p) {
        towers.forEach((tw, idx) => {
          tw.position.y = positions[idx][1] + Math.sin(t * 0.8 + idx * 2) * 1.2;
          tw.rotation.y = t * 0.15 * (idx % 2 === 0 ? 1 : -1);
        });
      },
      mod: (p) => ({ dx: 0, dy: 0, dz: 64 - 80 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 7 — LAYER 07: CORE ALGORITHMS (Parallel C++ & Academic Stack)
  // ============================================================
  function buildAcademic() {
    const g = new T.Group();
    const AC = 0x10b981; // Emerald Mint

    // Multi-tiered glass architectural stack (Parallel Processing Cores)
    const stack = new T.Group();
    const tierGeo = new T.BoxGeometry(24, 2.2, 24);
    const tiers = [];
    for (let i = 0; i < 5; i++) {
      const tier = new T.Group();
      tier.add(solid(tierGeo, 0x071510), wire(tierGeo, AC, 0.8));
      tier.position.y = (i - 2) * 6;
      stack.add(tier);
      tiers.push(tier);
    }
    g.add(stack);

    // Floating CPU matrix cores in center
    const coreCluster = new T.Group();
    const cGeo = new T.BoxGeometry(3.5, 3.5, 3.5);
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const c = new T.Group();
        c.add(solid(cGeo, 0x0d281e), wire(cGeo, 0x00f5a0, 0.9));
        c.position.set(x * 6, 0, z * 6);
        coreCluster.add(c);
      }
    }
    g.add(coreCluster);

    return {
      group: g,
      update(t, p) {
        stack.rotation.y = t * 0.18;
        tiers.forEach((tier, i) => {
          tier.position.y = (i - 2) * 6 + Math.sin(t * 1.2 + i) * 0.8;
          tier.rotation.y = Math.sin(t * 0.3 + i) * 0.1;
        });
        coreCluster.rotation.y = -t * 0.4;
      },
      mod: (p) => ({ dx: 1, dy: 0, dz: 62 - 76 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 8 — LAYER 08: VERIFIED PROTOCOLS (Accreditation Laurels)
  // ============================================================
  function buildCerts() {
    const g = new T.Group();
    const AC = 0xeab308; // Gold

    // Concentric rotating laurel rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new T.TorusGeometry(14 + i * 5, 0.35, 16, 60);
      const r = new T.Mesh(rGeo, new T.MeshBasicMaterial({
        color: AC,
        transparent: true,
        opacity: 0.75 - i * 0.15
      }));
      r.rotation.x = Math.PI * 0.5;
      g.add(r);
      rings.push(r);
    }

    // Floating accreditation credential badge plaques
    const badgeGeo = new T.BoxGeometry(10, 13, 0.8);
    const badges = [];
    const colors = [0x00f5a0, 0x00d2ff, 0xf59e0b];
    for (let i = 0; i < 3; i++) {
      const b = new T.Group();
      b.add(solid(badgeGeo, 0x161205), wire(badgeGeo, colors[i], 0.9));
      g.add(b);
      badges.push(b);
    }

    return {
      group: g,
      update(t, p) {
        rings.forEach((r, idx) => {
          r.rotation.z = t * 0.2 * (idx % 2 === 0 ? 1 : -1);
          r.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.5 + idx) * 0.15;
        });

        badges.forEach((b, idx) => {
          const angle = t * 0.3 + (idx * Math.PI * 2) / 3;
          const rad = 22;
          b.position.set(Math.cos(angle) * rad, Math.sin(t * 0.7 + idx) * 3, Math.sin(angle) * rad);
          b.lookAt(0, 0, 0);
        });
      },
      mod: (p) => ({ dx: 0, dy: 1, dz: 64 - 78 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // LAYER 02: ACADEMIC FULL-STACK & MOBILE (Flutter & Next.js)
  // ============================================================
  function buildAcademicWeb() {
    const g = new T.Group();
    const AC = 0x00d2ff;

    // Floating mobile device frame (Flutter CozyNest)
    const phone = new T.Group();
    const phoneGeo = new T.BoxGeometry(10, 20, 1.2);
    phone.add(solid(phoneGeo, 0x050d18), wire(phoneGeo, AC, 0.85));
    phone.position.set(-6, 2, 4);
    phone.rotation.y = 0.25;
    g.add(phone);

    // Screen display plane inside device
    const screenGeo = new T.PlaneGeometry(8.4, 17.5);
    const screenMesh = new T.Mesh(screenGeo, new T.MeshBasicMaterial({
      color: 0x002b4d,
      transparent: true,
      opacity: 0.65
    }));
    screenMesh.position.z = 0.65;
    phone.add(screenMesh);

    // Database node cylinders (MongoDB & Relational Schema)
    const dbCluster = new T.Group();
    const dbGeo = new T.CylinderGeometry(3.6, 3.6, 2.4, 24);
    for (let i = 0; i < 3; i++) {
      const disk = new T.Group();
      disk.add(solid(dbGeo, 0x031826), wire(dbGeo, 0x00f5a0, 0.75));
      disk.position.set(10, (i - 1) * 4.5, -2);
      dbCluster.add(disk);
    }
    g.add(dbCluster);

    // Connecting data stream spline
    const splineGeo = new T.BufferGeometry().setFromPoints([
      new T.Vector3(-2, 2, 4),
      new T.Vector3(4, 5, 1),
      new T.Vector3(10, 2, -2)
    ]);
    const spline = new T.Line(splineGeo, new T.LineBasicMaterial({
      color: AC,
      transparent: true,
      opacity: 0.7
    }));
    g.add(spline);

    return {
      group: g,
      update(t, p) {
        phone.rotation.y = 0.25 + Math.sin(t * 0.8) * 0.12;
        phone.position.y = 2 + Math.sin(t * 1.1) * 0.8;
        dbCluster.rotation.y = -t * 0.2;
        dbCluster.position.y = Math.sin(t * 0.9 + 1) * 0.6;
      },
      mod: (p) => ({ dx: 0, dy: 0, dz: 64 - 78 * ease(p), df: 0 }),
    };
  }

  // ============================================================
  // 10 — LAYER 10: SYSTEM DIRECTORY (Roll Credits / Beacon)
  // ============================================================
  function buildFinale() {
    const g = new T.Group();
    const AC = 0xf4f6fa;

    // Deep Warp Starfield & Monolith
    const monoGeo = new T.BoxGeometry(6, 32, 6);
    const mono = new T.Group();
    mono.add(solid(monoGeo, 0x06080d), wire(monoGeo, 0x00f5a0, 0.85));
    mono.position.set(0, 6, -10);
    g.add(mono);

    const halo = glowSprite(0x00f5a0, 130, 0.4);
    halo.position.set(0, 8, -25);
    g.add(halo);

    return {
      group: g,
      update(t, p) {
        mono.rotation.y = t * 0.15;
      },
      mod: (p) => ({ dx: 0, dy: 1, dz: 70 - 80 * ease(p), df: 0 }),
    };
  }

  window.WORLD_BUILDERS = [
    buildHero,           // 00: The Reel (40k Particle Face Portrait)
    buildAcademic,       // 01: Academic Core (Parallel C++ & Relational DB)
    buildAcademicWeb,    // 02: Academic Full-Stack & Mobile (Flutter & Next.js)
    buildDiva,           // 03: Neural Frontier: Diva.ai (FYP)
    buildInternships,    // 04: Industry Telemetry (3 Enterprise Towers)
    buildClinic,         // 05: Healthcare Kernel (Clinic & Pharmacy OS)
    buildSketchToStack,  // 06: SKETCH2STACK: The Studio (Drafting Desk)
    buildPOS,            // 07: SKETCH2STACK: Transaction Engines (POS)
    buildWebAuto,        // 08: SKETCH2STACK: Client Platforms (Web)
    buildCerts,          // 09: Dedicated Verified Protocols (Golden Laurels)
    buildFinale          // 10: Dedicated System Directory (Beacon Monolith)
  ];
})();
