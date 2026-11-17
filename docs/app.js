/* DP Field Guide: router, pages, search, progress, practice log. Content lives in data/content.js and data/setups.js,
   interactive tools in widgets.js. Everything runs offline once loaded (see sw.js). */
(function () {
  "use strict";
  const G = window.GUIDE, S = window.SETUPS, CFG = window.FG_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const view = $("#view");
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- saved state (one key, wrapped in try/catch: storage can be missing or full) ---------- */
  const KEY = "dpfg.v1";
  let ST = { learned: {}, quiz: {}, log: [], settings: {} };
  try { ST = Object.assign(ST, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { /* start fresh */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) { toast("Could not save on this device"); } }
  window.FG = { state: () => ST, save, toast, esc, kit, units };

  function kit() { return Object.assign({}, CFG.kit || {}, ST.settings.kit || {}); }
  function units() { return ST.settings.units || CFG.units || "imperial"; }
  function applyTheme() {
    const t = ST.settings.theme || "auto";
    if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t);
  }
  applyTheme();

  function toast(msg) {
    const d = document.createElement("div"); d.className = "toast"; d.textContent = msg; document.body.appendChild(d);
    setTimeout(() => d.remove(), 2200);
  }

  /* ---------- lookups ---------- */
  const TOPIC = {}; G.sections.forEach((s) => s.topics.forEach((t) => { t.section = s.id; TOPIC[t.id] = t; }));
  const SECTION = {}; G.sections.forEach((s) => (SECTION[s.id] = s));
  const SETUP = {}; S.forEach((x) => (SETUP[x.id] = x));

  function mcLink(id) {
    if (!CFG.masterClassUrl || !id) return "";
    const L = (G.masterClass || {})[id];
    return `<a class="chip" href="${esc(CFG.masterClassUrl)}#lesson-${String(id).replace(/\./g, "-")}" target="_blank" rel="noopener">Master class ${esc(id)}${L ? ": " + esc(L) : ""}</a>`;
  }
  function plannerLink(lesson) {
    if (!CFG.plannerUrl || !lesson) return "";
    return `<a class="chip" href="${esc(CFG.plannerUrl)}/?lesson=${encodeURIComponent(lesson)}" target="_blank" rel="noopener">Open in Lighting Planner</a>`;
  }
  function bookLine(b) {
    const B = G.books[b[0]];
    return `<li><b>${esc(B.short)}</b>: ${esc(b[1])}${b[2] ? ` <span class="muted">(${esc(b[2])})</span>` : ""}</li>`;
  }
  function srcLinks(ids) {
    return (ids || []).map((k) => G.sources[k]).filter(Boolean).map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`).join("");
  }

  /* ---------- pages ---------- */
  function setTitle(t, back) {
    $("#title").textContent = t || "DP Field Guide";
    $("#back").hidden = !back;
    document.title = (t ? t + " - " : "") + "DP Field Guide";
  }
  function setTab(name) { document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === name)); }

  function progress(sec) {
    const n = sec.topics.length, d = sec.topics.filter((t) => ST.learned[t.id]).length;
    return { n, d, pct: n ? Math.round((100 * d) / n) : 0 };
  }

  function pageHome() {
    setTitle("", false); setTab("learn");
    const all = G.sections.reduce((a, s) => a + s.topics.length, 0), done = Object.keys(ST.learned).filter((k) => TOPIC[k]).length;
    const next = nextTopic();
    view.innerHTML = `
      <div class="hero"><h1>Learn the DP's job, with the kit you own.</h1>
        <p>${esc(G.intro)}</p>
        <p class="small muted">${done} of ${all} topics marked learned.</p>
        ${next ? `<a class="btn primary wide" href="#/t/${next.id}">Next up: ${esc(next.title)}</a>` : ""}
      </div>
      <div class="section-label">Sections</div>
      <div class="grid">${G.sections.map((s) => { const p = progress(s); return `
        <a class="tile" href="#/s/${s.id}"><b>${esc(s.title)}</b><span>${esc(s.blurb)}</span><div class="bar"><i style="width:${p.pct}%"></i></div></a>`; }).join("")}
      </div>
      <div class="section-label">More</div>
      <div class="list">
        <a class="row" href="#/setups"><div class="t"><b>Lighting setups</b><span>Example frames, layouts, numbers to dial in, and what to watch for.</span></div><span class="chev">›</span></a>
        <a class="row" href="#/path"><div class="t"><b>Study path</b><span>The order to learn things in, matched to the master class weeks.</span></div><span class="chev">›</span></a>
        <a class="row" href="#/glossary"><div class="t"><b>Glossary</b><span>Every DP term in plain English, from calls to cards.</span></div><span class="chev">›</span></a>
        <a class="row" href="#/sources"><div class="t"><b>Sources and books</b><span>Where every number in this guide comes from.</span></div><span class="chev">›</span></a>
        <a class="row" href="#/settings"><div class="t"><b>Settings and my kit</b><span>Cameras, lenses, lights, units, night mode, backup.</span></div><span class="chev">›</span></a>
      </div>
      <div class="footer">DP Field Guide ${esc(CFG.version || "")}. Works offline once opened.</div>`;
  }

  function nextTopic() {
    for (const s of G.sections) for (const t of s.topics) if (!ST.learned[t.id]) return t;
    return null;
  }

  function pageSection(id) {
    const s = SECTION[id]; if (!s) return notFound();
    setTitle(s.title, true); setTab("learn");
    view.innerHTML = `<p class="lead">${esc(s.blurb)}</p>
      <div class="list">${s.topics.map((t) => `
        <a class="row" href="#/t/${t.id}"><span class="dot ${ST.learned[t.id] ? "done" : ""}"></span><div class="t"><b>${esc(t.title)}</b><span>${esc(t.summary)}</span></div><span class="chev">›</span></a>`).join("")}
      </div>`;
  }

  function quizHtml(t) {
    if (!t.quiz || !t.quiz.length) return "";
    return `<div class="box quiz" id="quiz"><h3>Check yourself</h3>${t.quiz.map((q, i) => `
      <div class="q" data-i="${i}"><b>${esc(q.q)}</b><div class="opts">${q.a.map((a, j) => `<button data-j="${j}">${esc(a)}</button>`).join("")}</div><div class="why" hidden>${esc(q.why || "")}</div></div>`).join("")}
      <div class="small muted" id="qscore"></div></div>`;
  }
  function wireQuiz(t) {
    const box = $("#quiz"); if (!box) return;
    const got = {};
    box.querySelectorAll(".q").forEach((qd) => {
      const i = +qd.dataset.i, q = t.quiz[i];
      qd.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        if (got[i] != null) return;
        const j = +b.dataset.j; got[i] = j === q.c;
        b.classList.add(j === q.c ? "right" : "wrong");
        qd.querySelectorAll("button")[q.c].classList.add("right");
        qd.querySelector(".why").hidden = false;
        const n = Object.keys(got).length;
        if (n === t.quiz.length) {
          const r = Object.values(got).filter(Boolean).length;
          ST.quiz[t.id] = { right: r, of: n, when: new Date().toISOString().slice(0, 10) }; save();
          $("#qscore").textContent = `${r} of ${n} right.` + (r === n ? " Nice. Mark it learned below." : " Read the part you missed, then try the drill.");
        }
      }));
    });
  }

  function pageTopic(id) {
    const t = TOPIC[id]; if (!t) return notFound();
    const sec = SECTION[t.section];
    setTitle(t.title, true); setTab("learn");
    const idx = sec.topics.indexOf(t), nxt = sec.topics[idx + 1];
    const links = [mcLink(t.mc), plannerLink(t.planner), ...(t.setups || []).map((x) => SETUP[x] ? `<a class="chip" href="#/setup/${x}">Setup: ${esc(SETUP[x].title)}</a>` : ""),
      ...(t.tools || []).map((x) => G.tools[x] ? `<a class="chip" href="#/tool/${x}">Tool: ${esc(G.tools[x].title)}</a>` : "")].join("");
    view.innerHTML = `
      <p class="lead">${esc(t.summary)}</p>
      <div class="body">${t.html}</div>
      ${t.widget ? `<div class="box" data-widget="${t.widget}"></div>` : ""}
      ${t.watch ? `<div class="box watch"><h3>Watch out for</h3><ul>${t.watch.map((w) => `<li>${w}</li>`).join("")}</ul></div>` : ""}
      ${t.drill ? `<div class="box drill"><h3>Practice drill</h3><p>${t.drill.intro || ""}</p><ol>${t.drill.steps.map((w) => `<li>${w}</li>`).join("")}</ol>
        ${t.drill.check ? `<p class="small"><b>You got it when:</b> ${t.drill.check}</p>` : ""}
        <a class="btn" href="#/practice/new/${t.id}">Log this drill</a></div>` : ""}
      ${quizHtml(t)}
      ${links ? `<div class="section-label">Go deeper</div><div class="chips">${links}</div>` : ""}
      ${t.book && t.book.length ? `<div class="box ref"><h3>In your books</h3><ul>${t.book.map(bookLine).join("")}</ul></div>` : ""}
      ${t.src && t.src.length ? `<div class="small"><b>Sources:</b><ul>${srcLinks(t.src)}</ul></div>` : ""}
      <div class="btnrow">
        <button class="btn ${ST.learned[t.id] ? "" : "primary"}" id="learned">${ST.learned[t.id] ? "Learned. Tap to unmark" : "Mark as learned"}</button>
        ${nxt ? `<a class="btn" href="#/t/${nxt.id}">Next: ${esc(nxt.title)}</a>` : `<a class="btn" href="#/s/${sec.id}">Back to ${esc(sec.title)}</a>`}
      </div>`;
    $("#learned").addEventListener("click", () => {
      if (ST.learned[t.id]) delete ST.learned[t.id]; else ST.learned[t.id] = new Date().toISOString().slice(0, 10);
      save(); pageTopic(id);
    });
    wireQuiz(t);
    mountWidgets(view);
  }

  function mountWidgets(root) {
    root.querySelectorAll("[data-widget]").forEach((el) => {
      const w = window.WIDGETS[el.dataset.widget];
      if (w) { try { w(el, el.dataset); } catch (e) { el.innerHTML = `<p class="muted">This tool could not start: ${esc(e.message)}</p>`; } }
    });
  }

  function pageSetups() {
    setTitle("Lighting setups", false); setTab("setups");
    const groups = {};
    S.forEach((x) => (groups[x.group] = groups[x.group] || []).push(x));
    view.innerHTML = `<p class="lead">${esc(G.setupsIntro)}</p>` + Object.keys(groups).map((g) => `
      <div class="section-label">${esc(g)}</div>
      <div class="list">${groups[g].map((x) => `
        <a class="row" href="#/setup/${x.id}"><img class="thumb" src="${x.img}" alt="" loading="lazy"><div class="t"><b>${esc(x.title)}</b><span>${esc(x.look)}</span></div><span class="chev">›</span></a>`).join("")}
      </div>`).join("");
  }

  function lightRows(x) {
    const u = units();
    return x.lights.map((L) => `<tr><td><b>${esc(L.label)}</b><br><span class="small muted">${esc(L.fixture)}<br>${esc(L.modifier)}</span></td>
      <td><span class="num">${L.dist_m ? (u === "metric" ? L.dist_m.toFixed(1) + " m" : L.dist_ft.toFixed(1) + " ft") : ""}</span><br><span class="small muted">${esc(L.where)}</span></td>
      <td class="num">${L.power}%<br>${L.cct} K</td></tr>`).join("");
  }

  function pageSetup(id) {
    const x = SETUP[id]; if (!x) return notFound();
    setTitle(x.title, true); setTab("setups");
    const c = x.camera;
    view.innerHTML = `
      <figure><div class="frame"><img src="${x.img}" alt="Example frame: ${esc(x.title)}"></div>
        <figcaption>Rendered in the Lighting Planner from the layout below, with your fixtures. A mannequin stands in for the actor.</figcaption></figure>
      <p class="lead">${esc(x.look)}</p>
      ${x.html || ""}
      <h2>Layout</h2>
      <figure class="frame" style="background:transparent">${x.svg}</figure>
      <h2>Dial this in</h2>
      <div class="tablewrap"><table><tr><th>Light</th><th>Distance</th><th>Level</th></tr>${lightRows(x)}</table></div>
      ${x.props && x.props.length ? `<p class="small"><b>Also on set:</b> ${x.props.map(esc).join("; ")}.</p>` : ""}
      <div class="box ref"><dl class="kv">
        <dt>Camera</dt><dd>${esc(c.body)}, ${esc(c.lens)}</dd>
        <dt>Exposure</dt><dd class="num">${esc(c.exposure)}</dd>
        <dt>Meter at the face</dt><dd class="num">${esc(c.meter)}</dd>
      </dl><p class="small muted">Levels come from the planner's light math and Aputure and Nanlite published output. Modifier losses marked as estimates in the planner are estimates here too. Meter once on set and adjust.</p></div>
      <h2>Steps</h2><ol>${x.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <div class="box watch"><h3>Watch out for</h3><ul>${x.watch.map((s) => `<li>${s}</li>`).join("")}</ul></div>
      ${x.vary ? `<div class="box drill"><h3>Try a variation</h3><ul>${x.vary.map((s) => `<li>${s}</li>`).join("")}</ul><a class="btn" href="#/practice/new/setup-${x.id}">Log this setup</a></div>` : ""}
      <div class="chips">${plannerLink(x.planner)}${(x.mc || []).map(mcLink).join("")}${(x.topics || []).map((k) => TOPIC[k] ? `<a class="chip" href="#/t/${k}">${esc(TOPIC[k].title)}</a>` : "").join("")}</div>
      ${x.book && x.book.length ? `<div class="box ref"><h3>In your books</h3><ul>${x.book.map(bookLine).join("")}</ul></div>` : ""}`;
  }

  function pageTools() {
    setTitle("Tools", false); setTab("tools");
    const groups = {};
    Object.entries(G.tools).forEach(([k, t]) => (groups[t.group] = groups[t.group] || []).push([k, t]));
    view.innerHTML = `<p class="lead">Calculators and on-set helpers. All of them work with no signal.</p>` + Object.keys(groups).map((g) => `
      <div class="section-label">${esc(g)}</div>
      <div class="list">${groups[g].map(([k, t]) => `<a class="row" href="#/tool/${k}"><div class="t"><b>${esc(t.title)}</b><span>${esc(t.blurb)}</span></div>${t.beta ? '<span class="tag warn">Beta</span>' : ""}<span class="chev">›</span></a>`).join("")}</div>`).join("");
  }
  function pageTool(k) {
    const t = G.tools[k]; if (!t) return notFound();
    setTitle(t.title, true); setTab("tools");
    view.innerHTML = `<p class="lead">${esc(t.blurb)}</p>${t.html || ""}<div class="box" data-widget="${t.widget}"></div>
      ${t.topic && TOPIC[t.topic] ? `<div class="chips"><a class="chip" href="#/t/${t.topic}">Learn: ${esc(TOPIC[t.topic].title)}</a></div>` : ""}
      ${t.src ? `<div class="small"><b>Sources:</b><ul>${srcLinks(t.src)}</ul></div>` : ""}`;
    mountWidgets(view);
  }

  /* ---------- practice log ---------- */
  function pagePractice() {
    setTitle("Practice", false); setTab("practice");
    const log = ST.log.slice().reverse();
    const quizzes = Object.entries(ST.quiz);
    view.innerHTML = `
      <p class="lead">Reading makes you informed. Shooting makes you better. Log every drill, even the ugly ones. Note what you'd change, then shoot it again.</p>
      <a class="btn primary wide" href="#/practice/new/">Log a practice shoot</a>
      <div class="section-label">Your log (${log.length})</div>
      ${log.length ? `<div class="list">${log.map((e) => `<a class="row" href="#/practice/entry/${e.id}"><div class="t"><b>${esc(e.title || "Practice")}</b><span>${esc(e.date)} · ${esc((e.change || e.worked || "").slice(0, 90))}</span></div><span class="chev">›</span></a>`).join("")}</div>`
        : `<p class="muted">Nothing logged yet. Pick a drill from any topic, shoot it, and log it here.</p>`}
      ${quizzes.length ? `<div class="section-label">Quiz scores</div><div class="list">${quizzes.map(([k, q]) => TOPIC[k] ? `<a class="row" href="#/t/${k}"><div class="t"><b>${esc(TOPIC[k].title)}</b><span>${q.right} of ${q.of} on ${esc(q.when)}</span></div><span class="chev">›</span></a>` : "").join("")}</div>` : ""}
      <div class="section-label">Backup</div>
      <div class="btnrow"><button class="btn" id="exp">Save log as a file</button><button class="btn" id="imp">Load a saved log</button><input type="file" id="impf" accept="application/json" hidden></div>
      <p class="small muted">Your log lives only on this phone. Save a copy now and then. It's also how you'd move it to a new phone.</p>`;
    $("#exp").addEventListener("click", exportLog);
    $("#imp").addEventListener("click", () => $("#impf").click());
    $("#impf").addEventListener("change", importLog);
  }
  function exportLog() {
    const blob = new Blob([JSON.stringify({ app: "dp-field-guide", saved: new Date().toISOString(), data: ST }, null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "dp-field-guide-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importLog(ev) {
    const f = ev.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result); if (d.app !== "dp-field-guide" || !d.data) throw new Error("not a field guide backup");
        const ids = new Set(ST.log.map((e) => e.id));
        (d.data.log || []).forEach((e) => { if (!ids.has(e.id)) ST.log.push(e); });
        Object.assign(ST.learned, d.data.learned || {}); Object.assign(ST.quiz, d.data.quiz || {});
        save(); toast("Backup loaded"); pagePractice();
      } catch (e) { toast("That file is not a Field Guide backup"); }
    };
    r.readAsText(f);
  }
  function pageNewEntry(from, editId) {
    setTitle(editId ? "Edit entry" : "Log a shoot", true); setTab("practice");
    const e = editId ? ST.log.find((x) => x.id === editId) || {} : {};
    let title = e.title || "";
    if (!editId && from) {
      if (from.startsWith("setup-") && SETUP[from.slice(6)]) title = "Setup: " + SETUP[from.slice(6)].title;
      else if (TOPIC[from]) title = "Drill: " + TOPIC[from].title;
    }
    const K = kit();
    view.innerHTML = `
      <label class="f">What you practiced</label><input type="text" id="e_title" value="${esc(title)}" placeholder="Drill or setup name">
      <div class="two"><div><label class="f">Date</label><input type="date" id="e_date" value="${esc(e.date || new Date().toISOString().slice(0, 10))}"></div>
      <div><label class="f">Camera</label><select id="e_cam">${(K.cameras || []).map((c) => `<option ${e.cam === c.name ? "selected" : ""}>${esc(c.name)}</option>`).join("")}<option ${e.cam === "Other" ? "selected" : ""}>Other</option></select></div></div>
      <label class="f">Settings (lens, T-stop, ISO, shutter, white balance, ND)</label><input type="text" id="e_set" value="${esc(e.settings || "")}" placeholder="50mm, T2.8, ISO 800, 180°, 5600K, ND 0.6">
      <label class="f">Lights and where they were</label><textarea id="e_lights" placeholder="200x S in Light Dome III, 45° camera left, 5 ft, 40%">${esc(e.lights || "")}</textarea>
      <label class="f">What worked</label><textarea id="e_worked">${esc(e.worked || "")}</textarea>
      <label class="f">What you'd change next time</label><textarea id="e_change">${esc(e.change || "")}</textarea>
      <label class="f">Clip names or where the footage is</label><input type="text" id="e_clips" value="${esc(e.clips || "")}" placeholder="A001_C004, F:\\Lighting Practice\\...">
      <div class="btnrow"><button class="btn primary" id="e_save">Save</button>${editId ? '<button class="btn" id="e_del">Delete</button>' : ""}</div>`;
    $("#e_save").addEventListener("click", () => {
      const rec = { id: editId || "e" + Date.now().toString(36), from: e.from || from || "", title: $("#e_title").value.trim(), date: $("#e_date").value, cam: $("#e_cam").value,
        settings: $("#e_set").value.trim(), lights: $("#e_lights").value.trim(), worked: $("#e_worked").value.trim(), change: $("#e_change").value.trim(), clips: $("#e_clips").value.trim() };
      if (editId) ST.log = ST.log.map((x) => (x.id === editId ? rec : x)); else ST.log.push(rec);
      save(); toast("Saved"); location.hash = "#/practice/entry/" + rec.id;
    });
    if (editId) $("#e_del").addEventListener("click", () => {
      if (!confirm("Delete this entry?")) return;
      ST.log = ST.log.filter((x) => x.id !== editId); save(); location.hash = "#/practice";
    });
  }
  function pageEntry(id) {
    const e = ST.log.find((x) => x.id === id); if (!e) return notFound();
    setTitle(e.title || "Entry", true); setTab("practice");
    const from = e.from && (TOPIC[e.from] ? `#/t/${e.from}` : e.from.startsWith("setup-") ? `#/setup/${e.from.slice(6)}` : "");
    view.innerHTML = `<dl class="kv"><dt>Date</dt><dd>${esc(e.date)}</dd><dt>Camera</dt><dd>${esc(e.cam)}</dd><dt>Settings</dt><dd>${esc(e.settings)}</dd><dt>Clips</dt><dd>${esc(e.clips)}</dd></dl>
      <h3>Lights</h3><p>${esc(e.lights) || '<span class="muted">None noted</span>'}</p>
      <h3>What worked</h3><p>${esc(e.worked) || '<span class="muted">None noted</span>'}</p>
      <h3>Next time</h3><p>${esc(e.change) || '<span class="muted">None noted</span>'}</p>
      <div class="btnrow"><a class="btn" href="#/practice/edit/${e.id}">Edit</a>${from ? `<a class="btn" href="${from}">Open the drill</a>` : ""}</div>`;
  }

  /* ---------- other pages ---------- */
  function pagePath() {
    setTitle("Study path", true); setTab("learn");
    view.innerHTML = `<p class="lead">${esc(G.path.intro)}</p>` + G.path.steps.map((p) => `
      <div class="box"><h3>${esc(p.title)}</h3><p class="small muted">${esc(p.when)}</p><p>${esc(p.why)}</p>
      <div class="chips">${p.topics.map((k) => TOPIC[k] ? `<a class="chip ${ST.learned[k] ? "on" : ""}" href="#/t/${k}">${esc(TOPIC[k].title)}</a>` : "").join("")}${(p.mc || []).map(mcLink).join("")}</div></div>`).join("");
  }
  function pageGlossary() {
    setTitle("Glossary", true); setTab("learn");
    const cats = [];
    G.glossary.forEach(([w, d, c]) => { c = c || "Terms"; if (!cats.includes(c)) cats.push(c); });
    const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    view.innerHTML = `<p class="lead">Every term a DP uses, in plain English and tied to your own kit. Tap a group to jump.</p>
      <div class="chips">${cats.map((c) => `<a class="chip" href="#/glossary" data-jump="${slug(c)}">${esc(c)}</a>`).join("")}</div>` +
      cats.map((c) => `<div class="section-label" id="gc-${slug(c)}">${esc(c)}</div><div class="list">${G.glossary.filter((g) => (g[2] || "Terms") === c).map(([w, d]) => `<div class="row" id="g-${slug(w)}"><div class="t"><b>${esc(w)}</b><span>${esc(d)}</span></div></div>`).join("")}</div>`).join("");
    view.querySelectorAll("[data-jump]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault(); const t = document.getElementById("gc-" + a.dataset.jump); if (t) window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY - 70);
    }));
  }
  function pageSources() {
    setTitle("Sources and books", true); setTab("learn");
    view.innerHTML = `<p class="lead">${esc(G.sourcesIntro)}</p>
      <h2>Books</h2>${Object.values(G.books).map((b) => `<div class="box ref"><b>${esc(b.title)}</b><p class="small">${esc(b.note)}</p></div>`).join("")}
      <h2>Web sources</h2><ul>${srcLinks(Object.keys(G.sources))}</ul>`;
  }
  function pageSettings() {
    setTitle("Settings and my kit", true); setTab("learn");
    const K = kit();
    view.innerHTML = `
      <label class="f">Units</label><select id="s_units"><option value="imperial">Feet</option><option value="metric">Meters</option></select>
      <label class="f">Look</label><select id="s_theme"><option value="auto">Match the phone</option><option value="dark">Dark</option><option value="light">Light</option><option value="night">Night (red, keeps your eyes dark-adapted)</option></select>
      <h2>My kit</h2><p class="small muted">The calculators and the log use this list. Edit it as plain text, one item per line. Cameras: name, sensor width mm, sensor height mm, base ISOs.</p>
      <label class="f">Cameras</label><textarea id="s_cams" rows="5">${esc((K.cameras || []).map((c) => [c.name, c.w, c.h, (c.iso || []).join("/")].join(", ")).join("\n"))}</textarea>
      <label class="f">Lenses (focal length in mm, then a name)</label><textarea id="s_lenses" rows="6">${esc((K.lenses || []).map((l) => l.f + ", " + l.name).join("\n"))}</textarea>
      <label class="f">Lights</label><textarea id="s_lights" rows="6">${esc((K.lights || []).join("\n"))}</textarea>
      <div class="btnrow"><button class="btn primary" id="s_save">Save</button><button class="btn" id="s_reset">Reset to the default kit</button></div>
      <h2>Install on your phone</h2><p>${esc(G.installHelp)}</p>`;
    $("#s_units").value = units(); $("#s_theme").value = ST.settings.theme || "auto";
    $("#s_units").addEventListener("change", (e) => { ST.settings.units = e.target.value; save(); });
    $("#s_theme").addEventListener("change", (e) => { ST.settings.theme = e.target.value; save(); applyTheme(); });
    $("#s_save").addEventListener("click", () => {
      const cams = $("#s_cams").value.split("\n").map((l) => l.split(",").map((s) => s.trim())).filter((p) => p[0] && +p[1] > 0 && +p[2] > 0)
        .map((p) => ({ name: p[0], w: +p[1], h: +p[2], iso: (p[3] || "").split("/").map(Number).filter(Boolean) }));
      const lenses = $("#s_lenses").value.split("\n").map((l) => { const m = l.match(/^\s*([\d.]+)\s*(?:-\s*([\d.]+))?\s*,?\s*(.*)$/); return m ? { f: m[2] ? m[1] + "-" + m[2] : +m[1], name: m[3] || m[1] + "mm" } : null; }).filter(Boolean);
      const lights = $("#s_lights").value.split("\n").map((s) => s.trim()).filter(Boolean);
      ST.settings.kit = { cameras: cams, lenses, lights }; save(); toast("Kit saved");
    });
    $("#s_reset").addEventListener("click", () => { delete ST.settings.kit; save(); pageSettings(); toast("Default kit restored"); });
  }

  /* ---------- search ---------- */
  const IDX = [];
  const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
  G.sections.forEach((s) => s.topics.forEach((t) => IDX.push({ href: "#/t/" + t.id, title: t.title, sub: s.title, text: (t.title + " " + t.summary + " " + strip(t.html) + " " + (t.keywords || "")).toLowerCase() })));
  S.forEach((x) => IDX.push({ href: "#/setup/" + x.id, title: x.title, sub: "Setup", text: (x.title + " " + x.look + " " + strip(x.html) + " " + x.watch.join(" ") + " " + (x.keywords || "")).toLowerCase() }));
  Object.entries(G.tools).forEach(([k, t]) => IDX.push({ href: "#/tool/" + k, title: t.title, sub: "Tool", text: (t.title + " " + t.blurb + " " + (t.keywords || "")).toLowerCase() }));
  G.glossary.forEach(([w, d, c]) => IDX.push({ href: "#/glossary", title: w, sub: "Glossary" + (c ? ": " + c : ""), text: (w + " " + d + " " + (c || "")).toLowerCase() }));

  function pageSearch(q) {
    setTitle("Search", true);
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = !words.length ? [] : IDX.map((e) => {
      let score = 0;
      for (const w of words) { if (!e.text.includes(w)) return null; score += e.title.toLowerCase().includes(w) ? 5 : 1; }
      return [score, e];
    }).filter(Boolean).sort((a, b) => b[0] - a[0]).slice(0, 40).map((x) => x[1]);
    view.innerHTML = words.length ? (hits.length ? `<div class="list">${hits.map((e) => `<a class="row" href="${e.href}"><div class="t"><b>${esc(e.title)}</b><span>${esc(e.sub)}</span></div><span class="chev">›</span></a>`).join("")}</div>`
      : `<p class="muted">Nothing found for "${esc(q)}". Try one word, like "diffusion" or "zebra".</p>`) : `<p class="muted">Type a word above.</p>`;
  }
  $("#searchBtn").addEventListener("click", () => {
    const bar = $("#searchBar"); bar.hidden = !bar.hidden;
    if (!bar.hidden) { $("#q").focus(); if ($("#q").value) location.hash = "#/search/" + encodeURIComponent($("#q").value); }
  });
  let qt;
  $("#q").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => { location.hash = "#/search/" + encodeURIComponent(e.target.value); }, 180); });
  $("#back").addEventListener("click", () => { if (history.length > 1) history.back(); else location.hash = "#/"; });

  function notFound() { setTitle("Not found", true); view.innerHTML = `<p>That page isn't here. <a href="#/">Go home</a>.</p>`; }

  /* ---------- router ---------- */
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [a, b, c] = h.split("/");
    if (a !== "search") $("#searchBar").hidden = true;
    window.WIDGETS && window.WIDGETS._stop && window.WIDGETS._stop();
    if (!a) pageHome();
    else if (a === "s") pageSection(b);
    else if (a === "t") pageTopic(b);
    else if (a === "setups") pageSetups();
    else if (a === "setup") pageSetup(b);
    else if (a === "tools") pageTools();
    else if (a === "tool") pageTool(b);
    else if (a === "practice" && b === "new") pageNewEntry(c || "");
    else if (a === "practice" && b === "edit") pageNewEntry("", c);
    else if (a === "practice" && b === "entry") pageEntry(c);
    else if (a === "practice") pagePractice();
    else if (a === "path") pagePath();
    else if (a === "glossary") pageGlossary();
    else if (a === "sources") pageSources();
    else if (a === "settings") pageSettings();
    else if (a === "search") { $("#searchBar").hidden = false; if ($("#q").value !== (b || "")) $("#q").value = b || ""; pageSearch(b || ""); }
    else notFound();
    if (a !== "search") window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => { /* offline install not available here */ });
  }
})();
