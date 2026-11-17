/* Room reader: walk into a location, record the room, its windows and light sources (direction, color, brightness),
   draw an overhead layout, and get recommendations and lighting layouts built from Cam's own kit.
   Everything is saved on the phone (localStorage via FG.state) and works with no signal. */
(function () {
  "use strict";
  const R = {};
  const esc = (t) => window.FG.esc(t);
  const units = () => window.FG.units();
  const FT = 3.28084;
  const toU = (m) => (units() === "metric" ? m : m * FT);
  const fromU = (v) => (units() === "metric" ? v : v / FT);
  const uLabel = () => (units() === "metric" ? "m" : "ft");
  const f1 = (x) => (Math.round(x * 10) / 10).toString();
  const uid = () => Math.random().toString(36).slice(2, 9);
  const mired = (k) => 1e6 / k;
  const compassName = (a) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round((((a % 360) + 360) % 360) / 45) % 8];
  const deg = Math.PI / 180;

  /* ---------- data ---------- */
  const KINDS = {
    window: { label: "Window", onWall: true, k: 5600, w: 1.0 },
    door: { label: "Door or opening", onWall: true, k: 5600, w: 0.9 },
    practical: { label: "Practical lamp", onWall: false, k: 2700 },
    overhead: { label: "Overhead light", onWall: false, k: 3500 },
    screen: { label: "TV or screen", onWall: false, k: 6500 },
    other: { label: "Other source", onWall: false, k: 4000 }
  };
  const KPRESETS = [["Direct sun", 5600], ["Daylight window, sky", 6000], ["Overcast or shade", 7000], ["Golden hour sun", 3500],
    ["Household lamp", 2700], ["Warm LED bulb", 3000], ["Neutral LED or fluorescent", 4000], ["Cool LED or office tube", 5000], ["TV or phone screen", 6500]];
  const LEVELS = [["off", "Off"], ["dim", "Dim"], ["medium", "Medium"], ["bright", "Bright"], ["vbright", "Very bright (direct sun)"]];
  const LEVEL_RANK = { off: 0, dim: 1, medium: 2, bright: 3, vbright: 4 };
  const LOOKS = { natural: "Natural", highkey: "High key, bright and soft", lowkey: "Low key, moody", night: "Night" };
  const WALLS = ["A", "B", "C", "D"];

  function rooms() { const S = window.FG.state(); S.rooms = S.rooms || []; return S.rooms; }
  function getRoom(id) { return rooms().find((r) => r.id === id); }
  function save() { window.FG.save(); }
  function newRoom() {
    const now = new Date();
    const r = { id: uid(), name: "New room", project: "", created: now.toISOString().slice(0, 10), w: 4.5, l: 5.5, h: 2.6, headingA: null,
      look: "natural", notes: "", inside: true, date: now.toISOString().slice(0, 10), start: "09:00", end: "13:00", lat: null, lon: null,
      cam: { iso: 800, fps: 24, angle: 180, stop: 2.8 }, sources: [], subject: { x: 0.5, y: 0.45 }, camera: { x: 0.5, y: 0.85 } };
    rooms().push(r); save(); return r;
  }

  /* ---------- geometry: room plan in meters, x right (wall D to B), y down (wall A to C) ---------- */
  // Outward direction of each wall in plan space (unit vectors) and its compass heading if wall A's heading is known.
  const WALL_N = { A: [0, -1], B: [1, 0], C: [0, 1], D: [-1, 0] };
  function wallHeading(r, wall) { return r.headingA == null ? null : (r.headingA + { A: 0, B: 90, C: 180, D: 270 }[wall]) % 360; }
  // Point on a wall at fraction t, measured left to right as you face that wall from inside the room.
  function wallPoint(r, wall, t) {
    if (wall === "A") return [t * r.w, 0];
    if (wall === "B") return [r.w, t * r.l];
    if (wall === "C") return [(1 - t) * r.w, r.l];
    return [0, (1 - t) * r.l];
  }
  function srcPos(r, s) { return KINDS[s.kind].onWall ? wallPoint(r, s.wall, s.pos) : [s.x * r.w, s.y * r.l]; }
  // Plan angle (0 = toward wall A, clockwise) to compass heading
  function planToHeading(r, ang) { return r.headingA == null ? null : (r.headingA + ang + 360) % 360; }
  function headingToPlan(r, hd) { return r.headingA == null ? null : (hd - r.headingA + 360) % 360; }
  const vec = (a) => [Math.sin(a * deg), -Math.cos(a * deg)]; // plan angle -> unit vector (0 points to wall A)
  const angOf = (v) => (Math.atan2(v[0], -v[1]) / deg + 360) % 360;
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

  /* ---------- sun on windows ---------- */
  function sunWindows(r) {
    if (r.lat == null || r.lon == null || r.headingA == null || !window.FG_MATH) return {};
    const out = {};
    const [y, mo, d] = r.date.split("-").map(Number);
    const t0 = (r.start || "06:00").split(":").map(Number), t1 = (r.end || "20:00").split(":").map(Number);
    r.sources.filter((s) => KINDS[s.kind].onWall).forEach((s) => {
      const h = wallHeading(r, s.wall); let runs = [], cur = null;
      for (let m = t0[0] * 60 + t0[1]; m <= t1[0] * 60 + t1[1]; m += 10) {
        const when = new Date(y, mo - 1, d, Math.floor(m / 60), m % 60), p = window.FG_MATH.sunPos(when, r.lat, r.lon);
        const off = Math.abs(((p.az - h + 540) % 360) - 180);
        const hit = p.el > 2 && p.el < 70 && off < 80;
        if (hit && !cur) cur = { from: when }; if (hit) cur.to = when;
        if (!hit && cur) { runs.push(cur); cur = null; }
      }
      if (cur) runs.push(cur);
      out[s.id] = runs;
    });
    return out;
  }
  const hm = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  function sunAt(r, timeStr) {
    if (r.lat == null || r.lon == null || !window.FG_MATH) return null;
    const [y, mo, d] = r.date.split("-").map(Number), [hh, mm] = (timeStr || r.start || "12:00").split(":").map(Number);
    return window.FG_MATH.sunPos(new Date(y, mo - 1, d, hh, mm), r.lat, r.lon);
  }

  /* ---------- notes from the hub (or typed): read the look ---------- */
  function readNotes(text) {
    const t = String(text || "").toLowerCase(), has = (...w) => w.some((x) => t.includes(x));
    return {
      night: has("night", "nite", "after dark", "moonlight", "midnight"),
      lowkey: has("moody", "dark", "noir", "horror", "thriller", "tense", "menacing", "shadow", "ominous", "dramatic"),
      highkey: has("bright", "airy", "clean", "commercial", "beauty", "upbeat", "fresh", "product"),
      natural: has("natural", "documentary", "real", "naturalistic", "available light"),
      warm: has("warm", "golden", "cozy", "candle", "fire", "sunset", "amber"),
      cool: has("cold", "cool", "blue", "clinical", "steel", "winter", "dawn"),
      practicals: has("lamp", "practical", "candle", "neon", "tv", "screen"),
      ext: /\bext\b|exterior|outside/.test(t), int: /\bint\b|interior|inside/.test(t)
    };
  }
  function lookFromNotes(r) {
    const n = readNotes(r.notes);
    if (n.night) return "night"; if (n.lowkey) return "lowkey"; if (n.highkey) return "highkey"; if (n.natural) return "natural";
    return null;
  }

  /* ---------- light math (same constants as the light-level tool) ---------- */
  const C = 250;
  function luxFor(N, iso, t) { return (N * N * C) / (iso * t); }
  function stopsBetween(a, b) { return Math.log2((b * b) / (a * a)); }

  // Reference lights, from the planner's numbers for the matching setups (ISO 800, 1/50, T2.8 unless noted).
  const REF = {
    softKey: { fixture: "Aputure LS 600d", mod: "Light Dome III, both diffusers", d: 1.8, p: 4, N: 2.8, setup: "commercial-rim" },
    softKey200: { fixture: "amaran 200x S", mod: "Light Dome III, both diffusers", d: 1.7, p: 12, N: 2.8, setup: "three-point" },
    gridKey: { fixture: "amaran 200x S", mod: "Light Dome III, both diffusers and the grid", d: 1.6, p: 19, N: 2.8, setup: "rembrandt" },
    book: { fixture: "Aputure LS 600d", mod: "Hyper Reflector, bounced into a white 5-in-1, through grid cloth or the Fast Flags silk", d: 1.8, p: 5, N: 2.0, setup: "book-light" },
    rim: { fixture: "Nanlite PavoTube II 30C", mod: "Bare tube", d: 1.4, p: 18, N: 2.8, setup: "commercial-rim" },
    fill: { fixture: "Nanlite PavoSlim 120C", mod: "Softbox", d: 2.0, p: 4, N: 2.8, setup: "three-point" },
    nightKey: { fixture: "amaran 200x S", mod: "Light Dome III, both diffusers and the grid", d: 1.3, p: 10, N: 2.8, setup: "night-practical" },
    kicker: { fixture: "Aputure MC", mod: "Bare", d: 1.4, p: 40, N: 2.8, setup: "night-practical" },
    sunTool: { fixture: "Aputure LS 600d", mod: "Hyper Reflector or the FL-20G Fresnel, through the window", d: 2.6, p: 3, N: 4.0, setup: "cookie-branch" }
  };
  // Scale a reference level to a new distance, stop and ISO: inverse square plus the exposure change.
  function level(ref, d, r) {
    const iso = r.cam.iso || 800, N = r.cam.stop || 2.8;
    const p = ref.p * Math.pow(d / ref.d, 2) * Math.pow(N / ref.N, 2) * (800 / iso);
    return p;
  }
  function levelText(p) {
    if (p > 100) return `more than full power (${Math.round(p)}%): move it closer, open up or raise ISO`;
    if (p < 1) return "under 1%: move it farther away or add diffusion";
    return `about ${p < 10 ? f1(p) : Math.round(p)}%`;
  }

  /* ---------- analysis ---------- */
  function analyze(r) {
    const on = r.sources.filter((s) => s.level !== "off");
    const S = [r.subject.x * r.w, r.subject.y * r.l], Cm = [r.camera.x * r.w, r.camera.y * r.l];
    const sun = sunWindows(r);
    const score = (s) => (s.stop ? 10 + Math.log2(s.stop * s.stop) : LEVEL_RANK[s.level] || 0) + ((sun[s.id] || []).length ? 3 : 0) + (KINDS[s.kind].onWall ? 0.5 : 0);
    const ranked = on.slice().sort((a, b) => score(b) - score(a));
    const look = r.look || lookFromNotes(r) || "natural";
    const notes = readNotes(r.notes);
    // the motivator: brightest source, or a practical for night looks
    let M = ranked[0] || null;
    if (look === "night") M = on.find((s) => s.kind === "practical") || on.find((s) => s.kind === "screen") || M;
    const recs = [];
    const toCam = angOf([Cm[0] - S[0], Cm[1] - S[1]]);
    // 1. motivation and key direction
    if (M) {
      const P = srcPos(r, M), a = angOf([P[0] - S[0], P[1] - S[1]]), rel = ((a - toCam + 540) % 360) - 180, ab = Math.abs(rel);
      const side = rel < 0 ? "camera left" : "camera right";
      const where = ab < 25 ? "almost straight from camera (flat)" : ab < 70 ? `about ${Math.round(ab / 5) * 5}° ${side} (good modeling)` : ab < 110 ? `from the side, ${side} (split, dramatic)` : `from behind the actor, ${side} (a rim, not a key)`;
      recs.push({ t: "Your motivating source", b: `${esc(srcName(r, M))} reaches the actor ${where}, ${dist(P, S) < 0.1 ? "" : `${f1(toU(dist(P, S)))} ${uLabel()} away`}. Build the key from that direction so the light makes sense in the room.` });
      if (ab < 25) recs.push({ t: "Turn the actor or move the camera", b: "With the source behind the camera the face goes flat. Rotate the setup so the source lands 30 to 60 degrees off the lens, and shoot toward the shadow side of the face (short side)." });
      if (ab > 110) recs.push({ t: "Use the window as a back light", b: "It's behind the actor. Let it rim the hair and shoulders, and key the face from the same side, farther forward (layout 1 below)." });
      if (notes.warm && KINDS[M.kind].onWall) recs.push({ t: "Your notes call for warmth", b: "Keep your lights matched to the window, and warm the whole frame by setting the camera's white balance higher than the light (for example 6500K on 5600K light). Let any lamp in frame read warm on its own." });
    } else {
      recs.push({ t: "No usable source yet", b: "Add the windows and lights you see, or start from the book light: soft, motivated by nothing in particular, and safe in any room." });
    }
    // 2. color
    if (M) {
      const mk = M.k || KINDS[M.kind].k;
      const clash = on.filter((s) => s !== M && s.kind !== "overhead" && Math.abs(mired(s.k || KINDS[s.kind].k) - mired(mk)) >= 40);
      clash.forEach((s) => {
        const sk = s.k || KINDS[s.kind].k, warm = mired(sk) > mired(mk);
        recs.push({ t: `Color clash: ${esc(srcName(r, s))}`, b: `${sk}K against your ${mk}K motivator. Turn it off if it isn't in the shot. If it is, ${warm ? "let it read warm as a practical, or gel it with CTB from your Rosco kit" : "gel it with CTO from your Rosco kit, or swap in the B7c bulb set to " + mk + "K"}.` });
      });
      const ov = on.filter((s) => s.kind === "overhead");
      if (ov.length) recs.push({ t: "Kill the overheads", b: "Overhead room lights hit from straight above, put dark sockets under the eyes and are rarely the right color. Turn them off and add back only what the frame needs." });
      recs.push({ t: "White balance", b: look === "night" ? `Set the camera around 4300K so the ${mk}K practical reads warm and the rest falls cool, like the night setup.` : `Set the camera to ${Math.round(mk / 100) * 100}K to match your motivator, and match your lights to it.` });
    }
    // 3. exposure, from meter readings if any
    const target = luxFor(r.cam.stop, r.cam.iso, r.cam.angle / 360 / r.cam.fps);
    const readings = on.filter((s) => s.stop);
    if (readings.length) {
      readings.forEach((s) => {
        const diff = stopsBetween(r.cam.stop, s.stop);
        const txt = Math.abs(diff) < 0.4 ? "right at your stop" : diff > 0 ? `${f1(diff)} stops over your T${r.cam.stop}` : `${f1(-diff)} stops under your T${r.cam.stop}`;
        recs.push({ t: `${esc(srcName(r, s))} reads T${s.stop}`, b: `That's ${txt} at ISO ${r.cam.iso}.${diff > 1.5 && KINDS[s.kind].onWall ? " Your ND 1.2 gel on the window takes 4 stops off, or use the 6K Pro's built-in ND." : diff < -1 ? " Add your key, or use it only as fill." : ""}` });
      });
    } else recs.push({ t: "Take readings", b: `For T${r.cam.stop} at ISO ${r.cam.iso} you want about ${Math.round(target)} lux at the face. Use Read on each source to see how close the room already is.` });
    // 4. sun
    Object.entries(sun).forEach(([id, runs]) => {
      const s = r.sources.find((x) => x.id === id); if (!s) return;
      if (runs.length) recs.push({ t: `Sun through ${esc(srcName(r, s))}`, b: `Direct sun ${runs.map((x) => hm(x.from) + " to " + hm(x.to)).join(", ")} during your shoot window. The patch moves and changes brightness. Diffuse the window with Opal Frost 410 or grid cloth, or block those shots around it.` });
    });
    if (notes.ext && r.inside) recs.push({ t: "Your notes mention an exterior", b: "Check the scene in the hub: if it plays outside, use the Sun tool for the shoot window instead of this room." });
    return { look, M, S, Cm, toCam, recs, options: layouts(r, look, M, S, Cm, toCam, notes) };
  }

  function srcName(r, s) { return s.name || (KINDS[s.kind].label + (KINDS[s.kind].onWall ? " on wall " + s.wall : "")); }

  /* ---------- lighting layouts ---------- */
  function place(S, ang, d) { const v = vec(ang); return [S[0] + v[0] * d, S[1] + v[1] * d]; }
  function clampIn(r, p) { return [Math.max(0.2, Math.min(r.w - 0.2, p[0])), Math.max(0.2, Math.min(r.l - 0.2, p[1]))]; }
  function lightRow(r, S, label, ref, ang, d, k, extra) {
    let P = clampIn(r, place(S, ang, d)); const dd = Math.max(0.6, dist(P, S));
    return { label, fixture: ref.fixture, mod: ref.mod, pos: P, d: dd, k, p: level(ref, dd, r), setup: ref.setup, extra: extra || "" };
  }
  function layouts(r, look, M, S, Cm, toCam, notes) {
    const out = [];
    let side = 1, mk = 5600;
    if (M) { const P = srcPos(r, M); const a = angOf([P[0] - S[0], P[1] - S[1]]); side = (((a - toCam + 540) % 360) - 180) < 0 ? -1 : 1; mk = M.k || KINDS[M.kind].k; }
    const keyAng = (toCam + side * 45 + 360) % 360, fillAng = (toCam - side * 60 + 360) % 360, rimAng = (toCam + 180 - side * 35 + 360) % 360;
    const negAng = (toCam - side * 90 + 360) % 360;
    const neg = { label: "Negative fill", fixture: "24x36 floppy or the Fast Flags black block", mod: "on a C-stand", pos: clampIn(r, place(S, negAng, 0.8)), d: 0.8, k: null, p: null, extra: "Just out of frame on the shadow side." };
    const warmK = mk;
    if (look !== "night") {
      const o = { name: M && KINDS[M.kind].onWall ? `Motivated by ${srcName(r, M)}` : "Soft key, motivated", setup: look === "lowkey" ? "rembrandt" : "commercial-rim", lights: [] };
      o.lights.push(lightRow(r, S, "Key", look === "lowkey" ? REF.gridKey : REF.softKey, keyAng, look === "lowkey" ? 1.6 : 1.8, warmK, "Same side as your motivating source."));
      if (look === "highkey") o.lights.push(lightRow(r, S, "Fill", REF.fill, fillAng, 2.0, warmK, "Or a white 5-in-1 bounce instead."));
      else o.lights.push(neg);
      if (look !== "highkey" || true) o.lights.push(lightRow(r, S, "Back light", REF.rim, rimAng, 1.4, warmK, "Separates hair and shoulders from the background."));
      o.why = look === "lowkey" ? "A gridded key with no fill keeps the shadow side dark, like the Rembrandt setup." : look === "highkey" ? "A big soft key with fill keeps contrast low and the frame bright." : "One big soft source from the motivated side, negative fill opposite, and a touch of back light.";
      out.push(o);
    }
    if (look !== "night") {
      const b = { name: "Book light", setup: "book-light", lights: [lightRow(r, S, "Book light", REF.book, keyAng, 1.8, warmK, "The 600d aims into the bounce, and the bounce lights the actor through the diffusion."), neg] };
      b.why = "The softest wrap you can make with your kit. Good when the window is weak or the room is dark.";
      out.push(b);
    }
    if (M && KINDS[M.kind].onWall && look !== "night") {
      const P = srcPos(r, M), outA = angOf([P[0] - S[0], P[1] - S[1]]);
      out.push({ name: "Push the window", setup: "cookie-branch", why: "Put the 600d outside, aimed in through the window, so the daylight look holds all day. Diffuse the window with Opal Frost 410 or grid cloth.",
        lights: [Object.assign(lightRow(r, S, "Sun through the window", REF.sunTool, outA, dist(P, S) + 1.5, 5600, "Outside the window. Set it before the real sun moves."), { pos: P }), neg] });
    }
    if (look === "night" || notes.practicals) {
      const pr = M && (M.kind === "practical" || M.kind === "screen") ? M : null;
      const kAng = pr ? angOf([srcPos(r, pr)[0] - S[0], srcPos(r, pr)[1] - S[1]]) : keyAng;
      out.push({ name: pr ? `Night, motivated by ${srcName(r, pr)}` : "Night practical", setup: "night-practical", why: "A low, warm key that plays the lamp, a kicker to edge the face, and the camera at 4300K so the room falls blue.",
        lights: [lightRow(r, S, "Key (plays the lamp)", REF.nightKey, kAng, 1.3, 3000, "From the lamp's side, just out of frame."), lightRow(r, S, "Kicker", REF.kicker, rimAng, 1.4, 3200, ""),
          { label: "Practical", fixture: "Your B7c in the lamp", mod: "Shade", pos: pr ? srcPos(r, pr) : clampIn(r, place(S, kAng, 1.0)), d: 1, k: 2700, p: null, extra: "Dim it until the shade isn't clipping." }] });
    }
    return out.slice(0, 3);
  }

  /* ---------- drawing ---------- */
  function kToRgb(k) {
    const t = k / 100; let r, g, b;
    if (t <= 66) { r = 255; g = 99.47 * Math.log(t) - 161.12; b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04; }
    else { r = 329.7 * Math.pow(t - 60, -0.1332); g = 288.12 * Math.pow(t - 60, -0.0755); b = 255; }
    const c = (x) => Math.max(0, Math.min(255, Math.round(x)));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
  }
  function plan(r, opt, interactive) {
    const W = 340, pad = 34, sc = Math.min((W - 2 * pad) / r.w, (W - 2 * pad) / r.l), w = r.w * sc, l = r.l * sc, ox = (W - w) / 2, oy = pad;
    const H = l + 2 * pad, X = (x) => ox + x * sc, Y = (y) => oy + y * sc;
    let s = `<svg class="roomplan" viewBox="0 0 ${W} ${H}" data-sc="${sc}" data-ox="${ox}" data-oy="${oy}" xmlns="http://www.w3.org/2000/svg">`;
    s += `<rect x="${ox}" y="${oy}" width="${w}" height="${l}" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>`;
    WALLS.forEach((wl) => {
      const hd = wallHeading(r, wl), mid = { A: [ox + w / 2, oy - 12], B: [ox + w + 14, oy + l / 2], C: [ox + w / 2, oy + l + 22], D: [ox - 14, oy + l / 2] }[wl];
      s += `<text x="${mid[0]}" y="${mid[1]}" text-anchor="middle" font-size="11" fill="var(--ink-3)" ${wl === "B" || wl === "D" ? `transform="rotate(${wl === "B" ? 90 : -90} ${mid[0]} ${mid[1]})"` : ""}>Wall ${wl}${hd != null ? " · faces " + compassName(hd) : ""}</text>`;
    });
    if (r.headingA != null) { // north arrow
      const a = headingToPlan(r, 0), v = vec(a), cx = W - 22, cy = 20;
      s += `<g><circle cx="${cx}" cy="${cy}" r="13" fill="none" stroke="var(--line)"/><line x1="${cx}" y1="${cy}" x2="${cx + v[0] * 11}" y2="${cy + v[1] * 11}" stroke="var(--bad)" stroke-width="2.5"/><text x="${cx + v[0] * 20}" y="${cy + v[1] * 20 + 4}" text-anchor="middle" font-size="10" fill="var(--bad)" font-weight="700">N</text></g>`;
    }
    const sun = sunAt(r);
    if (sun && sun.el > 0 && r.headingA != null) { const a = headingToPlan(r, sun.az), v = vec(a), cx = 22, cy = 20;
      s += `<g><circle cx="${cx + v[0] * 10}" cy="${cy + v[1] * 10}" r="6" fill="var(--tungsten)"/><line x1="${cx + v[0] * 10}" y1="${cy + v[1] * 10}" x2="${cx - v[0] * 8}" y2="${cy - v[1] * 8}" stroke="var(--tungsten)" stroke-width="2"/></g>`; }
    r.sources.forEach((src) => {
      const K = KINDS[src.kind], col = src.level === "off" ? "var(--line)" : kToRgb(src.k || K.k), lab = `${src.k || K.k}K${src.stop ? " T" + src.stop : src.level ? " " + (LEVELS.find((x) => x[0] === src.level) || ["", ""])[1].split(" ")[0] : ""}`;
      if (K.onWall) {
        const half = (src.width || K.w) / 2 / (src.wall === "A" || src.wall === "C" ? r.w : r.l);
        const p1 = wallPoint(r, src.wall, Math.max(0, src.pos - half)), p2 = wallPoint(r, src.wall, Math.min(1, src.pos + half)), m = wallPoint(r, src.wall, src.pos), n = WALL_N[src.wall];
        s += `<line x1="${X(p1[0])}" y1="${Y(p1[1])}" x2="${X(p2[0])}" y2="${Y(p2[1])}" stroke="${col}" stroke-width="${src.kind === "door" ? 5 : 8}" ${src.kind === "door" ? 'stroke-dasharray="4 3"' : ""}/>`;
        s += `<text x="${X(m[0]) - n[0] * 16}" y="${Y(m[1]) - n[1] * 16 + 4}" text-anchor="middle" font-size="10" fill="var(--ink)">${esc(lab)}</text>`;
      } else {
        const p = srcPos(r, src);
        s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="7" fill="${col}" stroke="var(--ink)" stroke-width="1"/><text x="${X(p[0])}" y="${Y(p[1]) - 11}" text-anchor="middle" font-size="10" fill="var(--ink)">${esc(lab)}</text>`;
      }
    });
    if (opt) opt.lights.forEach((L, i) => {
      const P = L.pos, S = [r.subject.x * r.w, r.subject.y * r.l];
      s += `<line x1="${X(P[0])}" y1="${Y(P[1])}" x2="${X(S[0])}" y2="${Y(S[1])}" stroke="var(--tungsten)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      s += L.p == null && /fill|floppy/i.test(L.fixture) ? `<rect x="${X(P[0]) - 9}" y="${Y(P[1]) - 4}" width="18" height="8" fill="#111"/>` : `<rect x="${X(P[0]) - 8}" y="${Y(P[1]) - 8}" width="16" height="16" rx="3" fill="${L.k ? kToRgb(L.k) : "var(--tungsten)"}" stroke="var(--ink)"/><text x="${X(P[0])}" y="${Y(P[1]) + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#000">${i + 1}</text>`;
    });
    const Sx = X(r.subject.x * r.w), Sy = Y(r.subject.y * r.l), Cx = X(r.camera.x * r.w), Cy = Y(r.camera.y * r.l);
    const ca = angOf([Sx - Cx, Sy - Cy]), cv = vec(ca);
    s += `<g transform="translate(${Cx} ${Cy}) rotate(${ca})"><path d="M-9,8 L9,8 L6,-6 L-6,-6 Z" fill="var(--ink)"/><path d="M-4,-6 L0,-14 L4,-6 Z" fill="var(--ink)"/></g>`;
    s += `<circle cx="${Sx}" cy="${Sy}" r="9" fill="var(--tungsten)" stroke="var(--ink)" stroke-width="1.5"/><text x="${Sx}" y="${Sy + 22}" text-anchor="middle" font-size="10" fill="var(--ink)">Actor</text>`;
    s += `<text x="${ox}" y="${H - 4}" font-size="10" fill="var(--ink-3)">${f1(toU(r.w))} x ${f1(toU(r.l))} ${uLabel()}${interactive ? " · tap to place the " + (interactive === "camera" ? "camera" : "actor") : ""}</text>`;
    return s + "</svg>";
  }

  /* ---------- quick compass reading ---------- */
  function readHeading(cb) {
    let got = [], done = false;
    function onOri(e) {
      let h = null;
      if (e.webkitCompassHeading != null) h = e.webkitCompassHeading; else if (e.absolute && e.alpha != null) h = (360 - e.alpha) % 360;
      if (h != null) got.push(h);
    }
    try { if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().catch(() => {}); } catch (e) { /* ignore */ }
    window.addEventListener("deviceorientationabsolute", onOri); window.addEventListener("deviceorientation", onOri);
    setTimeout(() => {
      if (done) return; done = true;
      window.removeEventListener("deviceorientationabsolute", onOri); window.removeEventListener("deviceorientation", onOri);
      if (!got.length) return cb(null);
      const sx = got.reduce((a, h) => a + Math.sin(h * deg), 0), cx = got.reduce((a, h) => a + Math.cos(h * deg), 0);
      cb((Math.atan2(sx, cx) / deg + 360) % 360);
    }, 1500);
  }

  /* ---------- quick phone reading (same method as the phone meter tool) ---------- */
  function quickRead(r, cb) {
    const cal = (window.FG.state().settings.meterCal) || {};
    const dlg = document.createElement("div"); dlg.className = "sheet";
    dlg.innerHTML = `<div class="sheetin"><h3>Read this source</h3><p class="small">Hold a white card where the actor's face will be, turned toward this source. Fill the circle with the card.</p>
      <div class="meter-wrap"><video class="meter-video" playsinline muted></video><div class="spot"></div></div><div class="out" id="qr_o"><p>Starting the camera...</p></div>
      <div class="btnrow"><button class="btn primary" id="qr_use" disabled>Use this reading</button><button class="btn" id="qr_x">Cancel</button></div></div>`;
    document.body.appendChild(dlg);
    const v = dlg.querySelector("video"), o = dlg.querySelector("#qr_o");
    const cvs = document.createElement("canvas"), ctx = cvs.getContext("2d", { willReadFrequently: true });
    let stream = null, track = null, timer = null, last = null;
    const lin = (x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    function close() { if (timer) clearInterval(timer); if (stream) stream.getTracks().forEach((t) => t.stop()); dlg.remove(); }
    dlg.querySelector("#qr_x").addEventListener("click", close);
    dlg.querySelector("#qr_use").addEventListener("click", () => { close(); cb(last); });
    (async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { o.innerHTML = "<p>The camera isn't available here. Pick the color and brightness by eye instead.</p>"; return; }
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }); }
      catch (e) { o.innerHTML = `<p>Camera not available: ${esc(e.message)}</p>`; return; }
      track = stream.getVideoTracks()[0]; v.srcObject = stream; await v.play().catch(() => {});
      timer = setInterval(() => {
        if (!v.videoWidth) return;
        const w = 64, h = Math.round((64 * v.videoHeight) / v.videoWidth); cvs.width = w; cvs.height = h; ctx.drawImage(v, 0, 0, w, h);
        const d = ctx.getImageData(Math.round(w * 0.39), Math.round(h / 2 - w * 0.11), Math.round(w * 0.22), Math.round(w * 0.22)).data;
        let R = 0, G = 0, B = 0, n = 0; for (let i = 0; i < d.length; i += 4) { R += lin(d[i]); G += lin(d[i + 1]); B += lin(d[i + 2]); n++; }
        R /= n; G /= n; B /= n; const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
        const st = track.getSettings ? track.getSettings() : {}, et = st.exposureTime ? st.exposureTime / 10000 : null, iso = st.iso || null;
        let K = window.FG_MATH.mccamy(R, G, B); if (isFinite(K) && cal.mired) K = 1e6 / (1e6 / K + cal.mired);
        let N = null;
        if (et && iso && Y > 0 && cal.k) { const ev = Math.log2(Y / (et * iso)), t = r.cam.angle / 360 / r.cam.fps; N = Math.sqrt(cal.k * Math.pow(2, ev) * r.cam.iso * t); }
        last = { K: isFinite(K) ? Math.round(K / 100) * 100 : null, N: N ? Math.round(N * 10) / 10 : null };
        o.innerHTML = `<p>Color: <b>${last.K ? last.K + " K" : "-"}</b>${cal.mired ? "" : ' <span class="small muted">(not calibrated)</span>'}</p><p>Stop: <b>${last.N ? "T" + last.N : "needs a calibrated phone meter"}</b> <span class="small muted">at ISO ${r.cam.iso}</span></p>`;
        dlg.querySelector("#qr_use").disabled = false;
      }, 400);
    })();
  }

  /* ---------- Production Hub links (paperwork, locations and scenes live there) ---------- */
  function hubUrl() { return ((window.FG_CONFIG || {}).hubUrl || "").replace(/\/+$/, ""); }
  function hubLinks(r) {
    if (!hubUrl() || !r.hub) return '<span class="small muted">Add the code to link this room to its project in the hub.</span>';
    const base = hubUrl() + "/p/" + encodeURIComponent(r.hub);
    return `<a class="btn" href="${base}?tab=papers" target="_blank" rel="noopener">Location paperwork</a><a class="btn" href="${base}?tab=locations" target="_blank" rel="noopener">Locations and scenes</a>`;
  }

  /* ---------- pages ---------- */
  R.list = function (view, setTitle) {
    setTitle("Room", false);
    const list = rooms().slice().reverse();
    view.innerHTML = `<div class="hero"><h1>Read the room.</h1><p>Walk in, record the windows and lights with their color and brightness, and get a layout and a lighting plan built from your kit. Works with no signal.</p></div>
      <button class="btn primary wide" id="rm_new">Read a new room</button>
      ${list.length ? `<div class="section-label">Saved rooms</div><div class="list">${list.map((x) => `<a class="row" href="#/room/${x.id}"><div class="t"><b>${esc(x.name)}</b><span>${esc([x.project, x.date, x.sources.length + " sources", LOOKS[x.look] || ""].filter(Boolean).join(" · "))}</span></div><span class="chev">›</span></a>`).join("")}</div>` : ""}
      <p class="small muted">Location paperwork (releases, permits, insurance) lives in the Production Hub's Paperwork tab. Give a room its hub project code to jump there. Scene notes will fill in from the hub once that link is built; for now, paste them in.</p>`;
    view.querySelector("#rm_new").addEventListener("click", () => { const r = newRoom(); location.hash = "#/room/" + r.id; });
  };

  R.page = function (view, id, setTitle, mode) {
    const r = getRoom(id); if (!r) { view.innerHTML = `<p>That room isn't saved on this phone. <a href="#/room">Back</a></p>`; return; }
    setTitle(r.name, true);
    const tab = mode || "room";
    const tabs = `<div class="seg">${[["room", "Room"], ["sources", "Sources"], ["plan", "Plan"]].map(([k, l]) => `<a class="${tab === k ? "on" : ""}" href="#/room/${r.id}/${k}">${l}</a>`).join("")}</div>`;
    if (tab === "room") return roomForm(view, r, tabs);
    if (tab === "sources") return sourcesForm(view, r, tabs);
    return planPage(view, r, tabs);
  };

  function roomForm(view, r, tabs) {
    const U = uLabel();
    view.innerHTML = tabs + `
      <label class="f">Name</label><input type="text" id="r_name" value="${esc(r.name)}" placeholder="Smith kitchen">
      <label class="f">Project</label><input type="text" id="r_proj" value="${esc(r.project)}" placeholder="Cold Cowboy">
      ${hubUrl() ? `<label class="f">Hub project code (from the hub address, /p/<b>code</b>)</label><input type="text" id="r_hub" value="${esc(r.hub || "")}" placeholder="coldcowboy" autocapitalize="off">
      <div class="btnrow" id="r_hubl">${hubLinks(r)}</div>` : ""}
      <h3>Room size</h3><div class="three"><div><label class="f">Wall A width (${U})</label><input type="number" id="r_w" step="0.1" inputmode="decimal" value="${f1(toU(r.w))}"></div>
        <div><label class="f">Depth (${U})</label><input type="number" id="r_l" step="0.1" inputmode="decimal" value="${f1(toU(r.l))}"></div>
        <div><label class="f">Ceiling (${U})</label><input type="number" id="r_h" step="0.1" inputmode="decimal" value="${f1(toU(r.h))}"></div></div>
      <p class="small muted">No tape? Measure your own step once at home, then pace it off. AR measuring comes with the Android app update.</p>
      <h3>Which way is the room facing?</h3>
      <p class="small">Stand in the middle, face the wall you'll call <b>Wall A</b> (usually the one behind the actor), hold the phone flat with its top pointing at that wall, then tap Read.</p>
      <div class="btnrow"><button class="btn" id="r_hd">Read the compass</button><span class="small" id="r_hdo">${r.headingA != null ? "Wall A faces " + compassName(r.headingA) + " (" + Math.round(r.headingA) + "°)" : "Not set"}</span></div>
      <h3>Shoot day</h3>
      <label class="f">Date</label><input type="date" id="r_date" value="${esc(r.date)}">
      <div class="two"><div><label class="f">From</label><input type="time" id="r_s" value="${esc(r.start)}"></div><div><label class="f">To</label><input type="time" id="r_e" value="${esc(r.end)}"></div></div>
      <div class="btnrow"><button class="btn" id="r_gps">Use my location</button><span class="small" id="r_gpso">${r.lat != null ? f1(r.lat) + ", " + f1(r.lon) : "No location yet"}</span></div>
      <h3>Camera</h3><div class="three"><div><label class="f">ISO</label><input type="number" id="r_iso" value="${r.cam.iso}" inputmode="numeric"></div><div><label class="f">fps</label><input type="number" id="r_fps" value="${r.cam.fps}" inputmode="decimal"></div><div><label class="f">Shutter °</label><input type="number" id="r_ang" value="${r.cam.angle}" inputmode="numeric"></div></div>
      <label class="f">Stop you want to shoot at</label><select id="r_stop">${[1.4, 2, 2.8, 4, 5.6, 8].map((n) => `<option ${n === r.cam.stop ? "selected" : ""}>${n}</option>`).join("")}</select>
      <h3>The look</h3><select id="r_look">${Object.entries(LOOKS).map(([k, l]) => `<option value="${k}" ${k === r.look ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label class="f">Scene and look notes</label><textarea id="r_notes" rows="4" placeholder="Paste the scene from the hub: INT. KITCHEN - NIGHT. Tense, warm lamp, rain outside.">${esc(r.notes)}</textarea>
      <p class="small muted" id="r_lookhint"></p>
      <div class="btnrow"><a class="btn primary" href="#/room/${r.id}/sources">Next: sources</a><button class="btn" id="r_del">Delete room</button></div>`;
    const q = (s) => view.querySelector(s);
    const hint = () => { const L = lookFromNotes({ notes: q("#r_notes").value }); q("#r_lookhint").textContent = L && L !== r.look ? `Your notes read as "${LOOKS[L]}". Switch the look above if that's right.` : ""; };
    function pull() {
      r.name = q("#r_name").value.trim() || "Room"; r.project = q("#r_proj").value.trim();
      if (q("#r_hub")) { r.hub = q("#r_hub").value.trim().toLowerCase().replace(/[^a-z0-9-]/g, ""); q("#r_hub").value = r.hub; q("#r_hubl").innerHTML = hubLinks(r); }
      r.w = Math.max(1, fromU(+q("#r_w").value || 3)); r.l = Math.max(1, fromU(+q("#r_l").value || 3)); r.h = Math.max(1.8, fromU(+q("#r_h").value || 2.4));
      r.date = q("#r_date").value || r.date; r.start = q("#r_s").value || r.start; r.end = q("#r_e").value || r.end;
      r.cam = { iso: +q("#r_iso").value || 800, fps: +q("#r_fps").value || 24, angle: +q("#r_ang").value || 180, stop: +q("#r_stop").value || 2.8 };
      r.look = q("#r_look").value; r.notes = q("#r_notes").value; save(); hint();
    }
    view.querySelectorAll("input,select,textarea").forEach((e) => e.addEventListener("change", pull));
    q("#r_notes").addEventListener("input", hint); hint();
    q("#r_hd").addEventListener("click", () => { q("#r_hdo").textContent = "Hold still..."; readHeading((h) => { if (h == null) { q("#r_hdo").textContent = "No compass on this device. Pick it by eye on the Plan."; return; } r.headingA = h; save(); q("#r_hdo").textContent = "Wall A faces " + compassName(h) + " (" + Math.round(h) + "°)"; }); });
    q("#r_gps").addEventListener("click", () => {
      if (!navigator.geolocation) return window.FG.toast("No location on this device");
      q("#r_gpso").textContent = "Finding you...";
      navigator.geolocation.getCurrentPosition((p) => { r.lat = +p.coords.latitude.toFixed(4); r.lon = +p.coords.longitude.toFixed(4); save(); q("#r_gpso").textContent = r.lat + ", " + r.lon; },
        (e) => { q("#r_gpso").textContent = "Location not available: " + e.message; }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 });
    });
    q("#r_del").addEventListener("click", () => { if (!confirm("Delete this room from the phone?")) return; const S = window.FG.state(); S.rooms = rooms().filter((x) => x.id !== r.id); save(); location.hash = "#/room"; });
  }

  function sourcesForm(view, r, tabs) {
    const row = (s) => {
      const K = KINDS[s.kind];
      return `<div class="box src" data-id="${s.id}">
        <div class="two"><div><label class="f">Type</label><select data-k="kind">${Object.entries(KINDS).map(([k, v]) => `<option value="${k}" ${k === s.kind ? "selected" : ""}>${v.label}</option>`).join("")}</select></div>
          <div><label class="f">Name</label><input type="text" data-k="name" value="${esc(s.name || "")}" placeholder="${esc(K.label)}"></div></div>
        ${K.onWall ? `<div class="three"><div><label class="f">Wall</label><select data-k="wall">${WALLS.map((w) => `<option ${w === s.wall ? "selected" : ""}>${w}</option>`).join("")}</select></div>
          <div><label class="f">Across the wall</label><input type="range" min="0" max="100" data-k="pos" value="${Math.round(s.pos * 100)}"></div>
          <div><label class="f">Width (${uLabel()})</label><input type="number" step="0.1" data-k="width" value="${f1(toU(s.width || K.w))}" inputmode="decimal"></div></div>`
        : `<div class="two"><div><label class="f">Left to right</label><input type="range" min="0" max="100" data-k="x" value="${Math.round(s.x * 100)}"></div><div><label class="f">Wall A to Wall C</label><input type="range" min="0" max="100" data-k="y" value="${Math.round(s.y * 100)}"></div></div>`}
        <div class="two"><div><label class="f">Color</label><select data-k="kpre"><option value="">${s.k || K.k} K</option>${KPRESETS.map(([l, k]) => `<option value="${k}">${l} (${k}K)</option>`).join("")}</select></div>
          <div><label class="f">Brightness</label><select data-k="level">${LEVELS.map(([k, l]) => `<option value="${k}" ${k === s.level ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
        <div class="btnrow"><button class="btn" data-act="read">Read it with the phone</button><span class="small">${s.stop ? "Reads T" + s.stop : ""}</span><button class="btn" data-act="del">Remove</button></div></div>`;
    };
    view.innerHTML = tabs + `<p class="small">Add every window, door and light you can see, on or off. "Across the wall" runs left to right as you face that wall from inside the room.</p>
      ${r.sources.map(row).join("") || '<p class="muted">No sources yet.</p>'}
      <div class="btnrow">${Object.entries(KINDS).map(([k, v]) => `<button class="btn" data-add="${k}">Add ${v.label.toLowerCase()}</button>`).join("")}</div>
      <a class="btn primary wide" href="#/room/${r.id}/plan">See the layout and lighting plan</a>`;
    view.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.add, K = KINDS[k];
      r.sources.push({ id: uid(), kind: k, name: "", wall: "A", pos: 0.5, width: K.w || 1, x: 0.5, y: 0.5, k: K.k, level: k === "window" ? "bright" : "medium", stop: null });
      save(); sourcesForm(view, r, tabs);
    }));
    view.querySelectorAll(".src").forEach((box) => {
      const s = r.sources.find((x) => x.id === box.dataset.id);
      box.querySelectorAll("[data-k]").forEach((el) => el.addEventListener("change", () => {
        const k = el.dataset.k, v = el.value;
        if (k === "kind") { s.kind = v; s.k = KINDS[v].k; }
        else if (k === "pos" || k === "x" || k === "y") s[k] = +v / 100;
        else if (k === "width") s.width = fromU(+v || 1);
        else if (k === "kpre") { if (v) s.k = +v; }
        else if (k === "level") { s.level = v; if (v === "off") s.stop = null; }
        else s[k] = v;
        save(); if (k === "kind" || k === "kpre") sourcesForm(view, r, tabs);
      }));
      box.querySelector('[data-act="del"]').addEventListener("click", () => { r.sources = r.sources.filter((x) => x !== s); save(); sourcesForm(view, r, tabs); });
      box.querySelector('[data-act="read"]').addEventListener("click", () => quickRead(r, (rd) => {
        if (!rd) return; if (rd.K) s.k = rd.K; if (rd.N) s.stop = rd.N; save(); sourcesForm(view, r, tabs);
      }));
    });
  }

  function planPage(view, r, tabs, place0) {
    const A = analyze(r);
    let placing = place0 || null, optI = 0;
    function draw() {
      const opt = A.options[optI];
      view.innerHTML = tabs + `<div class="planwrap">${plan(r, opt, placing)}</div>
        <div class="btnrow"><button class="btn ${placing === "actor" ? "primary" : ""}" id="p_actor">Place the actor</button><button class="btn ${placing === "camera" ? "primary" : ""}" id="p_cam">Place the camera</button></div>
        <p class="small muted">Look: ${esc(LOOKS[A.look])}. Color swatches show each source's color. ${r.headingA == null ? "Read the compass on the Room page to get north and the sun." : ""}</p>
        <div class="section-label">Recommendations</div>
        <div class="list">${A.recs.map((x) => `<div class="row"><div class="t"><b>${x.t}</b><span>${x.b}</span></div></div>`).join("")}</div>
        <div class="section-label">Lighting layouts</div>
        <div class="chips">${A.options.map((o, i) => `<a class="chip ${i === optI ? "on" : ""}" href="#" data-opt="${i}">${i + 1}. ${esc(o.name)}</a>`).join("")}</div>
        ${opt ? `<div class="box"><h3>${esc(opt.name)}</h3><p class="small">${esc(opt.why)}</p>
          <div class="tablewrap"><table><tr><th>#</th><th>Light</th><th>Distance</th><th>Level</th></tr>${opt.lights.map((L, i) => `<tr><td>${L.p == null && /floppy|block/i.test(L.fixture) ? "-" : i + 1}</td><td><b>${esc(L.label)}</b><br><span class="small muted">${esc(L.fixture)}, ${esc(L.mod)}${L.extra ? "<br>" + esc(L.extra) : ""}</span></td>
            <td class="num">${f1(toU(L.d))} ${uLabel()}</td><td class="num">${L.p == null ? "" : levelText(L.p) + "<br>"}${L.k ? L.k + " K" : ""}</td></tr>`).join("")}</table></div>
          <p class="small muted">Levels are scaled from the planner's numbers for the matching setup to your distance, stop and ISO. Check them on the camera's scopes.</p>
          ${opt.setup ? `<a class="chip" href="#/setup/${opt.setup}">See the matching setup</a>` : ""}</div>` : ""}
        ${hubUrl() && r.hub ? `<div class="section-label">In the hub</div><div class="btnrow">${hubLinks(r)}</div>` : ""}`;
      view.querySelector("#p_actor").addEventListener("click", () => { placing = placing === "actor" ? null : "actor"; draw(); });
      view.querySelector("#p_cam").addEventListener("click", () => { placing = placing === "camera" ? null : "camera"; draw(); });
      view.querySelectorAll("[data-opt]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); optI = +a.dataset.opt; draw(); }));
      const svg = view.querySelector("svg.roomplan");
      svg.addEventListener("click", (e) => {
        if (!placing) return;
        const b = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, x = ((e.clientX - b.left) / b.width) * vb.width, y = ((e.clientY - b.top) / b.height) * vb.height;
        const sc = +svg.dataset.sc, ox = +svg.dataset.ox, oy = +svg.dataset.oy;
        const px = Math.max(0.02, Math.min(0.98, (x - ox) / sc / r.w)), py = Math.max(0.02, Math.min(0.98, (y - oy) / sc / r.l));
        if (placing === "actor") r.subject = { x: px, y: py }; else r.camera = { x: px, y: py };
        save(); const keep = placing; planPage(view, r, tabs, keep);
      });
    }
    draw();
  }

  // Opened from the hub's "Plan the light" button: dpfieldguide://open/room/new?hub=coldcowboy&loc=<id>&name=...&lat=..&lon=..&date=YYYY-MM-DD&call=HH:MM&wrap=HH:MM&notes=...
  // Reuses the room already made for that hub location, so tapping the button twice doesn't make two rooms.
  R.fromHub = function (q) {
    const hub = String(q.get("hub") || "").toLowerCase().replace(/[^a-z0-9-]/g, ""), loc = String(q.get("loc") || "").slice(0, 60);
    let r = loc ? rooms().find((x) => x.hub === hub && x.hubLoc === loc) : null;
    if (!r) { r = newRoom(); r.hub = hub; r.hubLoc = loc; }
    const num = (k) => { const v = parseFloat(q.get(k)); return isFinite(v) ? v : null; };
    const txt = (k, n) => String(q.get(k) || "").slice(0, n || 200);
    if (q.get("name")) r.name = txt("name", 80);
    if (q.get("project")) r.project = txt("project", 80);
    if (num("lat") != null && num("lon") != null && Math.abs(num("lat")) <= 90 && Math.abs(num("lon")) <= 180) { r.lat = +num("lat").toFixed(4); r.lon = +num("lon").toFixed(4); }
    if (/^\d{4}-\d{2}-\d{2}$/.test(q.get("date") || "")) r.date = q.get("date");
    if (/^\d{1,2}:\d{2}$/.test(q.get("call") || "")) r.start = q.get("call").padStart(5, "0");
    if (/^\d{1,2}:\d{2}$/.test(q.get("wrap") || "")) r.end = q.get("wrap").padStart(5, "0");
    if (q.get("notes") && !r.notes) r.notes = txt("notes", 2000);
    if (!r.notes || r.look === "natural") { const L = lookFromNotes(r); if (L) r.look = L; }
    save();
    return r;
  };

  R._analyze = analyze; // for tests
  window.ROOM = R;
})();
