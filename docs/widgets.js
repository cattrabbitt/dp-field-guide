/* Interactive tools. Each widget is a function (element, dataset). They read the kit from FG.kit(). No network needed. */
(function () {
  "use strict";
  const W = {};
  const esc = (t) => window.FG.esc(t);
  const kit = () => window.FG.kit();
  const units = () => window.FG.units();
  const stoppers = [];
  W._stop = () => { while (stoppers.length) { try { stoppers.pop()(); } catch (e) { /* ignore */ } } };

  const FULL = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
  const THIRDS = [1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22];
  const log2 = Math.log2;
  function stopLabel(N) {
    // nearest third stop as "T2.8 +1/3" style
    const n = 2 * log2(N), k = Math.round(n * 3) / 3, base = Math.floor(k + 1e-9);
    const third = Math.round((k - base) * 3);
    const name = (v) => { const x = Math.pow(2, v / 2); const f = FULL.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a)); return f; };
    if (k < 0) return "below T1";
    return "T" + name(base) + (third ? " +" + third + "/3" : "");
  }
  const fmt = (x, d = 1) => (isFinite(x) ? x.toFixed(d) : "∞");
  const ft = (m) => m * 3.28084, m_ = (f) => f / 3.28084;
  function lenUnit() { return units() === "metric" ? "m" : "ft"; }
  function toM(v) { return units() === "metric" ? v : m_(v); }
  function fromM(v) { return units() === "metric" ? v : ft(v); }
  function camSelect(id) {
    const cams = kit().cameras || [];
    return `<select id="${id}">${cams.map((c, i) => `<option value="${i}">${esc(c.name)}</option>`).join("")}</select>`;
  }
  function cam(i) { return (kit().cameras || [])[+i] || { name: "Full frame", w: 36, h: 24, iso: [] }; }
  function lensOptions() {
    return (kit().lenses || []).filter((l) => typeof l.f === "number").map((l) => `<option value="${l.f}">${esc(l.name)}</option>`).join("");
  }
  const on = (root, sel, ev, fn) => root.querySelectorAll(sel).forEach((e) => e.addEventListener(ev, fn));
  const val = (root, id) => parseFloat(root.querySelector("#" + id).value);

  /* ---------------- rule of thirds and framing ---------------- */
  const FRAMES = {
    center: { t: "Centered subject", d: "Fine for symmetry and for a character looking straight down the lens. For a normal conversation it feels static and gives the eye nowhere to travel." },
    third: { t: "Subject on a third, looking into the room", d: "Eyes sit near the top-third line, the face sits on the left third line, and the empty two thirds is look room in front of the face. It feels balanced and natural." },
    short: { t: "Short-sided (no look room)", d: "Same face, but looking toward the near edge with the space behind them. It feels cramped and uneasy. Use it on purpose for tension, isolation or a character boxed in." },
    head: { t: "Too much headroom", d: "Eyes sit in the middle of the frame and the space over the head is wasted. The subject looks like they're sinking. In a close-up the eyes belong near the top third line." },
    horizon_mid: { t: "Horizon through the middle", d: "Splits the frame in half, so neither sky nor land wins. It reads as undecided." },
    horizon_low: { t: "Horizon on the lower third", d: "Sky gets two thirds: open, free, big. Put the horizon on the upper third instead to make the ground (a road, a field, a crowd) the story." }
  };
  function frameSvg(kind, grid) {
    const w = 320, h = 180;
    let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
    const person = (cx, eyeY, sc, look) => {
      // simple head and shoulders silhouette, nose shows the look direction
      const hr = 26 * sc;
      return `<g fill="#c9a27e"><ellipse cx="${cx}" cy="${eyeY + 2 * sc}" rx="${hr * 0.82}" ry="${hr}"/>
        <path d="M${cx - 70 * sc},${h} C${cx - 64 * sc},${eyeY + 58 * sc} ${cx + 64 * sc},${eyeY + 58 * sc} ${cx + 70 * sc},${h}Z" fill="#4b5a6b"/>
        <rect x="${cx - 9 * sc}" y="${eyeY + 20 * sc}" width="${18 * sc}" height="${22 * sc}"/>
        <path d="M${cx + look * hr * 0.75},${eyeY - 2 * sc} l${look * 9 * sc},${8 * sc} l${-look * 9 * sc},${4 * sc}Z"/>
        <circle cx="${cx + look * hr * 0.35}" cy="${eyeY - 4 * sc}" r="${2.4 * sc}" fill="#2a2a2a"/></g>`;
    };
    if (kind.startsWith("horizon")) {
      const y = kind === "horizon_mid" ? h / 2 : (2 * h) / 3;
      s += `<rect width="${w}" height="${y}" fill="#5d7fa8"/><rect y="${y}" width="${w}" height="${h - y}" fill="#4f6b3a"/>
        <path d="M0,${y} L60,${y - 14} L110,${y - 4} L170,${y - 22} L240,${y - 6} L320,${y - 16} L320,${y} Z" fill="#3d5530"/>
        <circle cx="250" cy="${y * 0.35}" r="12" fill="#f5d27a"/>`;
    } else {
      s += `<rect width="${w}" height="${h}" fill="#2b3036"/><rect x="0" y="0" width="${w}" height="${h}" fill="url(#g)"/>
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#3a3f46"/><stop offset="1" stop-color="#22262b"/></linearGradient></defs>`;
      if (kind === "center") s += person(w / 2, h / 3, 1, 0.4);
      if (kind === "third") s += person(w / 3, h / 3, 1, 1);
      if (kind === "short") s += person(w / 3, h / 3, 1, -1);
      if (kind === "head") s += person(w / 2, h / 2 + 8, 0.92, 0.4);
    }
    if (grid) {
      s += `<g stroke="#fff" stroke-opacity=".75" stroke-width="1.2" stroke-dasharray="4 4">
        <line x1="${w / 3}" y1="0" x2="${w / 3}" y2="${h}"/><line x1="${(2 * w) / 3}" y1="0" x2="${(2 * w) / 3}" y2="${h}"/>
        <line x1="0" y1="${h / 3}" x2="${w}" y2="${h / 3}"/><line x1="0" y1="${(2 * h) / 3}" x2="${w}" y2="${(2 * h) / 3}"/></g>
        <g fill="#f5c542">${[[1, 1], [2, 1], [1, 2], [2, 2]].map(([a, b]) => `<circle cx="${(a * w) / 3}" cy="${(b * h) / 3}" r="3.5"/>`).join("")}</g>`;
    }
    return s + "</svg>";
  }
  W.thirds = (el) => {
    let kind = "third", grid = true;
    function draw() {
      el.innerHTML = `<h3>See it</h3><div class="chips">${Object.keys(FRAMES).map((k) => `<button class="chip ${k === kind ? "on" : ""}" data-k="${k}">${esc(FRAMES[k].t)}</button>`).join("")}</div>
        <div class="frame">${frameSvg(kind, grid)}</div>
        <p><b>${esc(FRAMES[kind].t)}.</b> ${esc(FRAMES[kind].d)}</p>
        <button class="btn" id="tg">${grid ? "Hide" : "Show"} the grid</button>`;
      on(el, "[data-k]", "click", (e) => { kind = e.currentTarget.dataset.k; draw(); });
      el.querySelector("#tg").addEventListener("click", () => { grid = !grid; draw(); });
    }
    draw();
  };

  /* ---------------- camera height and angle diagram ---------------- */
  const ANG = [
    ["eye", "Eye level", 0, "Neutral. You're an equal in the room. The default for dialogue."],
    ["low", "Low angle", -25, "The subject looms: power, threat, heroism. Lower and wider makes it stronger. It shows ceilings, so check them."],
    ["high", "High angle", 25, "The audience looks down: smaller, weaker, trapped or watched."],
    ["over", "Overhead (bird's-eye)", 85, "Detached, godlike, or pure pattern and graphics. Great for tables, hands and blocking maps."],
    ["worm", "Worm's-eye", -70, "Extreme and stylized: towering figures, disorientation, comedy."],
    ["dutch", "Dutch (tilted)", 0, "Rolls the horizon. Unease, madness, a world off balance. Use it rarely or it stops meaning anything."]
  ];
  W.camangles = (el) => {
    let cur = "low";
    function svg(k) {
      const a = ANG.find((x) => x[0] === k);
      const tilt = a[2], w = 320, h = 170;
      const cx = 220, cy = 92; // subject eye
      const r = 130, rad = (tilt * Math.PI) / 180;
      const camx = cx - r * Math.cos(rad), camy = cy + r * Math.sin(rad) * 1.0;
      let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#14171c"/>
        <line x1="0" y1="160" x2="${w}" y2="160" stroke="#3a4250"/>
        <g fill="#c9a27e"><circle cx="${cx}" cy="${cy}" r="14"/><rect x="${cx - 16}" y="${cy + 16}" width="32" height="54" rx="8" fill="#4b5a6b"/></g>`;
      const bx = Math.max(18, Math.min(w - 18, camx)), by = Math.max(14, Math.min(150, camy));
      const ang = (Math.atan2(cy - by, cx - bx) * 180) / Math.PI;
      s += `<line x1="${bx}" y1="${by}" x2="${cx}" y2="${cy}" stroke="#f5c542" stroke-dasharray="4 4"/>
        <g transform="translate(${bx},${by}) rotate(${ang}${k === "dutch" ? "" : ""})"><rect x="-16" y="-9" width="24" height="18" rx="3" fill="#e0e0e0"/><path d="M8,-6 L18,-10 L18,10 L8,6Z" fill="#e0e0e0"/></g>`;
      if (k === "dutch") s += `<text x="20" y="30" fill="#f5c542" font-size="13">Camera rolled about 15°</text>`;
      return s + "</svg>";
    }
    function draw() {
      const a = ANG.find((x) => x[0] === cur);
      el.innerHTML = `<h3>Camera height</h3><div class="chips">${ANG.map((x) => `<button class="chip ${x[0] === cur ? "on" : ""}" data-k="${x[0]}">${esc(x[1])}</button>`).join("")}</div>
        <div class="frame">${svg(cur)}</div><p><b>${esc(a[1])}.</b> ${esc(a[3])}</p>`;
      on(el, "[data-k]", "click", (e) => { cur = e.currentTarget.dataset.k; draw(); });
    }
    draw();
  };

  /* ---------------- field of view ---------------- */
  W.fov = (el) => {
    el.innerHTML = `<h3>Field of view</h3>
      <label class="f">Camera</label>${camSelect("c")}
      <div class="two"><div><label class="f">Focal length (mm)</label><input type="number" id="f" value="35" min="4" max="1200" inputmode="decimal"></div>
      <div><label class="f">Or pick a lens</label><select id="lp"><option value="">My lenses</option>${lensOptions()}</select></div></div>
      <label class="f">Distance to subject (${lenUnit()})</label><input type="number" id="d" value="${units() === "metric" ? 2 : 6}" min="0.1" step="0.1" inputmode="decimal">
      <div class="out" id="o"></div>`;
    const calc = () => {
      const C = cam(el.querySelector("#c").value), f = val(el, "f"), d = toM(val(el, "d"));
      if (!(f > 0 && d > 0)) return;
      const hf = 2 * Math.atan(C.w / 2 / f), vf = 2 * Math.atan(C.h / 2 / f);
      const crop = 36 / C.w; // horizontal crop vs full frame, which is what a 16:9 frame shows
      const W_ = 2 * d * Math.tan(hf / 2), H_ = 2 * d * Math.tan(vf / 2);
      const shot = H_ < 0.35 ? "extreme close-up" : H_ < 0.6 ? "close-up" : H_ < 0.95 ? "medium close-up" : H_ < 1.4 ? "medium shot" : H_ < 2.1 ? "full shot (standing person)" : "wide shot";
      el.querySelector("#o").innerHTML = `<div class="lines">
        <div><span>Horizontal angle</span><b>${fmt((hf * 180) / Math.PI)}°</b></div>
        <div><span>Vertical angle</span><b>${fmt((vf * 180) / Math.PI)}°</b></div>
        <div><span>Frame width at subject</span><b>${fmt(fromM(W_), 2)} ${lenUnit()}</b></div>
        <div><span>Frame height at subject</span><b>${fmt(fromM(H_), 2)} ${lenUnit()}</b></div>
        <div><span>Full-frame look-alike</span><b>${fmt(f * crop, 0)} mm</b></div>
        <div><span>Crop factor</span><b>${fmt(crop, 2)}x</b></div></div>
        <p class="small">On a standing adult, a frame this tall is roughly a <b>${shot}</b>.</p>`;
    };
    el.querySelector("#lp").addEventListener("change", (e) => { if (e.target.value) { el.querySelector("#f").value = e.target.value; calc(); } });
    on(el, "input,select", "input", calc); on(el, "select", "change", calc); calc();
  };

  /* ---------------- depth of field ---------------- */
  W.dof = (el) => {
    el.innerHTML = `<h3>Depth of field</h3>
      <label class="f">Camera</label>${camSelect("c")}
      <div class="two"><div><label class="f">Focal length (mm)</label><input type="number" id="f" value="50" inputmode="decimal"></div>
      <div><label class="f">Stop</label><select id="n">${THIRDS.filter((x) => x >= 1.4).map((x) => `<option ${x === 2.8 ? "selected" : ""}>${x}</option>`).join("")}</select></div></div>
      <label class="f">Focus distance (${lenUnit()})</label><input type="number" id="s" value="${units() === "metric" ? 2 : 6}" step="0.1" inputmode="decimal">
      <div class="out" id="o"></div>
      <p class="small muted">Uses the circle of confusion of sensor diagonal / 1500. That's a common rule for screen viewing. Big screens show softness sooner. Depth of field depends on the f-stop, not the T-stop. With most lenses the two are close enough here.</p>`;
    const calc = () => {
      const C = cam(el.querySelector("#c").value), f = val(el, "f"), N = val(el, "n"), s = toM(val(el, "s")) * 1000;
      if (!(f > 0 && N > 0 && s > f)) return;
      const c = Math.hypot(C.w, C.h) / 1500;
      const H = (f * f) / (N * c) + f;
      const near = (s * (H - f)) / (H + s - 2 * f), far = s < H ? (s * (H - f)) / (H - s) : Infinity;
      const u = (mm) => (isFinite(mm) ? fmt(fromM(mm / 1000), 2) + " " + lenUnit() : "infinity");
      const tot = far - near;
      el.querySelector("#o").innerHTML = `<div class="lines">
        <div><span>Near sharp limit</span><b>${u(near)}</b></div>
        <div><span>Far sharp limit</span><b>${u(far)}</b></div>
        <div><span>Total depth</span><b>${isFinite(tot) ? (units() === "metric" ? fmt(tot / 10, 1) + " cm" : fmt(tot / 25.4, 1) + " in") : "to infinity"}</b></div>
        <div><span>In front / behind focus</span><b>${isFinite(far) ? Math.round((100 * (s - near)) / (far - near)) + "% / " + Math.round((100 * (far - s)) / (far - near)) + "%" : "-"}</b></div>
        <div><span>Hyperfocal distance</span><b>${u(H)}</b></div></div>`;
    };
    on(el, "input,select", "input", calc); on(el, "select", "change", calc); calc();
  };

  /* ---------------- exposure triangle: what changed, by how many stops ---------------- */
  W.exposure = (el) => {
    const row = (p) => `<div class="three"><div><label class="f">T-stop</label><input type="number" id="${p}t" value="2.8" step="0.1" inputmode="decimal"></div>
      <div><label class="f">ISO</label><input type="number" id="${p}i" value="800" inputmode="numeric"></div>
      <div><label class="f">Shutter angle</label><input type="number" id="${p}s" value="180" inputmode="numeric"></div></div>
      <div class="two"><div><label class="f">Frame rate</label><input type="number" id="${p}f" value="24" inputmode="decimal"></div>
      <div><label class="f">ND (0.3 per stop)</label><select id="${p}n">${[0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4].map((x) => `<option value="${x}">${x ? "ND " + x.toFixed(1) : "None"}</option>`).join("")}</select></div></div>`;
    el.innerHTML = `<h3>Compare two settings</h3><p class="small">Set what you have now, then what you want to change to. It tells you how much brighter or darker the picture gets, and how to get back.</p>
      <div class="section-label">Now</div>${row("a")}<div class="section-label">Changed to</div>${row("b")}<div class="out" id="o"></div>`;
    const ev = (p) => {
      const t = val(el, p + "t"), i = val(el, p + "i"), s = val(el, p + "s"), f = val(el, p + "f"), n = parseFloat(el.querySelector("#" + p + "n").value);
      return log2(i) + log2(s / 360 / f) - 2 * log2(t) - n / 0.30103;
    };
    const calc = () => {
      const d = ev("b") - ev("a");
      if (!isFinite(d)) return;
      const r = Math.round(d * 3) / 3;
      el.querySelector("#o").innerHTML = Math.abs(r) < 0.05 ? `<div class="big">Same exposure</div><p>Both settings give the same brightness.</p>` :
        `<div class="big">${r > 0 ? "+" : ""}${fmt(r, 2)} stops</div><p>The picture gets <b>${r > 0 ? "brighter" : "darker"}</b> by about ${fmt(Math.abs(r), 1)} stops (${fmt(Math.pow(2, Math.abs(r)), 1)}x the light). To get back, ${r > 0 ? "close down" : "open up"} ${fmt(Math.abs(r), 1)} stops, or ${r > 0 ? "add" : "remove"} ND ${fmt(Math.abs(r) * 0.3, 1)}, or ${r > 0 ? "dim" : "raise"} the lights.</p>`;
    };
    on(el, "input,select", "input", calc); on(el, "select", "change", calc); calc();
  };

  /* ---------------- lux to T-stop (incident meter math) ---------------- */
  W.lux = (el) => {
    el.innerHTML = `<h3>Light level to T-stop</h3>
      <div class="three"><div><label class="f">ISO</label><input type="number" id="i" value="800" inputmode="numeric"></div>
      <div><label class="f">Frame rate</label><input type="number" id="f" value="24" inputmode="decimal"></div>
      <div><label class="f">Shutter angle</label><input type="number" id="s" value="180" inputmode="numeric"></div></div>
      <div class="two"><div><label class="f">Light at the face</label><input type="number" id="e" value="120" inputmode="decimal"></div>
      <div><label class="f">Unit</label><select id="u"><option value="lux">lux</option><option value="fc">foot-candles</option></select></div></div>
      <div class="out" id="o"></div>
      <label class="f">Or: what light level do I need for this stop?</label><select id="want">${THIRDS.filter((x) => x >= 1.4 && x <= 16).map((x) => `<option ${x === 2.8 ? "selected" : ""}>${x}</option>`).join("")}</select>
      <div class="out" id="o2"></div>
      <p class="small muted">Incident meter formula with the flat-receptor constant C = 250, which is also what the Lighting Planner uses. 1 foot-candle = 10.76 lux. A meter with a dome reads differently by design, so trust one meter and stick with it.</p>`;
    const calc = () => {
      const S = val(el, "i"), t = val(el, "s") / 360 / val(el, "f");
      let E = val(el, "e"); if (el.querySelector("#u").value === "fc") E *= 10.764;
      const N = Math.sqrt((E * S * t) / 250);
      el.querySelector("#o").innerHTML = `<div class="big">${stopLabel(N)}</div><p class="small">Exact: f-number ${fmt(N, 2)} at 1/${Math.round(1 / t)} s.</p>`;
      const want = parseFloat(el.querySelector("#want").value), need = (250 * want * want) / (S * t);
      el.querySelector("#o2").innerHTML = `<div class="big">${Math.round(need)} lux</div><p class="small">${fmt(need / 10.764, 0)} foot-candles at the face for T${want}.</p>`;
    };
    on(el, "input,select", "input", calc); on(el, "select", "change", calc); calc();
  };

  /* ---------------- shutter ---------------- */
  W.shutter = (el) => {
    el.innerHTML = `<h3>Shutter angle and speed</h3>
      <div class="two"><div><label class="f">Frame rate</label><select id="f">${[23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60, 120].map((x) => `<option ${x === 24 ? "selected" : ""}>${x}</option>`).join("")}</select></div>
      <div><label class="f">Shutter angle</label><input type="number" id="a" value="180" inputmode="decimal"></div></div>
      <div class="out" id="o"></div>
      <p class="small">In the US, mains power runs at 60 Hz, so cheap LEDs and fluorescent tubes pulse 120 times a second. Exposure times of 1/60 or 1/120 always catch whole pulses, so those don't flicker. Box covers this in his appendix of flicker-free frame rates.</p>`;
    const calc = () => {
      const f = parseFloat(el.querySelector("#f").value), a = val(el, "a"), t = a / 360 / f;
      const safe60 = Math.abs(t * 120 - Math.round(t * 120)) < 0.02 && t * 120 >= 0.98;
      el.querySelector("#o").innerHTML = `<div class="lines"><div><span>Shutter speed</span><b>1/${fmt(1 / t, 1)} s</b></div>
        <div><span>180° rule for ${f} fps</span><b>1/${fmt(2 * f, 0)} s</b></div>
        <div><span>Angle for 1/60 s (flicker safe in the US)</span><b>${fmt(360 * f / 60, 1)}°</b></div>
        <div><span>Angle for 1/50 s (Europe and the UK)</span><b>${fmt(360 * f / 50, 1)}°</b></div></div>
        <p>${safe60 ? "This setting is safe under 60 Hz lights." : "This setting can flicker under cheap 60 Hz practicals and tubes. Test, or switch to 1/60."}</p>
        <p class="small">${a > 180 ? "Wider than 180°: more blur, softer motion, a dreamy or drunk feel." : a < 180 ? "Narrower than 180°: crisper, choppier motion. Think action, war, panic (Saving Private Ryan's beach)." : "180°: the motion blur audiences read as normal film."}</p>`;
    };
    on(el, "input,select", "input", calc); on(el, "select", "change", calc); calc();
  };

  /* ---------------- ND ---------------- */
  W.nd = (el) => {
    el.innerHTML = `<h3>How much ND?</h3>
      <div class="two"><div><label class="f">Meter says (stop for correct exposure)</label><select id="a">${THIRDS.filter((x) => x >= 1.4).map((x) => `<option ${x === 11 ? "selected" : ""}>${x}</option>`).join("")}</select></div>
      <div><label class="f">You want to shoot at</label><select id="b">${THIRDS.filter((x) => x >= 1).map((x) => `<option ${x === 2.8 ? "selected" : ""}>${x}</option>`).join("")}</select></div></div>
      <div class="out" id="o"></div>
      <div class="tablewrap"><table><tr><th>Stops</th><th>ND (optical density)</th><th>Also sold as</th><th>Light let through</th></tr>
      ${[1, 2, 3, 4, 5, 6, 7, 8, 10].map((s) => `<tr><td>${s}</td><td class="num">${(s * 0.3).toFixed(1)}</td><td class="num">ND${Math.pow(2, s)}</td><td class="num">${(100 / Math.pow(2, s)).toFixed(s > 6 ? 2 : 1)}%</td></tr>`).join("")}</table></div>
      <p class="small muted">Optical density 0.3 halves the light. Densities are rounded the way they're sold (0.3 is really 0.301).</p>`;
    const calc = () => {
      const a = parseFloat(el.querySelector("#a").value), b = parseFloat(el.querySelector("#b").value);
      const st = 2 * log2(a / b);
      if (st <= 0.05) { el.querySelector("#o").innerHTML = `<p>No ND needed. You have ${fmt(-st, 1)} stops to spare, or you need more light.</p>`; return; }
      const r = Math.round(st * 3) / 3, nd = Math.ceil(r - 0.05) * 0.3; // ND is sold in full stops (0.3); round toward the stronger one
      el.querySelector("#o").innerHTML = `<div class="big">ND ${nd.toFixed(1)}</div><p>${fmt(r, 1)} stops. Round toward the stronger filter, then open up a third if needed. A variable ND past about 5 stops often shows an X pattern or a color shift, so test it first.</p>`;
    };
    on(el, "select", "change", calc); calc();
  };

  /* ---------------- inverse square ---------------- */
  W.invsq = (el) => {
    el.innerHTML = `<h3>Moving a light</h3>
      <div class="two"><div><label class="f">Distance now (${lenUnit()})</label><input type="number" id="a" value="${units() === "metric" ? 1.5 : 5}" step="0.1" inputmode="decimal"></div>
      <div><label class="f">Distance after (${lenUnit()})</label><input type="number" id="b" value="${units() === "metric" ? 3 : 10}" step="0.1" inputmode="decimal"></div></div>
      <div class="out" id="o"></div>
      <h3>Falloff across the frame</h3><p class="small">How much darker is something behind the subject than the subject? Measure both from the light.</p>
      <div class="two"><div><label class="f">Light to subject</label><input type="number" id="s" value="${units() === "metric" ? 1 : 3}" step="0.1" inputmode="decimal"></div>
      <div><label class="f">Light to back wall</label><input type="number" id="w" value="${units() === "metric" ? 3 : 10}" step="0.1" inputmode="decimal"></div></div>
      <div class="out" id="o2"></div>
      <p class="small muted">Exact for a small source. Big soft sources (a Light Dome up close, a 4x4 frame) fall off a little slower than this until you're a few times their size away.</p>`;
    const calc = () => {
      const a = val(el, "a"), b = val(el, "b"), s = val(el, "s"), w = val(el, "w");
      if (a > 0 && b > 0) {
        const st = 2 * log2(b / a);
        el.querySelector("#o").innerHTML = `<div class="big">${st > 0 ? "-" : "+"}${fmt(Math.abs(st), 2)} stops</div><p>The light gets ${fmt(Math.pow(a / b, 2) * 100, 0)}% as bright. ${st > 0 ? `To keep the exposure, raise the dimmer about ${fmt(Math.pow(2, st), 1)}x (if there's room) or open up ${fmt(st, 1)} stops.` : `To keep the exposure, dim to about ${fmt(100 / Math.pow(2, -st), 0)}% or close down ${fmt(-st, 1)} stops.`}</p>`;
      }
      if (s > 0 && w > 0) {
        const f = 2 * log2(w / s);
        el.querySelector("#o2").innerHTML = `<div class="big">${fmt(f, 1)} stops darker</div><p>${f >= 3 ? "The wall drops toward black: moody, isolated subject." : f >= 1.5 ? "Clear separation; the wall still reads." : "The wall is nearly as bright as the face: flat and even. Move the light closer to the subject, or the subject farther from the wall, for more falloff."}</p>`;
      }
    };
    on(el, "input", "input", calc); calc();
  };

  /* ---------------- contrast ratio ---------------- */
  W.ratio = (el) => {
    el.innerHTML = `<h3>Key to fill</h3><label class="f">Shadow side is this many stops under the lit side</label>
      <input type="range" id="r" min="0" max="5" step="0.333" value="2"><div class="out" id="o"></div>`;
    const looks = [[0.5, "Flat, bright: beauty, sitcom, corporate"], [1.2, "Gentle shape: commercial, interviews"], [2.2, "Shaped and natural: most drama"], [3.2, "Dramatic: thriller, noir leaning"], [9, "Hard drama: the shadow side goes nearly black"]];
    const calc = () => {
      const r = val(el, "r");
      el.querySelector("#o").innerHTML = `<div class="big">${fmt(Math.pow(2, r), 1)} : 1</div><p>${fmt(r, 1)} stops. ${looks.find((l) => r <= l[0])[1]}.</p>
        <svg viewBox="0 0 200 110" width="220"><defs><radialGradient id="rg" cx="35%" cy="40%"><stop offset="0" stop-color="rgb(230,190,160)"/><stop offset="1" stop-color="rgb(${Math.round(230 / Math.pow(2, r * 0.6))},${Math.round(190 / Math.pow(2, r * 0.6))},${Math.round(160 / Math.pow(2, r * 0.6))})"/></radialGradient></defs>
        <rect width="200" height="110" fill="#111"/><ellipse cx="100" cy="55" rx="36" ry="46" fill="url(#rg)"/></svg>`;
    };
    on(el, "input", "input", calc); calc();
  };

  /* ---------------- light angle renders ---------------- */
  const LA = [["front", "Front (0°)"], ["45", "45° side"], ["90", "90° side"], ["135", "135° (kicker)"], ["back", "Behind"], ["top", "Top"], ["under", "Under"]];
  const LA_TXT = {
    front: "Light from beside the lens. Flat, few shadows, hides texture and age. Beauty and on-camera presenters use it. In drama it can look like no one lit it.",
    "45": "The classic key position: about 45° to the side and above the eyes. The face gets shape, and a small triangle of light can land on the far cheek (Rembrandt).",
    "90": "Straight from the side. Half the face lit, half dark: split lighting. Duality, secrets, conflict.",
    "135": "From behind and to the side. Only the edge of the cheek and the jaw catch it: a kicker. It separates the subject from a dark background.",
    back: "From behind. Lights hair and shoulders only (a rim). The face falls dark unless something else fills it. Use it for silhouettes, smoke and night.",
    top: "Straight down. The eyes fall into dark sockets. Mystery, menace, interrogation rooms. The Godfather's office is the famous example.",
    under: "From below. Nothing in nature lights faces this way except fire, phones and flashlights, so it reads as wrong: horror, campfire tales."
  };
  W.lightangle = (el) => {
    let cur = "45";
    function draw() {
      el.innerHTML = `<h3>One light, seven positions</h3><div class="chips">${LA.map(([k, t]) => `<button class="chip ${k === cur ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
        <div class="frame"><img src="img/angle-${cur}.jpg" alt="Render of a face lit from ${cur}"></div><p>${esc(LA_TXT[cur])}</p>
        <p class="small muted">Same hard light (amaran 200x S with its reflector) moved around the subject. Exposure balanced so the lit side reads the same.</p>`;
      on(el, "[data-k]", "click", (e) => { cur = e.currentTarget.dataset.k; draw(); });
    }
    draw();
  };
  W.distance = (el) => {
    let cur = "close";
    function draw() {
      el.innerHTML = `<h3>Same light, two distances</h3><div class="chips"><button class="chip ${cur === "close" ? "on" : ""}" data-k="close">Close (about 3 ft)</button><button class="chip ${cur === "far" ? "on" : ""}" data-k="far">Far (about 10 ft)</button></div>
        <div class="frame"><img src="img/distance-${cur}.jpg" alt="Render, light ${cur}"></div>
        <p>${cur === "close" ? "Close: the 600d in the Light Dome is big next to the face, so it's soft and wraps. It also falls off fast, so the wall behind goes dark." : "Far: the same dome is now small next to the face, so shadows get harder edges. It falls off slowly, so the wall comes up almost as bright as the face. The dimmer went up to about 10x to keep the face the same."}</p>`;
      on(el, "[data-k]", "click", (e) => { cur = e.currentTarget.dataset.k; draw(); });
    }
    draw();
  };

  /* ---------------- scopes: waveform and false color ---------------- */
  // S-Log3 per Sony's technical summary (legal-range IRE). Rec.709 per ITU-R BT.709 camera curve, clipped at 100.
  function slog3(x) {
    let cv = x >= 0.01125 ? 420 + Math.log10((x + 0.01) / 0.19) * 261.5 : (x * (171.2102946929 - 95) / 0.01125) + 95;
    return Math.max(0, Math.min(109, ((cv - 64) / 876) * 100));
  }
  function rec709(x) {
    if (x <= 0) return 0;
    const v = x < 0.018 ? 4.5 * x : 1.099 * Math.pow(x, 0.45) - 0.099;
    return Math.max(0, Math.min(100, v * 100));
  }
  const LOOKS = {
    natural: { t: "Natural / commercial", items: [["Background wall", -1.2, 0, 0.3], ["Face, lit side", 0.9, 0.35, 0.5], ["Face, shadow side", -0.4, 0.5, 0.62], ["White shirt", 2.1, 0.62, 0.75], ["Dark jacket", -3.2, 0.75, 0.95]],
      note: "Everything spread from near the bottom to near the top. Lighter skin on the lit side lands around 60 to 70 on a Rec.709 scope. Darker skin sits lower, 40s to 50s. Nothing clips that matters." },
    highkey: { t: "High key (bright, airy)", items: [["Bright background", 2.4, 0, 0.3], ["Face, lit side", 1.2, 0.35, 0.5], ["Face, shadow side", 0.7, 0.5, 0.62], ["White wardrobe", 2.3, 0.62, 0.85], ["Darkest detail", -1, 0.85, 0.95]],
      note: "Most of the trace lives in the top half. The background sits just under clipping, not crushed into it. Few true blacks. Low contrast on the face (fill close to the key)." },
    lowkey: { t: "Low key / moody", items: [["Dark background", -4.5, 0, 0.3], ["Rim on shoulder", 2.3, 0.3, 0.38], ["Face, lit side", 0.4, 0.38, 0.5], ["Face, shadow side", -2.6, 0.5, 0.62], ["Practical lamp", 4.2, 0.62, 0.7], ["Dark wardrobe", -4, 0.7, 0.95]],
      note: "Most of the trace hugs the bottom. A few hot spikes (the rim, a practical) give the eye something to find. Skin on the lit side sits a little below normal, and the shadow side drops two to three stops." },
    night: { t: "Night interior", items: [["Dark walls", -5, 0, 0.35], ["Window (moonlight)", -1.5, 0.35, 0.45], ["Face, lit side", -0.3, 0.45, 0.58], ["Face, shadow side", -3.2, 0.58, 0.68], ["Lamp bulb", 4.5, 0.68, 0.74], ["Floor", -5.5, 0.74, 1]],
      note: "Dark overall, but the face still gets enough light to stay clean. Make night with contrast and color, not by underexposing everything. You can always pull it down in the grade, but lifting noise up is ugly." }
  };
  const FC = {
    pyxis: { t: "PYXIS false color", bands: [["Red", "#e53935", "Overexposed: clipping"], ["Pink", "#f48fb1", "Good exposure for lighter skin"], ["Green", "#66bb6a", "Good exposure for darker skin"]],
      note: "From Blackmagic's description of the PYXIS false color. Other colors show on screen too. Check the legend in the camera manual for your firmware." },
    sony: { t: "A7S III with Monitor & Control", bands: [["Zebra 61%", "#ffffff", "White card in S-Log3"], ["Zebra 41%", "#bdbdbd", "Gray card in S-Log3"], ["Zebra about 52%", "#f4c7a1", "Lighter skin in S-Log3 (common target)"]],
      note: "The camera itself has zebras but no waveform or false color. Sony's Monitor & Control app on your phone adds waveform, false color and histogram (A7S III needs firmware 3.00 or later). The app shows its own false color legend." },
    generic: { t: "Typical monitor false color", bands: [["Purple", "#8e24aa", "Crushed black"], ["Blue", "#1e88e5", "Just above black"], ["Green", "#43a047", "Middle gray"], ["Pink", "#f06292", "About a stop over gray (lighter skin)"], ["Yellow", "#fdd835", "Near clipping"], ["Red", "#e53935", "Clipping"]],
      note: "A common scheme on field monitors (Atomos, SmallHD and others), but every brand differs. Always read the legend on your own monitor." }
  };
  W.scopes = (el) => {
    let look = "natural", enc = "709", fc = "pyxis";
    function svg() {
      const L = LOOKS[look], w = 320, h = 200, top = 10, bot = 180;
      const y = (ire) => bot - ((bot - top) * ire) / 110;
      let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#0b0d0f"/>`;
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 109].forEach((v) => {
        s += `<line x1="28" x2="${w - 4}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 100 || v === 0 ? "#5a6470" : "#262c33"}"/><text x="2" y="${y(v) + 4}" fill="#7d8791" font-size="9">${v}</text>`;
      });
      const curve = enc === "slog3" ? slog3 : rec709;
      let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      const marks = [];
      L.items.forEach(([name, stops, x0, x1]) => {
        const x = 0.18 * Math.pow(2, stops);
        const ire = curve(x);
        for (let i = 0; i < 90; i++) {
          const px = 28 + (w - 32) * (x0 + (x1 - x0) * rnd());
          const jitter = (rnd() - 0.5) * 6 * (1 + Math.abs(stops) * 0.1);
          s += `<circle cx="${px.toFixed(1)}" cy="${y(Math.max(0, Math.min(109, ire + jitter))).toFixed(1)}" r="1.1" fill="#7CFC9A" fill-opacity=".55"/>`;
        }
        marks.push([name, ire, 28 + (w - 32) * ((x0 + x1) / 2)]);
      });
      if (enc === "slog3") {
        [[41, "Gray card 41"], [61, "White card 61"]].forEach(([v, t]) => { s += `<line x1="28" x2="${w - 4}" y1="${y(v)}" y2="${y(v)}" stroke="#f5c542" stroke-dasharray="3 3"/><text x="${w - 6}" y="${y(v) - 3}" text-anchor="end" fill="#f5c542" font-size="9">${t}</text>`; });
      }
      s += `<text x="160" y="196" text-anchor="middle" fill="#7d8791" font-size="9">left of frame → right of frame</text></svg>`;
      return { s, marks };
    }
    function draw() {
      const L = LOOKS[look], F = FC[fc];
      const r = svg();
      el.innerHTML = `<h3>What the waveform should look like</h3>
        <label class="f">Look you're going for</label><div class="chips">${Object.keys(LOOKS).map((k) => `<button class="chip ${k === look ? "on" : ""}" data-l="${k}">${esc(LOOKS[k].t)}</button>`).join("")}</div>
        <label class="f">What the scope is reading</label><div class="chips"><button class="chip ${enc === "709" ? "on" : ""}" data-e="709">Rec.709 (LUT on)</button><button class="chip ${enc === "slog3" ? "on" : ""}" data-e="slog3">S-Log3 signal (LUT off)</button></div>
        <div class="frame">${r.s}</div>
        <div class="tablewrap"><table><tr><th>Part of the frame</th><th>Lands at</th></tr>${r.marks.map(([n, i]) => `<tr><td>${esc(n)}</td><td class="num">${Math.round(i)}${i >= 99.5 ? " (clipped)" : ""}</td></tr>`).join("")}</table></div>
        <p>${esc(L.note)}</p>
        ${enc === "slog3" ? `<p class="small">S-Log3 looks flat and gray on purpose. Middle gray sits at 41 and a 90% white card at 61, with lots of room above for highlights. Don't expose S-Log3 to look right without a LUT: you'll overexpose by about two stops.</p>` : `<p class="small">This uses the plain Rec.709 curve, which clips at 100. Real camera LUTs roll highlights off more gently, so they land a bit lower.</p>`}
        <h3>False color</h3><div class="chips">${Object.keys(FC).map((k) => `<button class="chip ${k === fc ? "on" : ""}" data-f="${k}">${esc(FC[k].t)}</button>`).join("")}</div>
        <div class="tablewrap"><table>${F.bands.map(([n, c, d]) => `<tr><td><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${c};vertical-align:-2px;margin-right:6px;border:1px solid #555"></span>${esc(n)}</td><td>${esc(d)}</td></tr>`).join("")}</table></div>
        <p class="small">${esc(F.note)}</p>
        <p class="small muted">These waveforms are drawn from the math: each part of the frame is placed in stops above or below middle gray, then sent through the S-Log3 or Rec.709 curve. Real scopes show the same shapes, just messier.</p>`;
      on(el, "[data-l]", "click", (e) => { look = e.currentTarget.dataset.l; draw(); });
      on(el, "[data-e]", "click", (e) => { enc = e.currentTarget.dataset.e; draw(); });
      on(el, "[data-f]", "click", (e) => { fc = e.currentTarget.dataset.f; draw(); });
    }
    draw();
  };

  /* ---------------- Kelvin chart ---------------- */
  function kToRgb(k) { // Tanner Helland approximation, good enough for a swatch
    const t = k / 100; let r, g, b;
    r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
    const c = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
  }
  W.kelvin = (el) => {
    const rows = [[1900, "Candle flame"], [2200, "Sodium-ish streetlight look, sunrise right at the horizon"], [2700, "Household warm-white LED and incandescent bulbs"], [3200, "Film tungsten (studio lamps)"], [4000, "Cool-white office LED and fluorescent"], [5600, "Film daylight (your 600d, HMIs)"], [6500, "Overcast sky"], [8000, "Open shade under a blue sky"]];
    el.innerHTML = `<h3>Color temperature</h3><div class="tablewrap"><table>${rows.map(([k, d]) => `<tr><td><span style="display:inline-block;width:38px;height:18px;border-radius:4px;background:${kToRgb(k)};vertical-align:-4px"></span></td><td class="num">${k} K</td><td>${esc(d)}</td></tr>`).join("")}</table></div>
      <p class="small muted">Values are typical, not exact. Real sources vary a lot, especially LED bulbs and streetlights. Swatches are approximate.</p>
      <h3>Mix two sources</h3><div class="two"><div><label class="f">Camera white balance (K)</label><input type="number" id="wb" value="5600" inputmode="numeric"></div><div><label class="f">Light (K)</label><input type="number" id="lk" value="3200" inputmode="numeric"></div></div><div class="out" id="o"></div>`;
    const calc = () => {
      const wb = val(el, "wb"), lk = val(el, "lk");
      const mired = 1e6 / lk - 1e6 / wb;
      el.querySelector("#o").innerHTML = `<p><span style="display:inline-block;width:60px;height:22px;border-radius:4px;background:${kToRgb(Math.max(1000, Math.min(40000, 1e6 / (1e6 / 6500 + mired))))};vertical-align:-6px"></span>
        The light will look <b>${Math.abs(mired) < 15 ? "neutral" : mired > 0 ? "warm (orange)" : "cool (blue)"}</b> in this white balance. Shift: ${Math.round(mired)} mired. ${Math.abs(mired) >= 15 ? `To make it match, set the light to ${wb} K if it's bi-color, or gel it with ${mired > 0 ? "CTB (blue)" : "CTO (orange)"}.` : ""}</p>`;
    };
    on(el, "input", "input", calc); calc();
  };

  /* ---------------- diffusion and grip reference table ---------------- */
  W.diffusion = (el) => {
    const D = window.GUIDE.diffusion;
    el.innerHTML = `<h3>Diffusion light loss</h3><div class="tablewrap"><table><tr><th>Material</th><th>Loss</th><th>Feel</th></tr>${D.map((d) => `<tr><td>${esc(d[0])}</td><td class="num">${esc(d[1])}</td><td>${esc(d[2])}</td></tr>`).join("")}</table></div>
      <p class="small muted">Loss figures from LEE Filters' published stop values. Real loss depends on how far the diffusion is from the light and how much spill it catches.</p>`;
  };

  /* ---------------- gobo and cookie patterns ---------------- */
  const GOBOS = [
    ["window_4", "Window, 4 panes", "Spotlight gobo. Sunlight or moonlight through a window that isn't in the shot. Put it on the wall behind the actor, a little skewed, so it reads as a real window off-screen."],
    ["window_6", "Window, 6 panes", "Same idea, an older or bigger window. Soften the focus for haze or dawn."],
    ["blinds", "Venetian blinds", "Noir, interrogations, a hot afternoon office. Stripes across the face read as danger or secrets. Tilt it a few degrees so it doesn't look printed."],
    ["leaves", "Leaf breakup", "Dappled light under trees. Breaks up a flat wall or a boring background, and makes a day interior feel like there's a garden outside."],
    ["branches", "Tree branch (cookie)", "A real branch on a C-stand in front of the 600d. Wiggle it for wind. Closer to the subject = sharper leaves."],
    ["dots", "Dots", "Graphic, club or music video looks. Also a stand-in for light through a perforated screen or a lampshade."]
  ];
  W.gobos = (el) => {
    let cur = "window_4";
    function draw() {
      const g = GOBOS.find((x) => x[0] === cur);
      el.innerHTML = `<h3>Patterns</h3><div class="chips">${GOBOS.map(([k, t]) => `<button class="chip ${k === cur ? "on" : ""}" data-k="${k}">${esc(t)}</button>`).join("")}</div>
        <div class="two" style="align-items:center"><div class="frame" style="aspect-ratio:1"><img src="img/gobos/${cur}.png" alt="${esc(g[1])} pattern"></div><p>${esc(g[2])}</p></div>
        <p class="small muted">White is where light gets through. The same patterns are in the Lighting Planner: add one to a light and render to see it in your room.</p>`;
      on(el, "[data-k]", "click", (e) => { cur = e.currentTarget.dataset.k; draw(); });
    }
    draw();
  };

  /* ---------------- phone light meter and Kelvin reader (beta) ---------------- */
  function srgbToLin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function mccamy(R, G, B) {
    const X = 0.4124 * R + 0.3576 * G + 0.1805 * B, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = 0.0193 * R + 0.1192 * G + 0.9505 * B;
    const s = X + Y + Z; if (s <= 0) return NaN;
    const x = X / s, y = Y / s, n = (x - 0.332) / (0.1858 - y);
    return 449 * n * n * n + 3525 * n * n + 6823.3 * n + 5520.33;
  }
  W.meter = (el) => {
    const cal = Object.assign({ ev: null, mired: 0 }, (window.FG.state().settings.meterCal) || {});
    el.innerHTML = `<h3>Phone meter</h3>
      <p class="small">Point the back camera at a white card (or a gray card) held where the face will be, facing the camera position. Fill the circle with the card.</p>
      <div class="meter-wrap"><video id="v" class="meter-video" playsinline muted></video><div class="spot"></div></div>
      <div class="btnrow"><button class="btn primary" id="go">Start camera</button><button class="btn" id="stop" hidden>Stop</button></div>
      <div class="out" id="o"><p>Camera is off.</p></div>
      <div class="three"><div><label class="f">Your ISO</label><input type="number" id="iso" value="800" inputmode="numeric"></div><div><label class="f">fps</label><input type="number" id="fps" value="24" inputmode="decimal"></div><div><label class="f">Shutter °</label><input type="number" id="ang" value="180" inputmode="numeric"></div></div>
      <h3>Calibrate (do this once per phone)</h3>
      <p class="small">Phones don't report true light levels, so this meter learns from your camera. Light a white card, read the T-stop that puts it right on your camera (zebras at 61 on the A7S III in S-Log3), and enter it here while the phone is pointed at the same card.</p>
      <div class="two"><div><label class="f">Correct T-stop for this card</label><select id="ct">${THIRDS.filter((x) => x >= 1).map((x) => `<option ${x === 2.8 ? "selected" : ""}>${x}</option>`).join("")}</select></div><div><label class="f">&nbsp;</label><button class="btn wide" id="cal">Calibrate to this</button></div></div>
      <div class="two"><div><label class="f">Known light (K)</label><input type="number" id="ck" value="5600" inputmode="numeric"></div><div><label class="f">&nbsp;</label><button class="btn wide" id="calk">Calibrate Kelvin</button></div></div>
      <p class="small muted" id="caps"></p>
      <p class="small muted">Beta, and not yet tested on a real phone. It needs the camera permission and an HTTPS address. Readings are estimates: good for comparing lights and keeping setups consistent, not a replacement for a calibrated meter.</p>`;
    const v = el.querySelector("#v"), o = el.querySelector("#o");
    let stream = null, track = null, timer = null, manual = false, last = null;
    const cvs = document.createElement("canvas"), ctx = cvs.getContext("2d", { willReadFrequently: true });
    function stop() { if (timer) clearInterval(timer); timer = null; if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; el.querySelector("#go").hidden = false; el.querySelector("#stop").hidden = true; }
    stoppers.push(stop);
    function sample() {
      if (!v.videoWidth) return;
      const w = 64, h = Math.round((64 * v.videoHeight) / v.videoWidth);
      cvs.width = w; cvs.height = h; ctx.drawImage(v, 0, 0, w, h);
      const r0 = Math.round(w * 0.39), r1 = Math.round(w * 0.61), c0 = Math.round(h / 2 - (w * 0.11)), c1 = Math.round(h / 2 + (w * 0.11));
      const d = ctx.getImageData(r0, c0, r1 - r0, c1 - c0).data;
      let R = 0, Gs = 0, B = 0, n = 0, clip = 0;
      for (let i = 0; i < d.length; i += 4) { R += srgbToLin(d[i]); Gs += srgbToLin(d[i + 1]); B += srgbToLin(d[i + 2]); n++; if (d[i] > 250 || d[i + 1] > 250 || d[i + 2] > 250) clip++; }
      R /= n; Gs /= n; B /= n;
      const Y = 0.2126 * R + 0.7152 * Gs + 0.0722 * B;
      const st = track.getSettings ? track.getSettings() : {};
      const et = st.exposureTime ? st.exposureTime / 10000 : null; // Chrome reports exposureTime in 100-microsecond units
      const iso = st.iso || null;
      let ev = null;
      if (et && iso && Y > 0) ev = log2(Y / (et * iso)); // relative scene brightness
      const K = mccamy(R, Gs, B);
      last = { ev, K, Y, clip: clip / n };
      const ISO = val(el, "iso"), t = val(el, "ang") / 360 / val(el, "fps");
      let line = "";
      if (ev != null && cal.ev != null) {
        // calibration stored the scene ev for a known N at known ISO/t: N^2 = k * 2^ev * ISO * t
        const N = Math.sqrt(cal.k * Math.pow(2, ev) * ISO * t);
        line = `<div class="big">${stopLabel(N)}</div><p class="small">For a white card at your ISO ${ISO} and ${fmt(1 / t, 0)}: put this stop on the lens. Add about 2.3 stops (open up) if you read a gray card instead.</p>`;
      } else if (ev != null) line = `<p>Reading works. Calibrate once below to get T-stops.</p>`;
      else line = `<p>This phone's browser doesn't report exposure, so the meter can only compare: brightness ${fmt(Y * 100, 1)}. Lock nothing and compare two lights by eye only. The APK version will fix this.</p>`;
      const Kc = isFinite(K) ? 1e6 / (1e6 / K + cal.mired) : NaN;
      o.innerHTML = line + `<p>Color: <b>${isFinite(Kc) ? Math.round(Kc / 50) * 50 + " K" : "-"}</b> <span class="small muted">(${cal.mired ? "calibrated" : "not calibrated"})</span></p>${last.clip > 0.05 ? '<p class="small" style="color:var(--bad)">The card is clipping in the phone. Move back or tilt the card.</p>' : ""}`;
    }
    async function start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { o.innerHTML = "<p>This browser can't open the camera here. It needs Chrome and an HTTPS address.</p>"; return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } }, audio: false });
      } catch (e) { o.innerHTML = `<p>Camera not available: ${esc(e.message)}</p>`; return; }
      track = stream.getVideoTracks()[0]; v.srcObject = stream; await v.play().catch(() => {});
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      const adv = {};
      if (caps.whiteBalanceMode && caps.whiteBalanceMode.includes("manual")) { adv.whiteBalanceMode = "manual"; if (caps.colorTemperature) adv.colorTemperature = Math.max(caps.colorTemperature.min, Math.min(caps.colorTemperature.max, 5500)); }
      if (caps.exposureMode && caps.exposureMode.includes("manual")) manual = true;
      try { if (Object.keys(adv).length) await track.applyConstraints({ advanced: [adv] }); } catch (e) { /* keep auto */ }
      el.querySelector("#caps").textContent = `Phone camera reports: exposure ${caps.exposureMode ? caps.exposureMode.join("/") : "not available"}, white balance ${caps.whiteBalanceMode ? caps.whiteBalanceMode.join("/") : "not available"}${manual ? "" : ". Without manual exposure the reading follows the phone's auto exposure, so it's less reliable."}`;
      el.querySelector("#go").hidden = true; el.querySelector("#stop").hidden = false;
      timer = setInterval(sample, 400);
    }
    el.querySelector("#go").addEventListener("click", start);
    el.querySelector("#stop").addEventListener("click", stop);
    on(el, "input", "input", () => { if (stream) sample(); });
    el.querySelector("#cal").addEventListener("click", () => {
      if (!last || last.ev == null) { window.FG.toast("Start the camera on a lit card first"); return; }
      const N = parseFloat(el.querySelector("#ct").value), ISO = val(el, "iso"), t = val(el, "ang") / 360 / val(el, "fps");
      cal.k = (N * N) / (Math.pow(2, last.ev) * ISO * t); cal.ev = last.ev;
      const S = window.FG.state(); S.settings.meterCal = cal; window.FG.save(); window.FG.toast("Meter calibrated");
    });
    el.querySelector("#calk").addEventListener("click", () => {
      if (!last || !isFinite(last.K)) { window.FG.toast("Start the camera on a lit white card first"); return; }
      cal.mired = 1e6 / val(el, "ck") - 1e6 / last.K;
      const S = window.FG.state(); S.settings.meterCal = cal; window.FG.save(); window.FG.toast("Kelvin calibrated");
    });
  };

  /* ---------------- sun position, golden hour, compass ---------------- */
  // NOAA solar position (simplified). Returns azimuth (deg from north, clockwise) and elevation (deg).
  function sunPos(date, lat, lon) {
    const rad = Math.PI / 180, jd = date.getTime() / 86400000 + 2440587.5, T = (jd - 2451545) / 36525;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360, M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * rad) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * rad) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * rad) * 0.000289;
    const lam = L0 + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * rad);
    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60, eps = eps0 + 0.00256 * Math.cos((125.04 - 1934.136 * T) * rad);
    const dec = Math.asin(Math.sin(eps * rad) * Math.sin(lam * rad));
    const y = Math.tan((eps / 2) * rad) ** 2;
    const eqt = 4 / rad * (y * Math.sin(2 * L0 * rad) - 2 * e * Math.sin(M * rad) + 4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad) - 0.5 * y * y * Math.sin(4 * L0 * rad) - 1.25 * e * e * Math.sin(2 * M * rad));
    const mins = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    let tst = (mins + eqt + 4 * lon) % 1440; if (tst < 0) tst += 1440;
    let ha = tst / 4 - 180; if (ha < -180) ha += 360;
    const zen = Math.acos(Math.sin(lat * rad) * Math.sin(dec) + Math.cos(lat * rad) * Math.cos(dec) * Math.cos(ha * rad));
    let az = Math.acos(((Math.sin(lat * rad) * Math.cos(zen)) - Math.sin(dec)) / (Math.cos(lat * rad) * Math.sin(zen))) / rad;
    az = ha > 0 ? (az + 180) % 360 : (540 - az) % 360;
    return { az, el: 90 - zen / rad };
  }
  function findCross(day, lat, lon, target, rising) {
    // scan the day in 2 minute steps for the moment the sun crosses an elevation
    const start = new Date(day); start.setHours(0, 0, 0, 0);
    let prev = sunPos(start, lat, lon).el;
    for (let m = 2; m <= 1440; m += 2) {
      const t = new Date(start.getTime() + m * 60000), e = sunPos(t, lat, lon).el;
      if (rising ? prev < target && e >= target : prev > target && e <= target) return t;
      prev = e;
    }
    return null;
  }
  const hm = (d) => (d ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "none");
  const compassName = (a) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(a / 45) % 8];
  W.sun = (el) => {
    const S = window.FG.state();
    const saved = S.settings.lastPlace || {};
    el.innerHTML = `<h3>Sun and golden hour</h3>
      <div class="btnrow"><button class="btn primary" id="gps">Use my location</button><button class="btn" id="cmp">Turn on compass</button></div>
      <div class="two"><div><label class="f">Latitude</label><input type="number" id="lat" step="0.0001" value="${saved.lat != null ? saved.lat : ""}" placeholder="36.7682" inputmode="decimal"></div>
      <div><label class="f">Longitude</label><input type="number" id="lon" step="0.0001" value="${saved.lon != null ? saved.lon : ""}" placeholder="-76.2875" inputmode="decimal"></div></div>
      <div class="two"><div><label class="f">Date</label><input type="date" id="dt"></div><div><label class="f">Time</label><input type="time" id="tm" style="width:100%;min-height:44px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit"></div></div>
      <svg class="compass" id="dial" viewBox="0 0 220 220"></svg>
      <div class="out" id="o"><p>Enter a place or tap "Use my location".</p></div>
      <p class="small muted">GPS works without cell signal. Sun math follows NOAA's solar position equations (within about a minute). Times use the phone's time zone, so set the date for the shoot. The compass needs the phone's motion sensors, and it can be thrown off by metal, magnets and C-stands nearby.</p>`;
    const now = new Date();
    el.querySelector("#dt").value = now.toISOString().slice(0, 10);
    el.querySelector("#tm").value = now.toTimeString().slice(0, 5);
    let heading = null, sunAz = null;
    function dial() {
      const r = 92, c = 110, rot = heading != null ? -heading : 0;
      let s = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--line)" stroke-width="2"/>`;
      s += `<g transform="rotate(${rot} ${c} ${c})">` + ["N", "E", "S", "W"].map((n, i) => `<text x="${c + Math.sin((i * Math.PI) / 2) * (r - 14)}" y="${c - Math.cos((i * Math.PI) / 2) * (r - 14) + 5}" text-anchor="middle" fill="${n === "N" ? "var(--bad)" : "var(--ink-3)"}" font-size="14" font-weight="700">${n}</text>`).join("");
      if (sunAz != null) { const a = (sunAz * Math.PI) / 180; s += `<line x1="${c}" y1="${c}" x2="${c + Math.sin(a) * (r - 30)}" y2="${c - Math.cos(a) * (r - 30)}" stroke="var(--tungsten)" stroke-width="3"/><circle cx="${c + Math.sin(a) * (r - 30)}" cy="${c - Math.cos(a) * (r - 30)}" r="11" fill="var(--tungsten)"/>`; }
      s += `</g><path d="M${c},${c - r - 2} l-7,-12 h14z" fill="var(--ink)"/>`;
      s += `<text x="${c}" y="${c + 5}" text-anchor="middle" fill="var(--ink-3)" font-size="11">${heading != null ? "Phone points " + compassName(heading) + " " + Math.round(heading) + "°" : "Top = north"}</text>`;
      el.querySelector("#dial").innerHTML = s;
    }
    function calc() {
      const lat = val(el, "lat"), lon = val(el, "lon");
      if (!isFinite(lat) || !isFinite(lon)) { dial(); return; }
      const [y, mo, d] = el.querySelector("#dt").value.split("-").map(Number), [hh, mm] = el.querySelector("#tm").value.split(":").map(Number);
      const when = new Date(y, mo - 1, d, hh || 0, mm || 0), day = new Date(y, mo - 1, d, 12);
      const p = sunPos(when, lat, lon); sunAz = p.az;
      const rise = findCross(day, lat, lon, -0.833, true), set = findCross(day, lat, lon, -0.833, false);
      const gm1 = findCross(day, lat, lon, -4, true), gm2 = findCross(day, lat, lon, 6, true);
      const ge1 = findCross(day, lat, lon, 6, false), ge2 = findCross(day, lat, lon, -4, false);
      const bm1 = findCross(day, lat, lon, -6, true), be2 = findCross(day, lat, lon, -6, false);
      el.querySelector("#o").innerHTML = `<div class="lines">
        <div><span>Sun at that time</span><b>${p.el < -0.8 ? "below the horizon" : Math.round(p.el) + "° up, from the " + compassName(p.az) + " (" + Math.round(p.az) + "°)"}</b></div>
        <div><span>Sunrise</span><b>${hm(rise)}</b></div><div><span>Sunset</span><b>${hm(set)}</b></div>
        <div><span>Morning blue hour</span><b>${hm(bm1)} to ${hm(gm1)}</b></div>
        <div><span>Morning golden hour</span><b>${hm(gm1)} to ${hm(gm2)}</b></div>
        <div><span>Evening golden hour</span><b>${hm(ge1)} to ${hm(ge2)}</b></div>
        <div><span>Evening blue hour</span><b>${hm(ge2)} to ${hm(be2)}</b></div></div>
        <p class="small">${p.el > 45 ? "High sun: hard top light, dark eye sockets. Find shade, fly a 6x6 or 8x8 silk over the actor, or turn them so the sun becomes a backlight." : p.el > 6 ? "Mid-height sun: put it behind or to the side of your actor as a rim, and bounce or fill the face." : p.el > -4 ? "Golden hour: low, warm and soft-edged. Backlight with it and bounce a little back. It changes fast, so shoot the wides first." : p.el > -6 ? "Blue hour: soft, even, blue. Practicals and car lights pop." : "Night."}</p>`;
      dial();
    }
    el.querySelector("#gps").addEventListener("click", () => {
      if (!navigator.geolocation) { window.FG.toast("No location on this device"); return; }
      el.querySelector("#o").innerHTML = "<p>Finding you...</p>";
      navigator.geolocation.getCurrentPosition((pos) => {
        el.querySelector("#lat").value = pos.coords.latitude.toFixed(4); el.querySelector("#lon").value = pos.coords.longitude.toFixed(4);
        S.settings.lastPlace = { lat: +pos.coords.latitude.toFixed(4), lon: +pos.coords.longitude.toFixed(4) }; window.FG.save(); calc();
      }, (err) => { el.querySelector("#o").innerHTML = `<p>Location not available: ${esc(err.message)}. Type the coordinates instead.</p>`; }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 });
    });
    function onOri(e) {
      let h = null;
      if (e.webkitCompassHeading != null) h = e.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) h = (360 - e.alpha) % 360;
      if (h != null) { heading = h; dial(); }
    }
    el.querySelector("#cmp").addEventListener("click", async () => {
      try { if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) await DeviceOrientationEvent.requestPermission(); } catch (e) { /* ignore */ }
      window.addEventListener("deviceorientationabsolute", onOri); window.addEventListener("deviceorientation", onOri);
      stoppers.push(() => { window.removeEventListener("deviceorientationabsolute", onOri); window.removeEventListener("deviceorientation", onOri); });
      window.FG.toast("Hold the phone flat and point its top where the camera looks");
    });
    on(el, "input", "input", calc); on(el, "input", "change", calc); calc();
  };

  window.WIDGETS = W;
  window.FG_MATH = { slog3, rec709, sunPos, stopLabel, mccamy };
})();
