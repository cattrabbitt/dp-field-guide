# DP Field Guide

Part of Cam's Filmmaker Toolbox. A phone-first cinematography guide that works with no signal:

- **Learn:** short lessons on framing, camera angles, lenses, exposure, scopes and false color (PYXIS 6K and Sony A7S III), light, and grip. Each lesson ends with a practice drill, a self-check, pointers into Box's *Set Lighting Technician's Handbook* and Landau's *Lighting for Cinematography*, and links to the matching Master Class lesson and Lighting Planner lesson.
- **Setups:** 12 lighting setups, each with an example frame rendered in the Lighting Planner, an overhead layout, the light levels to dial in with your own fixtures, the steps, and what to watch out for.
- **Tools:** field of view, depth of field, exposure comparison, lux to T-stop, shutter angle and flicker, ND, light distance, contrast ratio, Kelvin, diffusion chart, a phone light meter and Kelvin reader (beta), and sun position with golden hour and a compass.
- **Practice:** a log of every drill you shoot, kept on the phone, with backup to a file.

## Use it

Open the site in Chrome on the phone, then menu > "Add to Home screen" (or "Install app"). After the first visit everything is stored on the phone and works offline. GPS and the compass don't need signal either.

When the Lighting Planner runs on the PC, it also serves the guide at `http://localhost:8765/guide/` (and to the phone page), and its Field Guide button opens it. The planner looks for the guide in its own `guide` folder first, then in a `DP Field Guide` folder beside the `Lighting Planner` folder.

## Files

| Path | What it is |
|---|---|
| `index.html`, `style.css`, `app.js` | The app: pages, search, progress, practice log. |
| `widgets.js` | The calculators, scopes, meter and sun tools. |
| `data/content.js` | All lesson text, quizzes, tools list, glossary and sources. Edit this to change the lessons. |
| `data/setups.js` | Generated from Lighting Planner plans by `gen_setups.py`. Don't edit by hand. |
| `img/` | Example frames rendered in the Lighting Planner (Blender Cycles). |
| `config.js` | Default kit (cameras, lenses, lights) and the links to the Master Class and the Lighting Planner. |
| `sw.js` | Offline cache. Rebuilt by `python tools/build.py` after any change. |

## Publishing on GitHub Pages

1. Create an empty repository on github.com (for example `dp-field-guide`).
2. Push this folder to it.
3. In the repository: Settings > Pages > Deploy from a branch > `main` / root.
4. The guide is then at `https://<user>.github.io/dp-field-guide/`.

Run `python tools/build.py` before every push so phones pick up the new version.

## Tested and not tested

Tested (headless Chrome at a Pixel-size screen, 412 x 915):
- Every page, topic, tool and setup opens with no errors and no sideways scrolling.
- Calculator results checked by hand: field of view, depth of field, lux to T-stop, ND, inverse square, shutter angle and flicker, S-Log3 levels (gray 41, white 61, black 3.5, per Sony), sun position at solar noon.
- Practice log, quiz scoring, "mark as learned", and offline reload after the first visit.

Not tested:
- On a real Pixel 11 Pro. Installing to the home screen, the camera meter, GPS and the compass all need a real phone and an HTTPS address.
- The phone meter's accuracy. It has to be calibrated once against your camera or a real meter.

## Sources

Every number links to its source inside the app (Sources and books page). Book pointers name chapters only and paraphrase; no text is copied from either book.
