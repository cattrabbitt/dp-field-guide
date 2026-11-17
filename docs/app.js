/* DP Field Guide: router, pages and search. Content lives in data/content.js and data/setups.js,
   interactive tools in widgets.js. Everything runs offline once loaded (see sw.js). */
(function () {
  "use strict";
  const G = window.GUIDE, S = window.SETUPS, CFG = window.FG_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const view = $("#view");
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- saved state (one key, wrapped in try/catch: storage can be missing or full) ---------- */
  const KEY = "dpfg.v1";
  let ST = { settings: {} };
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
  const TL = G.topicLinks || {};
  const SETUP = {}; S.forEach((x) => (SETUP[x.id] = x));

  function mcLink(id) {
    if (!CFG.masterClassUrl || !id) return "";
    const L = (G.masterClass || {})[id];
    return `<a class="chip" href="${mcHref(id)}" target="_blank" rel="noopener">Master Class ${esc(id)}${L ? ": " + esc(L) : ""}</a>`;
  }
  function mcHref(id) { return esc(CFG.masterClassUrl) + "#lesson-" + String(id).replace(/\./g, "-"); }
  function lessonButton(id) {
    if (!CFG.masterClassUrl || !id) return "";
    const L = (G.masterClass || {})[id];
    return `<a class="btn wide" href="${mcHref(id)}" target="_blank" rel="noopener">Full lesson in the Master Class${L ? ": " + esc(L) : ""}</a>
      <p class="small muted center">Opens your private Master Class in the Claude app. Needs signal.</p>`;
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

  function pageHome() { pageTools(true); }

  function pageOldTopic(id) {
    const t = TL[id]; if (!t) return notFound();
    if (t.tool && G.tools[t.tool]) { location.replace("#/tool/" + t.tool); return; }
    setTitle(t.title, true); setTab("tools");
    view.innerHTML = `<p class="lead">This lesson lives in your Master Class now. The Field Guide keeps the on-set tools.</p>${lessonButton(t.mc)}
      <a class="btn wide" href="#/">Open the tools</a>`;
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
      ${x.vary ? `<div class="box drill"><h3>Try a variation</h3><ul>${x.vary.map((s) => `<li>${s}</li>`).join("")}</ul></div>` : ""}
      <div class="chips">${plannerLink(x.planner)}${(x.mc || []).map(mcLink).join("")}${[...new Set((x.topics || []).map((k) => TL[k] && TL[k].tool).filter(Boolean))].map((k) => G.tools[k] ? `<a class="chip" href="#/tool/${k}">Tool: ${esc(G.tools[k].title)}</a>` : "").join("")}</div>
      ${x.book && x.book.length ? `<div class="box ref"><h3>In your books</h3><ul>${x.book.map(bookLine).join("")}</ul></div>` : ""}`;
  }

  function pageTools(home) {
    setTitle(home ? "" : "Tools", false); setTab("tools");
    const groups = {};
    Object.entries(G.tools).forEach(([k, t]) => (groups[t.group] = groups[t.group] || []).push([k, t]));
    view.innerHTML = `<div class="hero"><h1>Tools for the set.</h1><p>${esc(G.intro)}</p></div>` + Object.keys(groups).map((g) => `
      <div class="section-label">${esc(g)}</div>
      <div class="list">${groups[g].map(([k, t]) => `<a class="row" href="#/tool/${k}"><div class="t"><b>${esc(t.title)}</b><span>${esc(t.blurb)}</span></div>${t.beta ? '<span class="tag warn">Beta</span>' : ""}<span class="chev">›</span></a>`).join("")}</div>`).join("") + `
      <div class="section-label">More</div>
      <div class="list">
        <a class="row" href="#/setups"><div class="t"><b>Lighting setups</b><span>Example frames, layouts and levels to dial in with your lights.</span></div><span class="chev">›</span></a>
        <a class="row" href="#/glossary"><div class="t"><b>Glossary</b><span>Every DP term in plain English.</span></div><span class="chev">›</span></a>
        <a class="row" href="#/sources"><div class="t"><b>Sources and books</b><span>Where every number comes from.</span></div><span class="chev">›</span></a>
      </div>
      <div class="footer">DP Field Guide ${esc(CFG.version || "")}. Works offline once opened.</div>`;
  }
  function pageTool(k) {
    const t = G.tools[k]; if (!t) return notFound();
    setTitle(t.title, true); setTab("tools");
    const setups = S.filter((x) => (x.topics || []).some((q) => TL[q] && TL[q].tool === k));
    view.innerHTML = `<p class="lead">${esc(t.blurb)}</p>
      ${t.how ? `<div class="box"><h3>How to use it</h3><ol>${t.how.map((w) => `<li>${esc(w)}</li>`).join("")}</ol></div>` : ""}
      <div class="box" data-widget="${t.widget}"></div>
      ${t.means ? `<h3>What the answer means</h3><p>${esc(t.means)}</p>` : ""}
      ${t.kit ? `<div class="box ref"><h3>With your kit</h3><p>${esc(t.kit)}</p></div>` : ""}
      ${lessonButton(t.mc)}
      ${setups.length ? `<div class="section-label">Setups that use it</div><div class="chips">${setups.map((x) => `<a class="chip" href="#/setup/${x.id}">${esc(x.title)}</a>`).join("")}</div>` : ""}
      ${t.src ? `<div class="small"><b>Sources:</b><ul>${srcLinks(t.src)}</ul></div>` : ""}`;
    mountWidgets(view);
  }

  /* ---------- other pages ---------- */
  function pageGlossary() {
    setTitle("Glossary", false); setTab("glossary");
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
    setTitle("Sources and books", true); setTab("tools");
    view.innerHTML = `<p class="lead">${esc(G.sourcesIntro)}</p>
      <h2>Books</h2>${Object.values(G.books).map((b) => `<div class="box ref"><b>${esc(b.title)}</b><p class="small">${esc(b.note)}</p></div>`).join("")}
      <h2>Web sources</h2><ul>${srcLinks(Object.keys(G.sources))}</ul>`;
  }
  function pageSettings() {
    setTitle("Settings and my kit", false); setTab("settings");
    const K = kit();
    view.innerHTML = `
      <label class="f">Units</label><select id="s_units"><option value="imperial">Feet</option><option value="metric">Meters</option></select>
      <label class="f">Look</label><select id="s_theme"><option value="auto">Match the phone</option><option value="dark">Dark</option><option value="light">Light</option><option value="night">Night (red, keeps your eyes dark-adapted)</option></select>
      <h2>My kit</h2><p class="small muted">The tools use this list. Edit it as plain text, one item per line. Cameras: name, sensor width mm, sensor height mm, base ISOs.</p>
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
  S.forEach((x) => IDX.push({ href: "#/setup/" + x.id, title: x.title, sub: "Setup", text: (x.title + " " + x.look + " " + strip(x.html) + " " + x.watch.join(" ") + " " + (x.keywords || "")).toLowerCase() }));
  Object.entries(G.tools).forEach(([k, t]) => IDX.push({ href: "#/tool/" + k, title: t.title, sub: "Tool", text: (t.title + " " + t.blurb + " " + (t.how || []).join(" ") + " " + (t.means || "") + " " + (t.kit || "") + " " + (t.keywords || "")).toLowerCase() }));
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
    else if (a === "t") pageOldTopic(b);
    else if (a === "s" || a === "path" || a === "practice") location.replace("#/");
    else if (a === "setups") pageSetups();
    else if (a === "setup") pageSetup(b);
    else if (a === "tools") pageTools();
    else if (a === "tool") pageTool(b);
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
