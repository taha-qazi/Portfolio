/* ————————————————————————————————
   TAHA BIN YOUSUF — MAIN (DIRECTOR)
   One continuous WebGL dolly shot through 10 stack layers.
   Manages camera, HUD, scroll telemetry, grain, audio, autoplay.
   ———————————————————————————————— */
(function () {
  "use strict";

  const T = window.THREE;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = (k) => k * k * (3 - 2 * k);

  const D = 420;               // distance between stations on Z
  const CAM_BACK = 62;         // camera rest distance from station
  let HOLD = 0.52;             // fraction of station spent holding (overridden on mobile)

  const canvas = document.getElementById("scene");
  const grainCanvas = document.getElementById("grain");
  const grainCtx = grainCanvas ? grainCanvas.getContext("2d") : null;
  const hudYear = document.getElementById("hud-year");
  const hudChapter = document.getElementById("hud-chapter");
  const hudProg = document.getElementById("hud-prog");
  const progressFill = document.getElementById("progress-fill");
  const dotsNav = document.getElementById("dots");
  const slate = document.getElementById("slate");

  const sections = Array.from(document.querySelectorAll("[data-scene]")).map((el) => ({
    el,
    label: el.dataset.label || "",
    year: el.dataset.year || "2023 → 2027",
    accent: el.dataset.accent || "#00f5a0",
    num: el.querySelector(".num"),
    top: 0,
    height: 1,
  }));

  const LAST = sections.length - 1;

  // Slate dismissal
  const slateDelay = REDUCED ? 100 : 2600;
  if (slate) {
    setTimeout(() => slate.classList.add("done"), slateDelay);
    setTimeout(() => slate.remove(), slateDelay + 1000);
  }

  // Three.js stage setup
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (err) {
    document.body.classList.add("no3d");
    return;
  }
  renderer.setClearColor(0x07080b, 1);
  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x07080b, 0.0024);
  const camera = new T.PerspectiveCamera(55, 1, 0.1, 1600);

  // Position sets along the track (11 stations matching all 11 layers)
  const SIDE_DESKTOP = [0, 24, 22, 24, 20, 24, 24, 22, 22, 22, 0];
  let sides = SIDE_DESKTOP.slice();

  const chapters = window.WORLD_BUILDERS.map((build, i) => {
    const ch = build();
    ch.group.position.set(sides[i] || 0, 0, -i * D);
    scene.add(ch.group);
    return ch;
  });

  // Track dust ambient particles
  (function addTrackDust() {
    const pos = [];
    for (let i = 0; i < 1600; i++) {
      pos.push(
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 220,
        150 - Math.random() * (9 * D + 400)
      );
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    scene.add(new T.Points(geo, new T.PointsMaterial({
      color: 0x00f5a0, size: 1.1, transparent: true, opacity: 0.3, depthWrite: false
    })));
  })();

  // Floating geometric wireframe shards
  const shards = new T.Group();
  (function addShards() {
    const geos = [
      new T.OctahedronGeometry(1.8, 0),
      new T.TetrahedronGeometry(2.0, 0),
      new T.BoxGeometry(1.8, 1.8, 1.8),
    ];
    const mat = new T.LineBasicMaterial({ color: 0x8893a7, transparent: true, opacity: 0.28 });
    for (let i = 0; i < 110; i++) {
      const seg = Math.floor(Math.random() * 9);
      const off = 0.2 + Math.random() * 0.6;
      const m = new T.LineSegments(new T.EdgesGeometry(geos[i % 3]), mat);
      const side = Math.random() < 0.5 ? -1 : 1;
      m.position.set(side * (24 + Math.random() * 140), (Math.random() - 0.5) * 160, -(seg + off) * D);
      shards.add(m);
    }
    scene.add(shards);
  })();

  // Warp streaks flare mid-flight during travel between stations
  let streaks;
  (function addStreaks() {
    const geo = new T.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 28 + Math.random() * 90;
      const x = Math.cos(a) * rad;
      const y = Math.sin(a) * rad;
      const z0 = (Math.random() - 0.5) * 80;
      pos.push(x, y, z0, x, y, z0 - 45 - Math.random() * 60);
    }
    geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    streaks = new T.LineSegments(
      geo,
      new T.LineBasicMaterial({ color: 0x00f5a0, transparent: true, opacity: 0 })
    );
    scene.add(streaks);
  })();

  // Mouse parallax
  let mx = 0, my = 0, mxS = 0, myS = 0;
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / W - 0.5) * 2;
    my = (e.clientY / H - 0.5) * 2;
  }, { passive: true });

  // Sizing and responsive measurement
  let W = 0, H = 0, docH = 1, isMobile = false;
  let aspectComp = 0;

  function measure() {
    W = window.innerWidth;
    H = window.innerHeight;
    docH = document.documentElement.scrollHeight;
    isMobile = W <= 900 || ("ontouchstart" in window && W <= 1024);
    window._cachedIsMob = W <= 860 || (W / Math.max(1, H) < 0.9);
    HOLD = isMobile ? 0.28 : 0.52;
    aspectComp = isMobile ? 18 : (W < 1100 ? 8 : 0);
    renderer.setPixelRatio(Math.min(isMobile ? 1.4 : 1.75, window.devicePixelRatio || 1));
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();

    if (grainCanvas) {
      grainCanvas.width = Math.max(1, Math.floor(W / 3));
      grainCanvas.height = Math.max(1, Math.floor(H / 3));
    }

    sides = isMobile ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : SIDE_DESKTOP.slice();
    chapters.forEach((ch, i) => { 
      ch.group.position.x = sides[i] || 0; 
      if (i !== 0) ch.group.position.y = isMobile ? 18 : 0;
    });

    sections.forEach((s) => {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + window.scrollY;
      s.height = r.height;
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 100);
  }, { passive: true });
  window.addEventListener("load", measure);
  if (document.fonts) document.fonts.ready.then(measure);

  // Navigation dots
  if (dotsNav) {
    dotsNav.innerHTML = "";
    sections.forEach((s, idx) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (idx === 0 ? " active" : "");
      dot.setAttribute("aria-label", s.label);
      dot.addEventListener("click", () => {
        window.scrollTo({ top: s.top, behavior: "smooth" });
      });
      dotsNav.appendChild(dot);
    });
  }


  // Audio system
  const bgMusic = document.getElementById("bg-music");
  const muteBtn = document.getElementById("mute-btn");
  let audioStarted = false;

  function toggleAudio() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        audioStarted = true;
        if (muteBtn) muteBtn.classList.remove("muted");
      }).catch(() => {});
    } else {
      bgMusic.pause();
      if (muteBtn) muteBtn.classList.add("muted");
    }
  }
  if (muteBtn) {
    muteBtn.addEventListener("click", toggleAudio);
  }

  // User interaction starts audio seamlessly
  function initAudioOnInteraction() {
    if (!audioStarted && bgMusic && bgMusic.paused) {
      bgMusic.volume = 0.55;
      bgMusic.play().then(() => {
        audioStarted = true;
        if (muteBtn) muteBtn.classList.remove("muted");
      }).catch(() => {});
    }
  }
  window.addEventListener("click", initAudioOnInteraction, { once: true });
  window.addEventListener("scroll", initAudioOnInteraction, { once: true, passive: true });
  window.addEventListener("touchstart", initAudioOnInteraction, { once: true, passive: true });

  // Autoplay smooth cruise
  const autoplayBtn = document.getElementById("autoplay-btn");
  let isAutoplaying = false;
  let autoSpeed = 4.4;

  if (autoplayBtn) {
    autoplayBtn.addEventListener("click", () => {
      isAutoplaying = !isAutoplaying;
      autoplayBtn.classList.toggle("active", isAutoplaying);
      const playIcon = autoplayBtn.querySelector(".play-icon");
      const pauseIcon = autoplayBtn.querySelector(".pause-icon");
      if (playIcon && pauseIcon) {
        playIcon.style.display = isAutoplaying ? "none" : "";
        pauseIcon.style.display = isAutoplaying ? "" : "none";
      }
      if (isAutoplaying && bgMusic && bgMusic.paused) {
        initAudioOnInteraction();
      }
    });
  }

  // Grain generator
  function renderGrain() {
    if (!grainCtx) return;
    const gw = Math.floor(grainCanvas.width);
    const gh = Math.floor(grainCanvas.height);
    if (gw <= 0 || gh <= 0) return; // Prevent IndexSizeError
    const imgData = grainCtx.createImageData(gw, gh);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 22;
    }
    grainCtx.putImageData(imgData, 0, 0);
  }

  measure();

  // Master Director Loop
  let smoothY = 0;
  let activeIndex = -1;
  let frame = 0;
  const t0 = performance.now();

  function tick(now) {
    const t = REDUCED ? 0 : (now - t0) * 0.001;
    const y = window.scrollY;
    smoothY = Math.abs(y - smoothY) < 0.1 ? y : lerp(smoothY, y, 0.1);

    // Autoplay scroll step
    if (isAutoplaying) {
      const step = isMobile ? 8.0 : 4.4;
      window.scrollBy(0, step);
      if (window.scrollY >= docH - H - 4) isAutoplaying = false;
    }

    // Identify active chapter and local progress through that chapter
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (smoothY >= sections[i].top - 1) idx = i;
    }
    const s = sections[idx];
    const denom = Math.max(1, s.height - H);
    const p = clamp01((smoothY - s.top) / denom);

    // Hold on set while reading, then smooth travel to next station
    const holdP = clamp01(p / HOLD);
    const travel = idx >= LAST ? 0 : smooth(clamp01((p - HOLD) / (1 - HOLD)));
    const u = idx + travel;

    // Camera choreography: current chapter's move blended into the next
    const modA = chapters[idx].mod(REDUCED ? 1 : holdP, t);
    const modB = chapters[Math.min(idx + 1, LAST)].mod(0, t);
    const k = travel;
    const dx = lerp(modA.dx, modB.dx, k);
    const dy = lerp(modA.dy, modB.dy, k);
    const dz = lerp(modA.dz, modB.dz, k);
    const df = lerp(modA.df, modB.df, k);

    mxS = lerp(mxS, mx, 0.04);
    myS = lerp(myS, my, 0.04);

    camera.position.set(
      dx + mxS * 2.6,
      dy - myS * 1.8,
      -u * D + CAM_BACK + dz + aspectComp
    );
    const kick = Math.sin(travel * Math.PI);
    const lookX = lerp(sides[idx], sides[Math.min(idx + 1, LAST)], k) * 0.45;
    camera.lookAt(lookX + dx * 0.4 + mxS * 4, dy * 0.5 - myS * 2.5, camera.position.z - 150);
    camera.rotateZ(Math.sin(u * 2.1) * 0.012 + kick * 0.034);
    camera.fov = 55 + df + kick * 10;
    camera.updateProjectionMatrix();

    // Hero typography choreography: --hp drains name to outline as camera zooms into face
    const hp = idx === 0 ? smooth(clamp01((p - 0.04) / 0.5)) : 1;
    document.documentElement.style.setProperty("--hp", hp.toFixed(3));

    // Floating debris & speed streaks
    for (const m of shards.children) {
      if (Math.abs(m.position.z - camera.position.z) > 700) continue;
      m.rotation.x = t * m.userData.rs;
      m.rotation.y = t * m.userData.rs * 1.4;
      m.position.y = m.userData.by + Math.sin(t * 0.4 + m.userData.bob) * 4;
    }
    if (streaks) {
      streaks.visible = kick > 0.03 && !REDUCED;
      if (streaks.visible) {
        streaks.position.set(camera.position.x, camera.position.y, camera.position.z - 70);
        streaks.scale.z = 1 + kick * 4.5;
        streaks.material.opacity = kick * 0.22;
      }
    }

    // Run and render only sets near the camera for 60fps performance
    for (let i = 0; i < chapters.length; i++) {
      const near = Math.abs(i - u) < 1.6;
      chapters[i].group.visible = near;
      if (near) {
        const si = sections[i];
        const pi = clamp01((smoothY - si.top) / Math.max(1, si.height - H));
        chapters[i].update(t, REDUCED ? 1 : pi);
      }
    }

    renderer.render(scene, camera);

    // HUD & Navigation state
    if (idx !== activeIndex) {
      activeIndex = idx;
      if (hudChapter) hudChapter.textContent = s.label;
      document.documentElement.style.setProperty("--accent", s.accent);
      const dots = dotsNav ? dotsNav.querySelectorAll(".dot") : [];
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      sections.forEach((sec, i) => sec.el.classList.toggle("active", i === idx));
    }
    if (s.num) s.num.style.setProperty("--py", ((0.5 - p) * 130).toFixed(1) + "px");

    const total = clamp01(y / Math.max(1, docH - H));
    if (hudProg) hudProg.textContent = String(Math.round(total * 100)).padStart(3, "0");
    if (progressFill) progressFill.style.width = (total * 100).toFixed(2) + "%";

    if (!REDUCED && frame % 4 === 0) renderGrain();
    frame++;
    requestAnimationFrame(tick);
  }

  renderGrain();
  requestAnimationFrame(tick);
})();
