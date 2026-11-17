/* DP Field Guide content. Plain-language explainers, drills and self-checks.
   Facts with numbers carry a source id (see "sources" at the bottom). Book pointers name chapters, not pages.
   Topic fields: id, title, summary, html, widget, watch, drill {intro, steps, check}, quiz [{q, a, c, why}],
   book [[bookId, where]], mc (master class lesson id), planner (Lighting Planner lesson id), setups, tools, src, keywords. */
window.GUIDE = {
  intro: "The DP's job, taught with the gear you own. Short lessons you can read in a few minutes, a drill for each one, and tools that work on set with no signal. Read one topic, shoot its drill, log it, repeat.",
  setupsIntro: "Each setup has an example frame, the overhead layout, the light levels to dial in with your own kit, the steps, and what usually goes wrong.",
  sourcesIntro: "Every number in this guide links to where it came from. The two books are the deeper read. Pointers name the chapter so you can find it in either edition.",
  installHelp: "Open this page in Chrome on your phone, tap the three-dot menu, then \"Add to Home screen\" or \"Install app\". After the first visit everything works with no signal. Your practice log and settings stay on the phone.",

  books: {
    box: { short: "Box, Set Lighting Technician's Handbook", title: "Harry C. Box, Set Lighting Technician's Handbook (5th edition, Routledge, 2020)",
      note: "The working electrician's and gaffer's bible: tools, rigging, stands, diffusion, color, power and set etiquette. Chapter names used here: 3 Lighting Objectives, 4 Lighting Strategies, 5 Manipulating Light, 6 Color, 7 LED Lights, 10 Stands and Rigging, 11 Set Protocol, Appendix C Flicker-free Frame Rates, Appendix G Gels and Diffusions." },
    landau: { short: "Landau, Lighting for Cinematography", title: "David Landau, Lighting for Cinematography (CineTech Guides, 2014)",
      note: "A one-semester course in lighting for story, with exercises at the end of each chapter. Chapter names used here: 3 Lighting the Subject, 4 Light the Shot, Not Just the Subject, 5 Common Practical Lighting Set-ups, 6 Lighting for Movement, 7 and 8 Dealing with Daylight (exteriors, windows), 9 Night Light, 10 Working with Color, 14 Inspiration and Lighting Looks." }
  },

  masterClass: { "1.1": "Seeing light", "1.2": "Shaping soft light", "1.3": "Hard light and sunlight", "1.4": "Color, practicals and night",
    "2.1": "Log and RAW exposure", "2.2": "Log and RAW exposure", "2.3": "Matching cameras", "3.1": "Focal length", "3.2": "Zooms and vintage glass",
    "4.1": "Coverage", "4.2": "Blocking and movement", "4.3": "Drone", "7.1": "Prep and directing", "7.2": "Prep and directing", "5.1": "Color management", "5.2": "Node tree", "5.3": "Looks and LUTs" },

  path: {
    intro: "If you're starting out, go in this order. Each block lines up with the master class weeks, so you can read the guide topic on set and the master class lesson at home.",
    steps: [
      { title: "1. The DP's job", when: "Before week 1, and before every shoot", why: "Know what you own as DP, from prep to wrap, and the order you work in on every setup.", topics: ["dpjob", "process"], mc: ["7.1"] },
      { title: "2. See light", when: "Master class week 1", why: "Before you place a single light, learn to describe the light you already have: how big, from where, how much contrast.", topics: ["hardsoft", "angles", "height", "ratios"], mc: ["1.1"] },
      { title: "3. Shape soft light", when: "Master class week 2", why: "Soft light, bounce and negative fill do most of the work on small shoots.", topics: ["bounce", "negfill", "diffusion", "shortbroad", "window"], mc: ["1.2"] },
      { title: "4. Cut and control", when: "Master class week 3", why: "Hard light and sunlight only look good when you control where they go.", topics: ["flags", "scrims", "gobos", "cinefoil", "cstand", "falloff"], mc: ["1.3"] },
      { title: "5. Color and night", when: "Master class week 4", why: "Color temperature and practicals are how you make a place and a time of day.", topics: ["kelvin", "practicals"], mc: ["1.4"] },
      { title: "6. Expose with confidence", when: "Master class weeks 5 to 6", why: "Log and RAW reward exposing by the numbers. Scopes and false color are how you get there.", topics: ["exposure-basics", "tstop", "shutter", "iso", "nd", "wb", "waveform", "falsecolor", "slog3", "pyxis", "looks"], mc: ["2.1", "2.2", "2.3"] },
      { title: "7. Lenses", when: "Master class weeks 6 to 7", why: "Focal length and distance decide what the audience feels about space and people.", topics: ["focal", "perspective", "dof", "mylenses"], mc: ["3.1", "3.2"] },
      { title: "8. Frame and move", when: "Master class weeks 7 to 8", why: "Composition, camera angle and movement carry the story when nobody is talking.", topics: ["thirds", "shotsizes", "depth", "line", "camheight", "movement", "support"], mc: ["4.1", "4.2"] },
      { title: "9. Run your camera department", when: "Master class week 12, and any time", why: "The calls, the cards and the scout are how a small camera crew stays safe and fast.", topics: ["calling", "data", "scout"], mc: ["7.1", "7.2"] }
    ]
  },

  sections: [
    /* ======================================================= THE DP'S JOB */
    { id: "onset", title: "The DP's job", blurb: "What the DP does from prep to wrap, the calls behind the camera, cards and backups, and the tech scout.", topics: [
      { id: "dpjob", title: "The DP's job, start to finish", mc: "7.1", summary: "Prep, shoot day and wrap: what you own as DP, and what to hand off on a small crew.",
        keywords: "director of photography cinematographer job role prep shoot day wrap lookbook shot list lighting plan gear list small crew one man band",
        html: `<p>The DP turns the script into pictures. You own the look: where the camera goes, which lens, how it moves, how the light falls and how it's exposed. On your shoots you're usually DP, camera operator and gaffer at once, and on your own films the director too. That makes prep more important, not less.</p>
          <h3>Prep (before shoot day)</h3>
          <ol><li><b>Read for pictures.</b> Mark every scene with time of day, mood and the one image that matters most.</li>
          <li><b>Pick the look.</b> Gather 10 to 20 frames from films you love for contrast, color and lensing. That's your lookbook, even if only you see it.</li>
          <li><b>Shot list with the director.</b> Every setup in shooting order, with shot size, lens and move. Shoot wide to tight, and group setups that share a lighting direction.</li>
          <li><b>Plan the light.</b> Build the room in the Lighting Planner and save a plan for each setup.</li>
          <li><b>Pull the gear list</b> from the Job Kits tab in your Gear Locker, then add what the plan needs.</li>
          <li><b>Scout</b> the location (see the tech scout topic) and <b>test</b> anything new: a vintage lens, a LUT, a gobo, a dolly move.</li></ol>
          <h3>Shoot day</h3>
          <ol><li>Watch a blocking rehearsal before you place a light.</li><li>Light, expose and frame each setup (see Order of operations).</li>
          <li>Tell whoever is running the day how long each relight will take, and say when camera is ready.</li>
          <li>Run the calls on every take, check the clip, and keep the camera report.</li><li>Back up cards at lunch and at wrap.</li></ol>
          <h3>Wrap and after</h3>
          <ul><li>Two copies of every card before anything is formatted.</li><li>Scrub the footage that night for focus, flicker and exposure problems while you can still reshoot.</li>
          <li>Write grade notes: the look, the LUT, which clips need a match. You're the colorist too, so make it easy for yourself in Resolve.</li></ul>
          <h3>Handing off on a small crew</h3>
          <p>One helper can slate, run cards and batteries and set marks (the 2nd AC's job). A second can push the Dana Dolly or hold a bounce. Put both on your Hollyland headsets so you can call the take without shouting.</p>`,
        watch: ["Lighting before blocking. You'll relight.", "A shot list with no lens or move on it. Decide those in prep, not on the day.", "Formatting a card before it's on two drives."],
        drill: { intro: "For your next real or practice shoot.", steps: ["Write the prep list above for it: look frames, shot list with lenses and moves, a Lighting Planner plan for each setup, and a gear list from Job Kits.", "Time how long prep takes.", "After the shoot, write what you would have planned differently."], check: "Nothing on the day surprised you that a scout or a test would have caught." },
        quiz: [{ q: "On a two-person crew, what do you hand to your helper first?", a: ["Pulling focus", "Slating, cards and batteries", "Setting the key light"], c: 1, why: "Slate, cards and batteries are the 2nd AC's job and need no camera or lighting experience. You keep the look." },
          { q: "When does the DP decide lens and move for each shot?", a: ["On the day, after the actors arrive", "In prep, on the shot list", "In the edit"], c: 1, why: "Prep is where you decide. On the day you adjust to the blocking." }],
        book: [["box", "Chapter 11, Set Protocol"], ["landau", "Chapter 11, Light the Scene, Not Just the Shot"]] },
      { id: "process", title: "Order of operations", mc: "1.1", summary: "The same steps on every setup, so nothing gets missed.",
        keywords: "workflow process lighting steps blocking rehearsal",
        html: `<ol><li><b>Block first.</b> Watch a rehearsal with the director and actors before placing a light.</li><li><b>Kill everything.</b> Turn off room lights and see what the location gives you.</li>
          <li><b>Pick the source.</b> Where would light come from in this world? A window, a lamp, the sky.</li><li><b>Set the key</b> from that direction. Expose for it.</li>
          <li><b>Shape it:</b> negative fill, flags, nets. Add fill only if the frame needs it.</li><li><b>Separate:</b> back light or background light, only as much as needed.</li>
          <li><b>Check the frame:</b> false color, flicker, reflections, stands in shot, the lens flagged, focus magnified on the camera screen.</li><li><b>Shoot wide to tight.</b> Cheat the light a little for each closer angle. Nobody checks continuity of the key that closely.</li></ol>`,
        drill: { steps: ["On your next practice shoot, write these 8 steps on a card.", "Time each one.", "Note which step took longest and why."] },
        book: [["box", "Chapter 3, Lighting Objectives"], ["box", "Chapter 4, Lighting Strategies"], ["landau", "Chapter 11, Light the Scene, Not Just the Shot"]],
        quiz: [{ q: "What comes first?", a: ["Set the key", "Watch a blocking rehearsal", "Rig the back light"], c: 1, why: "Lights follow the blocking. Light before blocking and you'll relight." }] },
      { id: "calling", title: "Calling a take from behind the camera", mc: "7.2", summary: "The calls you hear and make as camera, in order, and how to run them on a small crew with no slate.",
        keywords: "roll sound speed roll camera rolling marker mark it slate clapper action cut back to one reset moving on lock it up last looks set procedure calls",
        html: `<p>Every take follows the same call-and-answer. On a big set the 1st AD runs it. On yours, the director or you will. Keep the order anyway: it tells everyone when to be still and gives you a clean slate to sync and log.</p>
          <div class="tablewrap"><table><tr><th>The call</th><th>Who says it on your set</th><th>What camera does</th></tr>
          <tr><td>"Picture's up."</td><td>Director or you</td><td>Finish the last light tweak. Get behind the camera.</td></tr>
          <tr><td>"Last looks."</td><td>Director or you</td><td>Check the frame once more: stands, flags, reflections, a hot spot on the wall.</td></tr>
          <tr><td>"Lock it up."</td><td>Director or you</td><td>Nobody moves a light or a stand from here.</td></tr>
          <tr><td>"Roll sound." / "Speed."</td><td>Director, then whoever runs the Zoom F6</td><td>Wait for "Speed" before you roll, so the slate lands on both.</td></tr>
          <tr><td>"Roll camera." / "Rolling."</td><td>Director, then you</td><td>Press record. Say "Rolling" only after you see the record light or the timecode moving.</td></tr>
          <tr><td>"Marker."</td><td>You or your helper</td><td>Slate in frame, read scene and take out loud, clap. Frame the slate big enough to read.</td></tr>
          <tr><td>"Set."</td><td>You</td><td>Slate is out, frame and focus are ready. Don't say it until they are.</td></tr>
          <tr><td>"Action." / "Cut."</td><td>Director</td><td>Hold the frame and keep rolling until you hear "Cut", even if the take looks over.</td></tr>
          <tr><td>"Back to one." / "Going again."</td><td>Director or you</td><td>Camera to its first position, dolly to its start mark, focus to the first mark.</td></tr>
          <tr><td>"Check the clip."</td><td>You</td><td>Play back the end of the take. Confirm it recorded and focus held.</td></tr>
          <tr><td>"Moving on."</td><td>Director or you</td><td>Next setup: change lens, move camera, start the relight.</td></tr></table></div>
          <h3>Slating with your kit</h3><ul><li>There's no slate in your Gear Locker. A free slate app on a spare phone or tablet works. So does clapping your hands in frame after saying "Scene 12 Apple, take 3".</li>
          <li>Scene numbers come from the script. Each new setup in that scene gets a letter: 12, 12A, 12B. Many crews skip I and O so they aren't misread as 1 and 0.</li>
          <li>Close on a face? <b>Soft sticks</b>. Missed the clap? <b>Second sticks</b>. Couldn't slate at the top? <b>Tail slate</b> at the end, upside down.</li>
          <li><b>MOS</b> (no sound): show the slate with the sticks closed.</li>
          <li>Two cameras (PYXIS and 6K Pro, say): call "A and B marker" and frame both on one clap.</li></ul>
          <p>Put your helpers on the Hollyland headsets. You can call "Rolling" and "Set" quietly and still be heard.</p>`,
        drill: { steps: ["Print the call table, or keep this page open, on your next practice shoot.", "Run the full call on every take, even with a crew of two.", "Log how many takes had a readable slate and a clap you could sync from."], check: "Every clip in Resolve has a slate you can read and sync from." },
        quiz: [{ q: "When do you say \"Rolling\"?", a: ["As soon as you press record", "When you see the record light or timecode moving", "After the slate"], c: 1, why: "Cameras can take a beat to start. Confirm it's recording before you tell the set." },
          { q: "You say \"Set\" when:", a: ["The slate is out and frame and focus are ready", "The lights are on", "The director says action"], c: 0, why: "\"Set\" tells the director camera is ready for action." },
          { q: "The slate was missed at the start. You:", a: ["Skip it", "Tail slate at the end, sticks upside down", "Reshoot the take"], c: 1, why: "A tail slate keeps the take loggable and syncable." }],
        book: [["box", "Chapter 1, Set Basics: Your First Barbecue"], ["box", "Chapter 11, Set Protocol"]] },
      { id: "data", title: "Cards, batteries and backups", mc: "7.2", summary: "The camera department's quiet job: never lose a take, never run out of power.",
        keywords: "cards media cfexpress cfast offload backup checksum clone 3-2-1 camera report batteries np-f570 format dit data wrangling",
        html: `<p>Losing a card loses the day. On a big set the DIT and 2nd AC handle this. On yours it's you or your helper, so make it a routine.</p>
          <h3>Your media and power</h3>
          <ul><li><b>PYXIS:</b> CFexpress Type B cards.</li><li><b>6K Pro:</b> CFast 2.0. Your Gear Locker notes about 100 minutes of 6K Blackmagic RAW 12:1 on a 512GB card, and about 60 minutes per NP-F570 battery. Bring 4 batteries for a wedding.</li>
          <li><b>Z CAM E2:</b> CFast 2.0 too.</li><li>Fill in how many cards and batteries you own in the Gear Locker so these notes stay true.</li></ul>
          <h3>The routine</h3>
          <ol><li><b>Charge and label</b> every battery the night before. Number your cards.</li>
          <li><b>Format in the camera</b> at the start of the day, never on the computer, and only cards already backed up twice.</li>
          <li><b>Camera report:</b> a phone note per card with clip range, scene and take, lens, stop, ISO, ND and anything that went wrong.</li>
          <li><b>Offload with verification.</b> Resolve's Clone tool (Media page) copies a card to two drives and checks every file against the card.</li>
          <li><b>3-2-1:</b> three copies, on two kinds of storage, one kept somewhere else.</li>
          <li>Mark backed-up cards (tape on the card) so nobody formats one that isn't safe.</li></ol>`,
        watch: ["A card pulled while the camera is still writing.", "\"I'll back it up at home.\" Do it at lunch and at wrap.", "Mixing a full card in with the empty ones."],
        drill: { steps: ["Fill in your card and battery counts in the Gear Locker.", "Shoot 10 minutes on the 6K Pro. Offload with Resolve's Clone tool to two drives.", "Note how long the copy took, so you can plan the time on a shoot day."], check: "You know how long a full card takes to back up, and you've planned that time into the day." },
        quiz: [{ q: "When is it safe to format a card?", a: ["After one copy", "After two verified copies", "At the end of the day"], c: 1, why: "One copy is one drive failure away from losing the day." },
          { q: "Where do you format a card?", a: ["In the camera", "On the computer"], c: 0, why: "The camera sets the card up the way it expects to write to it." }],
        src: ["gear_locker"] },
      { id: "scout", title: "The DP's tech scout", mc: "7.1", summary: "What to check, photograph and measure before shoot day.",
        keywords: "scout tech scout location power sun windows camera position lens ceiling",
        html: `<ul><li><b>Sun:</b> which windows get direct sun, and when. Use the sun tool on site with the compass on.</li>
          <li><b>Windows and existing lights:</b> sizes, what you'll need to cover with blackout curtains or ND 1.2 gel, what can be switched off or swapped for your B7c bulb.</li>
          <li><b>Camera positions:</b> stand where the camera goes and check each lens with the field of view tool. Can you get far enough back for the wide?</li>
          <li><b>Space for light:</b> room size and ceiling height (it decides whether you can boom a light), and room to put the 600d outside a window.</li>
          <li><b>Surfaces:</b> white walls fill the shadows, dark walls eat light, glass and chrome reflect your lights.</li>
          <li><b>Power:</b> where the outlets and the breaker panel are, and which outlets share a circuit, so the 600d doesn't share one with everything else.</li>
          <li><b>Dolly floor:</b> is it smooth and level enough for the Dana Dolly or the utility cart?</li>
          <li><b>Photos:</b> shoot every wall from the center of the room plus each window, and note where north is.</li></ul>
          <p>Put the room into the Lighting Planner (the room-by-measurement form) and plan before you go back.</p>`,
        tools: ["sun", "fov"],
        quiz: [{ q: "On a scout, the tool that tells you when a window gets direct sun is:", a: ["The sun tool with your location and the compass", "The light-level tool"], c: 0, why: "Sun position by date and time, plus where the window faces, tells you when sun comes through." }] }
    ] },

    /* ======================================================= FRAME */
    { id: "frame", title: "Frame and composition", blurb: "Rule of thirds, headroom, shot sizes, depth and the line.", topics: [
      { id: "thirds", title: "Rule of thirds, headroom and look room", mc: "4.1", summary: "Where to put a face in the frame, and why the middle usually feels flat.",
        keywords: "composition grid framing nose room lead room",
        html: `<p>Split the frame into thirds both ways. The four places where the lines cross are where the eye naturally lands. Put the important thing (usually the eyes) on or near one of them, not dead center.</p>
          <ul><li><b>Headroom:</b> in a close-up, the eyes sit near the top third line. The top of the head can be cut off in a tight close-up. That's normal.</li>
          <li><b>Look room (nose room):</b> leave space in the direction the person is looking. Faces looking out of a frame with no room feel trapped.</li>
          <li><b>Horizons:</b> put them on the top or bottom third, not through the middle. Low horizon = big sky, freedom. High horizon = the ground matters.</li></ul>
          <p>It's a starting point, not a law. Centered framing is a strong choice for symmetry, confrontation, or a character talking right to us. Just make it a choice.</p>`,
        widget: "thirds",
        drill: { intro: "Fifteen minutes with any camera, even your phone.", steps: ["Turn on the grid in your camera (PYXIS: Monitor settings, grid. A7S III: Grid Line).", "Shoot the same person five ways: centered, left third with look room, left third short-sided, too much headroom, and a profile with lots of look room.", "Watch them back. Write one word for how each one feels."], check: "You can say why the short-sided frame feels uncomfortable, and when you'd want that." },
        quiz: [{ q: "In a close-up, where do the eyes usually go?", a: ["Dead center", "Near the top third line", "Bottom third"], c: 1, why: "Eyes on the top third line give natural headroom. Centered eyes leave dead space above the head." },
          { q: "Your actor looks toward frame left. Where's the empty space?", a: ["Frame left, in front of the face", "Frame right, behind the head"], c: 0, why: "Look room goes in the direction of the eyeline. Putting it behind them short-sides the frame on purpose." }],
        book: [["landau", "Chapter 4, Light the Shot, Not Just the Subject (thinking in frames)"]] },
      { id: "shotsizes", title: "Shot sizes", mc: "4.1", summary: "Wide to extreme close-up, and what each one says.",
        keywords: "ews ws ms mcu cu ecu insert coverage",
        html: `<div class="tablewrap"><table><tr><th>Shot</th><th>Frame</th><th>What it does</th></tr>
          <tr><td>Extreme wide</td><td>Place is the subject</td><td>Where we are, how small the person is.</td></tr>
          <tr><td>Wide / full</td><td>Head to toe</td><td>Blocking, body language, the geography of the scene.</td></tr>
          <tr><td>Medium</td><td>Waist up</td><td>Conversation, gestures, two people together.</td></tr>
          <tr><td>Medium close-up</td><td>Chest up</td><td>Most dialogue lives here.</td></tr>
          <tr><td>Close-up</td><td>Face</td><td>Thought and emotion. Save it for when it matters.</td></tr>
          <tr><td>Extreme close-up</td><td>Eyes, hands, a detail</td><td>Intensity, a clue, a beat the audience must not miss.</td></tr>
          <tr><td>Insert</td><td>An object</td><td>Information: the phone screen, the key, the note.</td></tr></table></div>
          <p>Coverage usually goes wide, then medium, then tighter, so the editor can cut in as the scene gets more intense. The closer you get, the more each move of the lens or the actor shows.</p>`,
        drill: { steps: ["Pick a 30-second scene from a film you love. Write down the shot size of every shot.", "Count how many close-ups there are and where they land.", "Shoot a one-minute scene of your own with the same pattern."], check: "You can explain why the director saved the closest shot for that moment." },
        quiz: [{ q: "Most dialogue coverage is shot as:", a: ["Extreme wides", "Medium close-ups", "Inserts"], c: 1, why: "Chest-up framing shows the face and some gesture, and cuts well with both wides and close-ups." }],
        tools: ["fov"] },
      { id: "depth", title: "Depth: foreground, middle, background", mc: "4.1", summary: "Three layers make a flat screen feel deep.",
        keywords: "layers foreground separation leading lines frame within a frame",
        html: `<p>A frame with something close (a doorframe, a shoulder, a plant), the subject in the middle, and something lit behind feels three-dimensional. One flat wall behind a face feels like a passport photo.</p>
          <ul><li>Put something in the foreground, even soft and out of focus.</li><li>Pull the subject off the wall. Three feet is the minimum, and more is better for light and focus.</li>
          <li>Light the background on its own: a lamp, a slash of light, a window. Darker or brighter than the face, never the same.</li><li>Use lines (tables, hallways, light streaks) that lead to the subject.</li></ul>`,
        drill: { steps: ["Shoot a medium close-up against a flat wall.", "Now add a foreground object, move the subject 6 feet off the wall, and put a lamp in the background.", "Compare. Note which changes made the biggest difference."] },
        quiz: [{ q: "The easiest way to get separation from a background is:", a: ["Raise ISO", "Move the subject away from the wall", "Use a wider lens"], c: 1, why: "Distance lets the background drop out of focus and lets you light the subject and the wall separately." }],
        book: [["landau", "Chapter 4, Light the Shot, Not Just the Subject"]] },
      { id: "line", title: "The 180-degree line and eyelines", mc: "4.1", summary: "Keep the audience oriented when you cut between people.",
        keywords: "180 rule axis crossing the line eyeline match",
        html: `<p>Draw an imaginary line through the two people talking. Keep the camera on one side of that line for every shot of the scene. Then person A always looks right-to-left and person B always looks left-to-right, and the cut feels natural.</p>
          <ul><li>Cross the line only on screen (a camera move or an actor walking across), or on purpose to disorient.</li><li>Keep eyelines close to the lens for intimacy. Wider from the lens feels more observed.</li>
          <li>Match lens and distance on both singles so the faces cut at the same size.</li></ul>`,
        drill: { steps: ["Block a two-person scene at a table.", "Shoot both singles from the same side of the line, then one from the wrong side.", "Cut them together and watch what breaks."] },
        quiz: [{ q: "You cut from A's single to B's single, and both seem to be looking the same direction. What happened?", a: ["Wrong shutter", "You crossed the line", "Lens too long"], c: 1, why: "Crossing the 180 line flips screen direction, so the two eyelines no longer meet." }] }
    ] },

    /* ======================================================= CAMERA */
    { id: "camera", title: "Camera angles and movement", blurb: "Height, angle and moves, and the mood each one makes.", topics: [
      { id: "camheight", title: "Camera height and angle", mc: "4.2", summary: "Low makes power, high makes weakness, eye level stays honest.",
        keywords: "low angle high angle dutch overhead birds eye worms eye mood",
        html: `<p>The audience sits where the lens sits. Put the lens below the eyes and we look up to the character. Put it above and we look down on them. Eye level makes us equals.</p>
          <p>Change height for story reasons: a character gaining power can be shot lower and lower through a film. Keep it consistent inside a scene unless something changes.</p>`,
        widget: "camangles",
        drill: { steps: ["Shoot one line of dialogue from eye level, then 2 feet below, then 2 feet above.", "Use the same lens and the same distance.", "Ask someone who wasn't there which version seems strongest and which seems scared."] },
        quiz: [{ q: "You want a villain to feel dominant. Start with:", a: ["High angle", "Low angle", "Overhead"], c: 1, why: "Looking up at a character makes them loom over us." },
          { q: "A dutch angle is best used:", a: ["On every shot for style", "Sparingly, when the world is off balance"], c: 1, why: "It loses its meaning when overused." }] },
      { id: "movement", title: "Camera moves and what they mean", mc: "4.2", summary: "Push in, pull out, pan, track, handheld, static.",
        keywords: "dolly push in pull out pan tilt handheld static tracking",
        html: `<ul><li><b>Static:</b> calm, observational, lets the acting work. Wes Anderson and Ozu live here.</li>
          <li><b>Push in (slow dolly in):</b> focus, realization, rising tension. The most useful move there is.</li>
          <li><b>Pull out:</b> reveal, isolation, an ending.</li><li><b>Pan or tilt:</b> following, or revealing what a character sees.</li>
          <li><b>Track alongside:</b> energy, journey, walk-and-talks.</li><li><b>Handheld:</b> urgency, documentary truth, chaos. Breathing handheld works for intimacy.</li></ul>
          <p>Every move should start and end on a frame that works by itself. Motivate it: an actor stands, a door opens, a thought lands.</p>`,
        drill: { steps: ["Shoot the same 20-second moment three ways: static, slow push in, handheld.", "Watch them in a row.", "Write which one fits the moment and why."] },
        quiz: [{ q: "A character realizes something terrible. A classic choice is:", a: ["Fast whip pan", "Slow push in", "Pull out to an extreme wide"], c: 1, why: "A slow push in pulls us into their head as the realization lands." }] },
      { id: "support", title: "Moving the camera with your kit", mc: "4.2", summary: "Tripod, handheld, the Dana Dolly, apple boxes and the utility cart: which move each one gives you.",
        keywords: "camera support tripod handheld dana dolly slider push in dolly zoom low mode high hat apple box cart dolly ibis parallax",
        html: `<p>You don't need a crane to move the camera well. You need the right move for the moment, done smoothly, starting and ending on good frames.</p>
          <div class="tablewrap"><table><tr><th>Tool you own</th><th>Moves it gives you</th><th>Tips</th></tr>
          <tr><td>Tripod</td><td>Locked off, pan, tilt</td><td>Level the head first. Bag the legs on anything soft. Slow pans read better than fast ones.</td></tr>
          <tr><td>Handheld, A7S III</td><td>Following, urgency, intimacy</td><td>The A7S III's in-body stabilization smooths it. The PYXIS and 6K Pro have none, so keep them on sticks or the dolly. Elbows in, breathe out through the move, walk heel to toe.</td></tr>
          <tr><td>Dana Dolly</td><td>Push in, pull out, slides, parallax moves</td><td>Mark the start and end on the rails with tape so every take repeats. Shoot with foreground objects to show the move.</td></tr>
          <tr><td>Dana Dolly plus a 24-105 zoom</td><td>Dolly zoom</td><td>Push in while zooming out (or the reverse) so the face holds its size and the background stretches. Rehearse it slowly.</td></tr>
          <tr><td>Apple boxes or a sandbag</td><td>Low angle near the floor</td><td>No high hat in your kit, so set the camera on a box or nest it on a sandbag for ground-level shots.</td></tr>
          <tr><td>Utility cart</td><td>Cheap tracking shots on smooth floors</td><td>Sit on it or brace the camera on it, and have a helper push slowly. Check the floor on the scout.</td></tr></table></div>
          <p>Every move needs a reason: an actor stands, a door opens, a thought lands. If you can't say why it moves, lock it off.</p>`,
        watch: ["A move that starts or ends on a weak frame.", "Bumps at the start and end of a dolly move. Ease in and out.", "Handheld on a camera with no stabilization and a long lens."],
        drill: { steps: ["Set the Dana Dolly in a room with a foreground object (a lamp, a doorframe).", "Shoot a 4-foot push in on a seated person at 35mm, then the same move at 85mm.", "Then try a dolly zoom with the 24-105 and watch the background stretch."], check: "You can repeat the same dolly move three takes in a row and land on the same end frame." },
        quiz: [{ q: "Which of your cameras is best for handheld?", a: ["PYXIS", "A7S III", "Pocket 6K Pro"], c: 1, why: "The A7S III has in-body stabilization. The two Blackmagic cameras don't." },
          { q: "A push in shows its motion best when:", a: ["There's something in the foreground", "The background is a flat wall", "You use the widest lens you have"], c: 0, why: "Foreground objects move past faster than the background, so the eye feels the move." }] }
    ] },

    /* ======================================================= LENSES */
    { id: "lenses", title: "Lenses", blurb: "Focal length, perspective, depth of field and your own glass.", topics: [
      { id: "focal", title: "Focal length and what it does", mc: "3.1", summary: "Wide, normal and long lenses, and the feel of each.",
        keywords: "wide angle telephoto normal lens field of view crop factor equivalent",
        html: `<div class="tablewrap"><table><tr><th>Full frame</th><th>Feel</th><th>Use it for</th></tr>
          <tr><td>14 to 24mm</td><td>Big space, stretched edges</td><td>Establishing, tight rooms, unease when close to a face</td></tr>
          <tr><td>28 to 35mm</td><td>Natural, close to the action</td><td>Walk-and-talks, handheld, putting us in the room</td></tr>
          <tr><td>40 to 50mm</td><td>Normal, honest</td><td>Mediums, dialogue, most things</td></tr>
          <tr><td>75 to 100mm</td><td>Flattering, intimate</td><td>Close-ups, portraits, isolating someone from the room</td></tr>
          <tr><td>135mm and up</td><td>Stacked, watched from afar</td><td>Surveillance feel, compressing a crowd, heat-haze streets</td></tr></table></div>
          <p>Those ranges are for full frame (your PYXIS and A7S III). On the Pocket 6K Pro and the X-H2S, the same lens shows a tighter view, about 1.5x. A 35mm there looks like a 55mm on full frame. Use the calculator to check.</p>`,
        widget: "fov",
        drill: { steps: ["On the PYXIS, frame a close-up with the 24-105 at 24, then 35, 50 and 105. Move the camera each time so the face stays the same size.", "Look at the nose, the ears and the background in each one.", "Pick the one that suits a love scene and the one that suits a nightmare."], check: "You've seen the background grow and shrink while the face stays the same size." },
        quiz: [{ q: "A 35mm on the Pocket 6K Pro frames about like what on the PYXIS?", a: ["24mm", "35mm", "55mm"], c: 2, why: "The Pocket's Super 35 sensor crops about 1.56x, so 35 x 1.56 is about 55mm." }],
        tools: ["fov"], src: ["bmd_pyxis_spec"] },
      { id: "perspective", title: "Compression is really distance", mc: "3.1", summary: "Long lenses don't flatten faces. Standing far away does.",
        keywords: "compression perspective distortion telephoto wide face",
        html: `<p>Perspective comes from where the camera stands. A long lens only crops it. When you shoot a face on an 85mm, you stand farther back to frame it, and from farther away the nose and ears look more equal in size. That's the "compression" people talk about.</p>
          <p>Shoot a close-up on an 18mm and you must stand inches away. The nose is much closer to the lens than the ears, so it looks big. That's why wide lenses are cruel to faces up close and why they make a room feel deep.</p>`,
        drill: { steps: ["Put a person 10 feet in front of a building. Frame them chest-up on the 85mm.", "Now frame them chest-up on the 18mm by walking in.", "Compare the size of the building behind them."], check: "The building looks huge behind them on the 85mm and tiny on the 18mm, even though they're the same size in frame." },
        quiz: [{ q: "What actually changes perspective?", a: ["Focal length", "Camera distance", "Sensor size"], c: 1, why: "Focal length only changes how much of the scene you crop. Distance changes how near and far things relate." }] },
      { id: "dof", title: "Depth of field", mc: "3.1", summary: "What's sharp, and the four things that change it.",
        keywords: "shallow depth bokeh aperture focus distance hyperfocal circle of confusion",
        html: `<p>Depth of field gets shallower when you:</p><ol><li>open the aperture (f/1.4 vs f/8),</li><li>get closer to the subject,</li><li>use a longer lens at the same distance,</li><li>use a bigger sensor for the same framing.</li></ol>
          <p>Shallow isn't automatically cinematic. At f/1.4 on full frame, a close-up can have only the near eye sharp, and your focus puller (or autofocus) has no margin. Many DPs shoot dialogue around T2.8 to T4 for a reason.</p>`,
        widget: "dof",
        watch: ["Focus on the eye nearest the lens.", "Shallow depth plus a moving actor equals soft shots. Mark the floor and rehearse.", "Check focus magnified on the camera screen (focus zoom), not by eye at arm's length."],
        drill: { steps: ["Use the calculator for the Takumar 50 on the PYXIS: depth at f/1.4, f/2.8 and f/5.6 for a close-up.", "Shoot a person walking toward camera at each stop and pull focus by hand.", "Count how many takes you nail at each one."] },
        quiz: [{ q: "Which makes depth of field shallower?", a: ["Stepping back", "Opening from f/4 to f/2", "Zooming out to 24mm"], c: 1, why: "Opening the aperture is the most direct way. Stepping back and going wider both deepen it." }],
        tools: ["dof"] },
      { id: "mylenses", title: "Your lenses at a glance", mc: "3.2", summary: "What each lens in your Gear Locker is best at, and which camera it lives on.",
        keywords: "24-105 18-35 11-16 helios takumar zeiss carenar vintage zoom sigma tokina",
        html: `<ul><li><b>24-105 f/4 (EF), on the PYXIS:</b> your workhorse for interviews and commercial work. Use it like a set of primes: park it at 24, 35, 50, 85 or 105 and move your feet. f/4 means you light to T4, so plan more light than you would for fast glass.</li>
          <li><b>24-105 f/4 (Sony E), on the A7S III:</b> weddings and run-and-gun. Stabilized, so handheld mediums stay steady.</li>
          <li><b>Sigma 18-35 f/1.8, on the Pocket 6K Pro:</b> Super 35 only. On the Pocket it frames like about 28-55mm on full frame. Your fastest glass: small venues, low light, shallow interviews.</li>
          <li><b>Tokina 11-16 f/2.8, on the Pocket:</b> interiors and real estate. Keep faces out of the edges.</li>
          <li><b>Vintage primes (Zeiss 28, Takumar 50 f/1.4, Helios 58, Carenar 135):</b> lower contrast, warm flares, character. The Helios swirls the background. Great for dreams, memories, music videos and short films. Shoot them a stop or two down from wide open for faces, and wide open on purpose for a dreamy look.</li>
          <li><b>Canon FD 70-210 (Sony only):</b> compressed long shots and a voyeur feel on the A7S III.</li></ul>
          <p>Every lens fits the Tilta Mirage with 77mm step-up rings. Keep the matte box on for flare control when a light points toward camera.</p>`,
        drill: { steps: ["Put the 24-105 on the PYXIS. Shoot a one-minute scene with the zoom taped at 35.", "Shoot it again taped at 85.", "Note how your blocking changed to make each focal length work."] },
        quiz: [{ q: "For a dreamy flashback with a swirly background, reach for:", a: ["Tokina 11-16", "Helios 58 near wide open", "24-105 at f/8"], c: 1, why: "The Helios is known for its swirly background, strongest near wide open." }] }
    ] },

    /* ======================================================= EXPOSURE */
    { id: "exposure", title: "Exposure", blurb: "Stops, T-stops, shutter, ISO, ND and white balance.", topics: [
      { id: "exposure-basics", title: "Stops: the one unit that matters", mc: "2.1", summary: "One stop is double or half the light. Every setting talks in stops.",
        keywords: "stop exposure triangle aperture iso shutter double half ev",
        html: `<p>A <b>stop</b> is a doubling or a halving of light. Everything that changes brightness can be counted in stops:</p>
          <ul><li><b>Aperture:</b> T1.4, 2, 2.8, 4, 5.6, 8, 11, 16. Each step is one stop less light.</li><li><b>ISO:</b> 400 to 800 is one stop brighter.</li>
          <li><b>Shutter:</b> 1/50 to 1/100 is one stop darker.</li><li><b>ND:</b> every 0.3 is one stop darker.</li><li><b>Lights:</b> twice the output is one stop, and moving a light to twice the distance costs two stops.</li></ul>
          <p>Once you think in stops, you can trade one setting for another and keep the same exposure. Want shallower focus? Open 2 stops, add ND 0.6.</p>`,
        widget: "exposure",
        drill: { steps: ["Expose a face correctly. Write down the settings.", "Open 2 stops, then add ND 0.6 to get back. Check that it looks the same.", "Double the ISO and halve the light (dim the LED to half). Check again."], check: "You can get back to the same exposure three different ways." },
        quiz: [{ q: "T2.8 to T5.6 is how many stops?", a: ["One", "Two", "Three"], c: 1, why: "2.8, 4, 5.6: two steps on the full-stop ladder." },
          { q: "ND 0.9 cuts how much light?", a: ["1 stop", "3 stops", "9 stops"], c: 1, why: "Each 0.3 of density is one stop." }],
        tools: ["exposure", "lux"], book: [["box", "Appendix A, Photometric Calculation Tables"]] },
      { id: "tstop", title: "T-stops and f-stops", mc: "2.1", summary: "f-stops set depth of field. T-stops tell you the real light getting through.",
        keywords: "t stop f stop transmission cine lens aperture",
        html: `<p>An f-stop is math: focal length divided by the aperture opening. A T-stop is measured: how much light actually makes it through the glass. Every lens loses a little, so T2.8 on a cine lens is a bit more open than f/2.8.</p>
          <ul><li>Use <b>T-stops for exposure</b>, so every lens in a set matches when you swap.</li><li>Use <b>f-stops for depth of field</b> math.</li>
          <li>Your EF stills lenses are marked in f-stops. Switching lenses mid-scene can shift exposure by a fraction of a stop. Check the scope after every lens change.</li></ul>`,
        quiz: [{ q: "Why do cine lenses use T-stops?", a: ["They're sharper", "Exposure matches from lens to lens", "They have more blades"], c: 1, why: "T-stops are measured transmission, so T2.8 on any lens gives the same exposure." }] },
      { id: "shutter", title: "Shutter angle and the 180° rule", mc: "2.1", summary: "Shutter sets motion blur first and exposure second.",
        keywords: "shutter angle 180 degree rule motion blur flicker 1/50 1/48 1/60",
        html: `<p>At 24 fps, a 180° shutter means each frame is exposed for 1/48 of a second (1/50 on most cameras). That amount of blur is what audiences read as normal film motion.</p>
          <ul><li>Narrower (90°, 45°): crisp, stuttery motion. Action, panic, war.</li><li>Wider (270°, 360°): smeary, dreamy motion, and one more stop of light.</li>
          <li>Don't use the shutter to fix exposure. Use ND, the lights or the stop.</li><li>In the US, use 1/60 (144° at 24 fps) when cheap LEDs or fluorescents flicker.</li></ul>
          <p>The PYXIS shows shutter as an angle. The A7S III shows a speed by default. You can switch it to angle in the menu.</p>`,
        widget: "shutter",
        quiz: [{ q: "24 fps with a 180° shutter is:", a: ["1/24", "1/48", "1/180"], c: 1, why: "180° is half the frame time: 1/24 x 1/2 = 1/48." },
          { q: "A practical lamp is flickering on camera in the US. Try:", a: ["1/60 shutter", "1/50 shutter", "Raise the ISO"], c: 0, why: "US power is 60 Hz, so the light pulses 120 times a second. 1/60 catches whole pulses." }],
        tools: ["shutter"], book: [["box", "Appendix C, Flicker-free Frame Rates"]] },
      { id: "iso", title: "ISO and native ISO", mc: "2.2", summary: "Shoot at a native ISO for the cleanest picture and the most range.",
        keywords: "iso native dual base gain noise dynamic range",
        html: `<p>Digital cameras have one or two <b>native</b> ISOs where the sensor gives its best balance of noise and dynamic range. Other ISOs are the same signal pushed or pulled.</p>
          <div class="tablewrap"><table><tr><th>Camera</th><th>Native ISO</th></tr>
          <tr><td>PYXIS 6K</td><td class="num">400 and 3200</td></tr><tr><td>A7S III in S-Log2/S-Log3</td><td class="num">640 and 12800</td></tr><tr><td>Pocket 6K Pro</td><td class="num">400 and 3200</td></tr></table></div>
          <p>Pick the native ISO that suits the scene (low for bright and lit, high for dark), then light and stop down to fit. On the A7S III, ISO 12800 in S-Log3 is often cleaner than 5000 or 6400, because the second gain stage kicks in there.</p>`,
        quiz: [{ q: "Night exterior, A7S III in S-Log3, not enough light at 6400. Best next step?", a: ["Go to 12800", "Go to 8000"], c: 0, why: "12800 is the second base ISO and is usually cleaner than the ISOs just below it." }],
        src: ["bmd_pyxis_iso", "a7s3_iso"] },
      { id: "nd", title: "ND filters", mc: "2.1", summary: "Neutral density lets you keep your stop and shutter in bright light.",
        keywords: "neutral density nd filter variable optical density 0.3 0.6 0.9",
        html: `<p>ND darkens everything evenly so you can shoot wide open in daylight or keep 180° shutter outside. Density 0.3 = one stop, 0.6 = two, 0.9 = three, 1.2 = four.</p>
          <ul><li>Cheap variable NDs shift color and can show an X-shaped dark pattern near their strongest setting.</li><li>Stacking filters adds reflections and softness. Use one strong filter instead of three weak ones.</li>
          <li>Strong ND can let infrared through and turn blacks reddish. Use IR-cut ND above about ND 1.2.</li></ul>`,
        widget: "nd",
        quiz: [{ q: "Meter says T11 in sun. You want T2.8. How much ND?", a: ["0.6", "1.2", "2.1"], c: 1, why: "11 to 2.8 is four stops (11, 8, 5.6, 4, 2.8), and 4 x 0.3 = 1.2." }],
        tools: ["nd"] },
      { id: "wb", title: "White balance", mc: "1.4", summary: "Tell the camera what white is, or pick a number on purpose.",
        keywords: "white balance kelvin tint green magenta auto",
        html: `<p>White balance tells the camera which color of light should look neutral. Set it to the main light (5600K for your 600d, 3200K for tungsten) and that light looks white. Everything else shifts warmer or cooler around it.</p>
          <ul><li>Never shoot auto white balance on a scene. It drifts mid-take.</li><li>In BRAW you can change white balance later with no loss. In S-Log3 you can't, so get it right in camera.</li>
          <li>Set white balance between two sources to keep both colors: 4300K with a warm lamp and a cool window makes one warm and one cool.</li><li>Watch the tint (green and magenta). Cheap LEDs and fluorescents push green.</li></ul>`,
        tools: ["kelvin"],
        quiz: [{ q: "Camera on 5600K, light at 3200K. The light looks:", a: ["Blue", "Orange", "White"], c: 1, why: "A warmer source than the white balance shows up orange." }] }
    ] },

    /* ======================================================= SCOPES */
    { id: "scopes", title: "Scopes and false color", blurb: "Waveform, false color and zebras on the PYXIS and the A7S III.", topics: [
      { id: "waveform", title: "Reading a waveform", mc: "2.1", summary: "Left to right is the frame. Bottom to top is brightness.",
        keywords: "waveform ire luma parade scope exposure",
        html: `<p>A waveform draws your picture as brightness. The horizontal axis is the frame from left to right. The vertical axis is brightness from 0 (black) to 100 (white). A face in the middle of frame shows up as a cluster in the middle of the scope, at the height of its brightness.</p>
          <ul><li><b>Clipping:</b> a flat line pressed against the top. Detail there is gone.</li><li><b>Crushed blacks:</b> a flat line on the floor.</li>
          <li><b>RGB parade:</b> three waveforms side by side (red, green, blue). If white things show different heights in the three, the white balance is off.</li></ul>
          <p>Where things should land depends on what the scope is reading: the log signal or the LUT. Know which before you start judging.</p>`,
        quiz: [{ q: "A flat line pressed against 100 means:", a: ["Crushed blacks", "Clipped highlights", "Perfect exposure"], c: 1, why: "Values can't go higher, so detail above that point is lost." }] },
      { id: "falsecolor", title: "False color", mc: "2.1", summary: "Colors painted over the picture show brightness at a glance.",
        keywords: "false color pink green red purple exposure skin",
        html: `<p>False color swaps the picture for a color code of brightness. It's the fastest way to expose skin on a small screen.</p>
          <ul><li><b>PYXIS:</b> Blackmagic describes pink as good exposure for lighter skin, green as good for darker skin, and red as overexposed.</li>
          <li><b>A7S III:</b> no false color in the camera. Sony's Monitor & Control app on your phone adds false color, waveform and histogram over a wireless link (camera firmware 3.00 or later).</li>
          <li><b>Monitors:</b> every brand uses a different color code. Learn the legend on yours.</li></ul>`,
        widget: "scopes",
        watch: ["False color usually reads the LUT image, not the log. Check which in the menu.", "Don't chase pink on every face. A low-key scene wants skin a bit lower."],
        quiz: [{ q: "On the PYXIS, a lighter-skinned face in false color should mostly read:", a: ["Red", "Pink", "Purple"], c: 1, why: "Blackmagic's guide: pink for lighter skin, green for darker skin, red overexposed." }],
        src: ["bmd_pyxis_os", "sony_mc", "sony_mc_features"] },
      { id: "slog3", title: "Exposing the A7S III in S-Log3", mc: "2.1", summary: "Gray at 41, white at 61, protect the highlights, shoot ISO 640 or 12800.",
        keywords: "slog3 s-log3 a7s iii zebra 41 61 52 exposure ettr sony monitor and control",
        html: `<p>S-Log3 puts 18% gray at 41% and a 90% white card at 61% on the scope, with black at 3.5%. That's per Sony's own technical summary. It leaves lots of room above for highlights, which is why S-Log3 looks flat and dark-ish on the camera screen.</p>
          <ol><li>Set ISO 640 (or 12800 in the dark).</li><li>Set zebras: <b>Zebra level 61</b> to check a white card, or <b>41</b> for a gray card. Many shooters use about 52 on lighter skin.</li>
          <li>For a waveform and false color, connect the <b>Sony Monitor & Control</b> app on your Pixel. The A7S III needs firmware 3.00 or later.</li>
          <li>Turn on the camera's Gamma Display Assist (or a LUT) so the picture looks normal, but expose by the numbers, not the look.</li>
          <li>Many shooters expose S-Log3 up to a stop over (ETTR) to clean the shadows. Just keep skin and anything important out of clipping.</li></ol>
          <p>Firmware 4.00 added a log shooting mode with LUT display and removed S-Log2. If you've updated, S-Log3 is your log option.</p>`,
        watch: ["Exposing by the flat picture without a LUT usually ends up 1 to 2 stops over.", "Wrong white balance in S-Log3 is hard to fix later. Set it on a white card.", "Underexposed S-Log3 is noisy. When unsure, a little over beats a little under."],
        drill: { steps: ["Put a gray card and a white card next to a face under one soft light.", "Set zebras to 61 and adjust until the white card just shows zebras.", "Check the gray card at 41 with zebras. Note where the face lands.", "Grade it in Resolve with a Sony LUT or a CST and check that the gray card lands on middle gray."], check: "Your face lands in the same place every time, and the grade starts from a neutral image." },
        quiz: [{ q: "In S-Log3, a 90% white card should read about:", a: ["41%", "61%", "95%"], c: 1, why: "Sony's S-Log3 spec puts 90% white at 61% and 18% gray at 41%." },
          { q: "To see a waveform for the A7S III you use:", a: ["The camera's waveform menu", "Sony Monitor & Control on your phone", "Zebras only"], c: 1, why: "The A7S III has zebras but no waveform. The phone app adds waveform, false color and histogram." }],
        src: ["sony_slog3", "sony_help_gamma", "slog3_skin", "sony_mc", "a7s3_iso"] },
      { id: "pyxis", title: "Exposing the PYXIS in Blackmagic RAW", mc: "2.2", summary: "Use false color on the LUT view, keep highlights out of red, shoot ISO 400 or 3200.",
        keywords: "pyxis braw blackmagic raw false color zebra histogram exposure",
        html: `<p>BRAW keeps white balance and ISO as adjustable settings, so in post you can change them almost freely. What you can't fix is clipped highlights or noisy, underexposed shadows. Exposure is still the one thing to get right.</p>
          <ol><li>ISO 400 for lit scenes, 3200 for low light (the two native ISOs).</li><li>Turn on the Blackmagic Film to Video LUT (or your show LUT) on the monitor.</li>
          <li>Turn on false color. Put lighter skin in the pink and darker skin in the green. Keep anything important out of red.</li><li>Use zebras for highlights and the histogram to see the whole frame.</li>
          <li>For a full waveform with no external monitor, record a short test clip and read it on Resolve's waveform, or try the Blackmagic Camera app on your Pixel (it can remote-control the PYXIS).</li></ol>`,
        quiz: [{ q: "In BRAW, which mistake can't be fixed in post?", a: ["Wrong white balance", "Wrong ISO setting", "Clipped highlights"], c: 2, why: "White balance and ISO are adjustable in BRAW. Clipped data is gone." }],
        src: ["bmd_pyxis_os", "bmd_pyxis_iso", "bmd_cam_android"] },
      { id: "looks", title: "What scopes look like for each grade", mc: "5.3", summary: "High key, low key, natural and night each have a shape on the waveform.",
        keywords: "high key low key moody night waveform shape grade look",
        html: `<p>Before you roll, know the shape you want. Expose and light for that shape, then the grade just refines it.</p>
          <ul><li><b>Natural/commercial:</b> trace spread from bottom to top. Skin mid-high. Little clipping.</li><li><b>High key:</b> trace mostly in the top half. Bright background just under clipping. Low contrast on the face.</li>
          <li><b>Low key:</b> trace hugging the bottom with a few bright spikes. The shadow side of the face falls two or three stops.</li><li><b>Night:</b> dark overall, but light the face enough to stay clean. Build the darkness with contrast and color, not underexposure.</li></ul>`,
        widget: "scopes",
        drill: { steps: ["Light the same face for natural, high key and low key.", "Screenshot the waveform for each (Monitor & Control on the A7S III, a test clip on Resolve's waveform for the PYXIS).", "Compare them to the shapes here. Then grade each one and note how little the grade had to do."] },
        quiz: [{ q: "A low-key waveform mostly sits:", a: ["Near the top", "Spread evenly", "Near the bottom, with a few highlights"], c: 2, why: "Low key is mostly shadow with selected bright accents." }] },
      { id: "zebras", title: "Zebras and the histogram", mc: "2.1", summary: "Zebras flag one brightness level. The histogram shows the whole frame.",
        keywords: "zebra histogram 100 95 clipping",
        html: `<p><b>Zebras</b> draw stripes on anything above (or within) a level you choose. Set them to a target like 61 on a white card in S-Log3, or high (95 to 100) to warn of clipping in Rec.709.</p>
          <p>The <b>histogram</b> is a count of how many pixels sit at each brightness, from dark on the left to bright on the right. Bunched at the right edge = clipping. Bunched on the left = underexposed. It doesn't tell you where in the frame the problem is. That's what zebras, false color and the waveform are for.</p>`,
        quiz: [{ q: "The histogram shows a tall spike against the right edge. That means:", a: ["Clipping", "Too much noise", "Wrong white balance"], c: 0, why: "Pixels piled up at maximum brightness have lost detail." }] }
    ] },

    /* ======================================================= LIGHT */
    { id: "light", title: "Light", blurb: "Quality, angle, height, distance, contrast and color.", topics: [
      { id: "hardsoft", title: "Hard and soft light", mc: "1.1", planner: "hard-soft", summary: "Soft comes from big and close. Hard comes from small or far away.",
        keywords: "hard light soft light source size quality wrap shadow edge",
        html: `<p>Softness depends on how big the source looks <i>from the subject's point of view</i>. A Light Dome III 3 feet from a face is big and soft. The same dome 15 feet away is small and much harder. The sun is huge but so far away it's a hard point. Clouds turn the whole sky into one giant soft source.</p>
          <ul><li><b>Soft:</b> gentle shadow edges, wraps around the face, hides texture. Flattering, modern, commercial.</li><li><b>Hard:</b> crisp shadows, shows texture, more graphic and dramatic. Noir, sunlight, period.</li>
          <li>Making light softer: bigger modifier, closer, bounce, diffusion, book light.</li><li>Making it harder: bare, farther, Fresnel or spotlight, a grid to narrow the spread.</li></ul>`,
        widget: "distance",
        drill: { steps: ["Light a face with the bare 200x S reflector. Look at the nose shadow edge.", "Add the Light Dome III at the same spot. Look again.", "Move the dome close, then far. Find the distance where it starts looking hard."], check: "You can predict the shadow edge before you turn the light on." },
        quiz: [{ q: "You move a softbox from 3 ft to 12 ft from the face. The light gets:", a: ["Softer", "Harder", "Same quality, just dimmer"], c: 1, why: "It looks smaller from the subject, so shadows get crisper." }],
        setups: ["book-light"], book: [["box", "Chapter 5, Manipulating Light"], ["landau", "Chapter 1, The Magic of Light"]] },
      { id: "angles", title: "Light direction and mood", mc: "1.1", summary: "Where the key sits around the face is the biggest choice you make.",
        keywords: "key light angle front side 45 90 back rim kicker top under mood rembrandt split butterfly loop godfather",
        html: `<p>Walk a single light around a face and you get every mood there is. The render tool below shows the same light from seven positions. Learn the names, because gaffers use them.</p>`,
        widget: "lightangle",
        drill: { steps: ["One light, one face, dark room. Shoot 7 frames at the positions shown here.", "Put them side by side.", "Write a one-word mood for each one."], check: "You can name the position of a key light in any film still in a few seconds." },
        quiz: [{ q: "A light from straight above, eyes in shadow, reads as:", a: ["Beauty", "Menace or mystery", "Comedy"], c: 1, why: "Hiding the eyes stops us reading the character. Gordon Willis's top light in The Godfather is the classic example." },
          { q: "A kicker comes from:", a: ["Beside the lens", "Behind and to the side", "Under the chin"], c: 1, why: "A kicker is set around 120° to 150° from the camera, catching the cheek and jaw edge." }],
        setups: ["rembrandt", "split", "top-light"], book: [["landau", "Chapter 3, Lighting the Subject"]] },
      { id: "height", title: "Key height and the eyes", mc: "1.1", summary: "Keep the key high enough for shape, low enough for the eyes.",
        keywords: "height catchlight eye light eyes sockets",
        html: `<p>The usual key sits a little above the eye line, enough that the nose shadow falls down and to the side. Too high and the eye sockets go dark. Too low and it looks like a phone screen.</p>
          <ul><li>Look for the <b>catchlight</b>, the reflection of the light in the eye. No catchlight = dead eyes. Lower the key or bring it around toward camera.</li>
          <li>Eyes are where the audience looks first. Light for them before anything else.</li><li>Tall actors and short actors need the light moved, not just aimed.</li></ul>`,
        quiz: [{ q: "The eyes look dead and dark. First thing to try:", a: ["Raise the key", "Lower the key a little or bring it toward camera", "Add a back light"], c: 1, why: "A lower or more frontal key puts a catchlight back in the eyes." }] },
      { id: "shortbroad", title: "Short side and broad side", mc: "1.1", planner: "setup-short", summary: "Light the side of the face turned away from camera for shape.",
        keywords: "short lighting broad lighting far side key upstage",
        html: `<p>When a face is turned a little away from the lens, one side is closer to camera (the broad side) and one is turned away (the short side).</p>
          <ul><li><b>Short side key:</b> light the far side. The near cheek falls into shadow, and the face gets depth and slims down. This is the default for most narrative close-ups.</li>
          <li><b>Broad side key:</b> light the near side. More of the face is lit and it looks wider and flatter. Use it on purpose.</li></ul>
          <p>A good habit from working DPs: move the eyeline a little off the lens, then key from the side the eyes are pointing toward.</p>`,
        quiz: [{ q: "Actor looks toward camera left. For short side lighting, the key goes:", a: ["Camera left", "Camera right", "Over the lens"], c: 0, why: "The far side of the face is the side they're looking toward." }],
        setups: ["short", "broad"], book: [["landau", "Chapter 3, Lighting the Subject"]] },
      { id: "falloff", title: "Distance and falloff", mc: "1.2", planner: "falloff", summary: "Twice the distance is a quarter of the light. Use it to control the background.",
        keywords: "inverse square law falloff distance background separation",
        html: `<p>Light from a small source spreads out, so the inverse square law applies: double the distance, a quarter of the light (two stops less).</p>
          <ul><li><b>Light close to the subject:</b> the subject is bright but the wall behind drops fast. Moody, separated.</li>
          <li><b>Light far away:</b> subject and wall get nearly the same light. Even and flat. Good for big groups and wide shots.</li>
          <li>To light a room evenly, go big and far. To isolate a face, go close.</li></ul>`,
        widget: "invsq",
        drill: { steps: ["Put a person 4 feet from a wall and a soft light 3 feet from them.", "Use the calculator to predict how many stops darker the wall is.", "Check it with false color. Then move the light to 8 feet and predict again."] },
        quiz: [{ q: "You move a light from 4 ft to 8 ft. The light drops by:", a: ["1 stop", "2 stops", "4 stops"], c: 1, why: "Twice the distance means a quarter of the light, which is two stops." }],
        tools: ["invsq"], book: [["box", "Chapter 5, Manipulating Light"]] },
      { id: "ratios", title: "Contrast ratios", mc: "1.1", summary: "How many stops darker the shadow side is.",
        keywords: "key to fill ratio contrast 2:1 4:1 8:1 stops",
        html: `<p>Contrast on a face is the difference between the lit side and the shadow side, in stops. Every stop doubles the ratio: 1 stop = 2:1, 2 stops = 4:1, 3 stops = 8:1.</p>
          <p>Check it with false color or a meter: read the key side, read the shadow side, count the stops between them. Most working DPs take light away (negative fill) more often than they add fill.</p>`,
        widget: "ratio",
        quiz: [{ q: "The shadow side is 3 stops under. The ratio is:", a: ["3:1", "6:1", "8:1"], c: 2, why: "2 x 2 x 2 = 8." }],
        book: [["landau", "Chapter 3, Lighting the Subject"]] },
      { id: "kelvin", title: "Color temperature", mc: "1.4", summary: "Warm and cool light, and mixing them on purpose.",
        keywords: "kelvin color temperature cto ctb gel warm cool mixed lighting mired",
        html: `<p>Light color is measured in Kelvin. Lower is warmer (candle about 1900K, tungsten 3200K), and higher is cooler (daylight 5600K, shade 8000K and up). The camera's white balance decides which one looks white.</p>
          <ul><li>Your 200x S, PavoSlim, PavoTubes, MC and B7c dial any Kelvin. The 600d and the VL150 are fixed at daylight, so they need CTO from your Rosco color correction kit to go warm.</li>
          <li>CTO (orange) warms a light, and full CTO takes daylight to roughly tungsten. CTB (blue) cools it, and full CTB takes tungsten to roughly daylight. Blue gels eat more light than orange ones.</li>
          <li>Mixed color is a tool: warm practicals plus a cool window is the classic "evening" look.</li></ul>`,
        widget: "kelvin",
        quiz: [{ q: "You want the 600d to match a 3200K lamp. You add:", a: ["Full CTB", "Full CTO", "ND 0.6"], c: 1, why: "CTO warms. Full CTO takes daylight to roughly tungsten." }],
        tools: ["kelvin", "meter"], book: [["box", "Chapter 6, Color"], ["landau", "Chapter 10, Working with Color"]] },
      { id: "practicals", title: "Practicals and motivation", mc: "1.4", summary: "Lights in the frame tell the audience where light comes from.",
        keywords: "practical lamp motivated light source night interior",
        html: `<p>A <b>practical</b> is any light that's in the shot: a lamp, a TV, a phone, a fridge, a streetlight. The audience believes the scene's light comes from it. Your job is to hide a real light that matches its direction and color.</p>
          <ul><li>Dim practicals so they don't clip. Swap bulbs, use a dimmer, or wrap the inside of the shade.</li><li>Put the hidden key on the same side as the practical, at about the same height.</li>
          <li>Household LED bulbs can flicker on camera. Test, or use your own controllable bulbs.</li></ul>`,
        quiz: [{ q: "A lamp is in frame camera right. The face is lit from camera left. The audience will feel:", a: ["Nothing", "Something's off"], c: 1, why: "Light that doesn't match its visible source breaks the world." }],
        setups: ["night-practical"], book: [["landau", "Chapter 9, Night Light"]] },
      { id: "window", title: "Windows and daylight", mc: "1.2", planner: "window-key", summary: "Use the window as a giant softbox. Put the subject beside it.",
        keywords: "window light daylight sun natural interior",
        html: `<p>A window is the biggest, cheapest soft source you have. Place the subject <i>beside</i> the window, not facing it, so the light comes from the side and gives shape. Then control the rest of the room with flags and bounce.</p>
          <ul><li>Direct sun through glass is hard. Diffuse it with a sheer curtain or diffusion on the glass.</li><li>Clouds change the exposure every few minutes. Keep watching false color.</li>
          <li>When the window light fades, put your own light outside the window (or just off-frame) from the same direction.</li></ul>`,
        setups: ["window-negfill"], tools: ["sun"], book: [["landau", "Chapter 8, Dealing with Daylight 2: Working with Windows"]],
        quiz: [{ q: "For shape, the subject usually sits:", a: ["Facing the window", "Beside the window", "Back to the window"], c: 1, why: "Side light from a window shapes the face. Facing it is flat, and back to it is a silhouette." }] }
    ] },

    /* ======================================================= GRIP */
    { id: "grip", title: "Grip and control", blurb: "Your flags, nets, silk, diffusion, bounce, gobos and cookies, and C-stands.", topics: [
      { id: "flags", title: "Flags and cutters", mc: "1.3", summary: "Black fabric that takes light away from where it shouldn't go.",
        keywords: "flag floppy cutter solid 18x24 24x36 shadow cut off spill",
        html: `<p>A <b>flag</b> (solid) is black fabric on a frame. It blocks light. <b>In your kit:</b> the 24x36 solid floppy, and the black block on either of your two 24x36 Fast Flag frames. On bigger sets you'll meet 18x24s, 4x4 floppies (they unfold to 4x8), long thin <b>cutters</b>, and small <b>dots and fingers</b>.</p>
          <ul><li>Use them to keep light off the background, off the lens (flare), off a hot shoulder, or off the top of a wall.</li>
          <li><b>Edge sharpness:</b> a flag close to the light makes a soft, fuzzy cut. A flag close to the subject (far from the light) makes a sharp, clean cut.</li>
          <li>Flag the lens from every light pointed toward camera. A small cutter above the matte box saves a lot of contrast.</li></ul>
          <h3>Setting one</h3><ol><li>Put the flag in a C-stand gobo head on the arm.</li><li>Set the stand with the arm pointing right, so gravity tightens the knuckle (the right-hand rule).</li>
          <li>Walk the flag in from the side until the shadow edge sits where you want it.</li><li>Check from camera: the cut should land just before what you want lit.</li></ol>`,
        drill: { steps: ["Aim a hard light at a wall behind a subject.", "Use your 24x36 to cut the light off the top half of the wall.", "Move the flag toward the light, then toward the wall. Watch the edge go soft, then sharp."], check: "You can put a cut line exactly where someone points." },
        quiz: [{ q: "You want a sharp, crisp shadow line on the wall. The flag goes:", a: ["Right at the light", "Far from the light, near the wall"], c: 1, why: "The closer the flag is to where the shadow lands, the sharper the edge." }],
        book: [["box", "Chapter 5, Manipulating Light"], ["box", "Chapter 10, Stands and Rigging"]] },
      { id: "scrims", title: "Nets and silk (your Fast Flags)", mc: "1.3", summary: "Take light down, or soften it, without moving the light.",
        keywords: "net single double silk artificial silk fast flags westcott scrim stop",
        html: `<p>Your two Westcott Fast Flags 24x36 frames take four fabrics:</p>
          <ul><li><b>Single net:</b> black mesh that cuts light without changing its softness. Westcott rates it at about 3/4 stop.</li>
          <li><b>Double net:</b> two layers, so it cuts more than the single. Meter it once with your camera and write it on the bag.</li>
          <li><b>2-stop artificial silk:</b> white fabric that softens the light <i>and</i> cuts it. Westcott rates it at 2 stops.</li>
          <li><b>Black block:</b> a solid flag.</li></ul>
          <p>Nets feather well. Tilt the frame so only part of the beam passes through it, and you can take down just the top of a face, a hot shoulder or the near half of a wall. That's a job dimming can't do, because a dimmer takes the whole light down.</p>
          <p><b>Wire scrims</b> (metal screens that slide into a fixture's ears) belong to Fresnels and older tungsten heads. Your COB LEDs don't take them, so dim the light instead.</p>`,
        drill: { steps: ["Light a face with the 200x S and Hyper Reflector so the forehead is hot on false color.", "Slide the single net in from the top, between light and face, so only the top of the beam passes through it.", "Tilt the net until the forehead matches the cheeks. Then try the double net and note the difference in stops."], check: "You can pull down one part of a face without touching the dimmer." },
        quiz: [{ q: "You need to soften AND reduce the light on a face. Use:", a: ["Single net", "2-stop artificial silk", "Black block"], c: 1, why: "Nets cut light but keep its quality. A silk diffuses it too." }],
        src: ["westcott_ff", "westcott_silk"], book: [["box", "Chapter 5, Manipulating Light"]] },
      { id: "diffusion", title: "Diffusion", mc: "1.2", summary: "Spreads light out to soften it, and costs some output.",
        keywords: "diffusion 216 250 251 opal grid cloth silk frost light loss",
        html: `<p>Diffusion goes between the light and the subject and turns a small source into a bigger one, but only if it's big and far enough from the light to be filled. Diffusion clipped right on the front of a fixture mostly just cuts output.</p>
          <p><b>What you have, lightest to heaviest:</b></p>
          <ul><li><b>Opal Frost (410) roll:</b> about 1/2 stop. Takes the edge off a hard light or a window and keeps it bright.</li>
          <li><b>Light Dome III outer diffuser only:</b> softer than bare, brighter than the full dome.</li><li><b>Light Dome III, both diffusers:</b> your main soft key.</li>
          <li><b>5-in-1 translucent disc:</b> a 42-inch handheld diffuser. Use it over sun on a face, or in front of the 600d as a quick book light.</li>
          <li><b>Fast Flags 2-stop silk:</b> 24x36 of soft, rated at 2 stops.</li>
          <li><b>Grid cloth (430) roll:</b> about 2 1/2 stops. The softest and most even. Clip a piece to a Fast Flag frame or tape it across a doorway for a big soft source.</li>
          <li><b>White bed sheet and muslin:</b> cheap, big diffusion or bounce. Muslin goes slightly warm.</li></ul>
          <p>For windows, your <b>ND 1.2 gel roll</b> cuts 4 stops with no color change. Tape it to the glass to bring a bright window down to the room.</p>`,
        widget: "diffusion",
        drill: { steps: ["Clip a 24x36 piece of grid cloth to a Fast Flag frame, 2 feet in front of the 200x S, and light a face through it.", "Move the light back so the diffusion fills completely.", "Compare to the bare light with the same diffusion clipped right on the front."] },
        quiz: [{ q: "Your grid cloth (430) costs about:", a: ["1/2 stop", "2 1/2 stops", "5 stops"], c: 1, why: "LEE lists 430 grid cloth at 2 1/2 stops. Opal Frost is the light one at about 1/2." }],
        setups: ["book-light"], src: ["lee_diff", "lee_430", "westcott_silk", "rosco_nd"], book: [["box", "Appendix G, Gels and Diffusions"]] },
      { id: "bounce", title: "Bounce", mc: "1.2", summary: "Light off a white, silver or gold surface. The easiest soft fill.",
        keywords: "bounce reflector 5 in 1 white silver gold beadboard foamcore muslin",
        html: `<p>Bounce reflects light back into the shadows. Your 5-in-1 gives you:</p>
          <ul><li><b>White:</b> soft, natural fill. Start here.</li><li><b>Silver:</b> brighter and punchier. Can look harsh up close.</li><li><b>Gold:</b> warm fill. Easy to overdo, so use it for sunsets and skin warmth.</li>
          <li><b>Translucent:</b> diffusion. Hold it between the sun or a light and the face.</li><li><b>Black:</b> negative fill (see the next topic).</li></ul>
          <p>You have two 5-in-1s, so you can bounce and flag at the same time. For a bigger, softer bounce, use the white bed sheet or a muslin on a C-stand, or bounce the 600d off a white wall or ceiling.</p>
          <p>Bounce falls off fast, so closer means stronger. Under the chin it opens up eye sockets. On the shadow side it controls contrast.</p>`,
        quiz: [{ q: "The gentlest, most natural fill from a 5-in-1 is:", a: ["Gold", "Silver", "White"], c: 2, why: "White is soft and neutral. Silver is hotter and gold changes the color." }],
        setups: ["butterfly"] },
      { id: "negfill", title: "Negative fill", mc: "1.2", summary: "Take light away from the shadow side to build contrast.",
        keywords: "negative fill black flag duvetyne contrast shadow side subtractive",
        html: `<p>White walls, ceilings and floors bounce your key back into the shadows and flatten the face. Negative fill is black material close to the shadow side of the face, just out of frame. It soaks up that bounce. <b>Yours:</b> the 24x36 floppy, the Fast Flags black block, the black side of either 5-in-1, and your blackout curtains for a whole wall.</p>
          <p>It's often the difference between "lit" and "looks like a movie". Try it before you add any fill light.</p>`,
        drill: { steps: ["Light a face in a white room with a single soft key.", "Shoot it. Then put a black floppy 2 feet from the shadow side.", "Compare the shadow side on false color."], check: "The shadow side dropped about a stop with no light added or moved." },
        quiz: [{ q: "In a small white room, the face looks flat even with a side key. Try first:", a: ["Add a fill light", "Black negative fill on the shadow side", "Raise ISO"], c: 1, why: "The room is already filling. Take that bounce away." }],
        setups: ["rembrandt", "window-negfill"] },
      { id: "cinefoil", title: "Stopping spill and light leaks", mc: "1.3", summary: "Keep light off walls, lenses and places it shouldn't go, using what's in your kit.",
        keywords: "spill light leak flare snoot black wrap cinefoil gaffer tape eggcrate grid blackout flag the lens",
        html: `<p>Spill is light landing where you didn't aim it: on the background, on the ceiling, or straight into the lens as flare. Cutting it is half of lighting. Here's what does the job in your kit:</p>
          <ul><li><b>Eggcrate:</b> on the PavoSlim 120C (and a grid on the Light Dome III if you have one) it narrows the spread so a soft key stays off the wall.</li>
          <li><b>Fast Flags black block and the 24x36 floppy:</b> on a C-stand, close to the light for a soft cut, close to the subject for a sharp one.</li>
          <li><b>Flag the lens:</b> if a light behind the actor flares the image, put a flag between that light and the lens, just out of frame. The Tilta Mirage's flags help too.</li>
          <li><b>Gaffer tape:</b> tape over the back and sides of a practical lamp's shade where it glows too bright, and over status LEDs on gear in frame.</li>
          <li><b>Blackout curtains:</b> kill a window or a doorway that's spilling into the shot.</li>
          <li><b>The FL-20G Fresnel and the Spotlight SE:</b> start with a small, controllable beam instead of cutting a big one down.</li></ul>
          <p>Cinefoil (black heat-resistant foil) is the gaffer's usual tool for snoots and leaks. It isn't in your kit. Everything above covers the same jobs for now.</p>`,
        quiz: [{ q: "Your back light is flaring the lens. The fix that keeps the light where it is:", a: ["Flag between the light and the lens", "Raise ISO", "Add diffusion to the key"], c: 0, why: "A flag just out of frame blocks the direct path into the lens without changing the light on the actor." },
          { q: "Your practical lamp's shade glows too bright on one side. A quick fix with your kit:", a: ["Gaffer tape inside that side of the shade", "Add CTB to the key"], c: 0, why: "A strip of tape inside the shade cuts the hot side and doesn't show from the front." }] },
      { id: "gobos", title: "Gobos, cookies and patterns", mc: "1.3", summary: "Throw shapes of light: window panes, blinds, leaves and branches.",
        keywords: "gobo cookie cucoloris cuke breakup pattern spotlight se window blinds leaves branch tree dapple projection",
        html: `<p>A pattern of light tells the audience there's a world off-screen: a window, blinds, a tree outside. Two ways to make one:</p>
          <ul><li><b>Gobo in a spotlight.</b> A small metal or glass pattern slides into a projection lens, which focuses it sharp on the wall or the actor. <b>Yours:</b> the amaran Spotlight SE 36° with its gobo inserts. The planner's notes say it's rated for fixtures up to 300 W, so put it on the 200x S, not the 600d. Turn the focus ring to make the pattern sharp or soft.</li>
          <li><b>Cookie (cucoloris).</b> Anything with holes held in front of a hard light: a cut-out board, a real tree branch on a C-stand, a plant, a chair back, blinds. No lens, so the pattern's softness comes from the distances: <b>cookie closer to the subject = sharper</b>, closer to the light = softer. Use the 600d with the Hyper Reflector or the FL-20G Fresnel spotted in, so the source is small and hard.</li></ul>
          <h3>Setting a branch cookie</h3><ol><li>Hard light 8 to 12 feet from the subject (the 600d on the heavy-duty stand).</li><li>Branch on a C-stand arm about two thirds of the way from the light toward the subject.</li>
          <li>Slide it toward the subject until the leaf edges read. Wiggle it gently during the take for "wind".</li><li>Expose for the bright patches on the face. The shadows should hold detail.</li></ol>`,
        widget: "gobos",
        watch: ["Keep a gobo pattern off the actor's eyes unless that's the point.", "A pattern on a moving actor jumps around. Block them through it, or keep it on the wall.", "Real branches wilt under heat and drop leaves. Bring spares."],
        drill: { steps: ["Put the Spotlight SE on the 200x S with a window gobo. Throw it on a wall behind a seated person.", "Rack the focus ring from soft to sharp and pick what feels like real window light.", "Then hold a branch in front of the 600d. Move it from near the light to near the person and watch the leaves sharpen."], check: "You can make a pattern exactly as sharp or soft as you want, with either method." },
        quiz: [{ q: "Your branch shadow is too blurry. Move the branch:", a: ["Toward the light", "Toward the subject", "Higher"], c: 1, why: "The closer the cookie is to the subject, the sharper its shadow." },
          { q: "Which light goes in the Spotlight SE?", a: ["600d", "200x S"], c: 1, why: "Its rating covers fixtures up to 300 W, so the 200x S is the safe choice." }],
        setups: ["gobo-window", "blinds", "cookie-branch"], book: [["box", "Chapter 5, Manipulating Light"], ["landau", "Chapter 12, Special Lighting Considerations & Effects"]] },
      { id: "cstand", title: "C-stands and safety", mc: "1.3", summary: "Set every stand the same way and it won't fall.",
        keywords: "c stand right hand rule sandbag tallest leg knuckle gobo arm safety boom",
        html: `<ol><li><b>Tallest leg under the load.</b> Point the high leg toward where the arm and weight hang.</li>
          <li><b>Sandbag the tallest leg</b>, saddle side over the leg.</li><li><b>Right-hand rule:</b> stand behind the stand with the knuckle facing you. The arm should hang to the right, so the weight tightens the knob instead of loosening it.</li>
          <li>Mount the flag or light first, then raise it. Lock every riser.</li><li>Keep the arm at a height and angle where nobody walks into it face-first. Tape or tie off overhead booms with a safety line.</li></ol>
          <p>Booming a light over an actor (the top light setup) is where stands fall. Use the boom's counterweight, double-bag it, and never put a light directly over someone without a safety line.</p>
          <p><b>Your grip:</b> 4 C-stands (one with a rocky mountain leg for stairs and slopes), 3 boom arms, a heavy-duty air-cushioned stand for the 600d, 2 foldable stands for small lights, 4 sandbags and a shot bag, 4 apple boxes, a Cardellini end jaw clamp and 3 super clamps for mounting lights on doors and pipes, 10 spring clamps for gels and fabric, and gaffer tape.</p>`,
        watch: ["Loose knuckles that drift down mid-take.", "Stands near doors and walkways.", "Wind outdoors: a flag frame is a sail. Bag heavily or strike it."],
        quiz: [{ q: "The sandbag goes:", a: ["On the shortest leg", "On the tallest leg, under the load", "Anywhere"], c: 1, why: "The tallest leg sits under the weight, so bagging it gives the most stability." }],
        book: [["box", "Chapter 10, Stands and Rigging"], ["box", "Chapter 11, Set Protocol"]] }
    ] },

  ],

  tools: {
    fov: { title: "Field of view", group: "Camera and lens", blurb: "Angle of view and frame size for any lens on your cameras.", widget: "fov", topic: "focal", keywords: "fov field of view angle lens crop" },
    dof: { title: "Depth of field", group: "Camera and lens", blurb: "Near and far focus limits and hyperfocal distance.", widget: "dof", topic: "dof", keywords: "dof depth of field focus hyperfocal" },
    exposure: { title: "Compare exposures", group: "Exposure", blurb: "Change the stop, ISO, shutter or ND and see the difference in stops.", widget: "exposure", topic: "exposure-basics", keywords: "stops equivalent exposure" },
    lux: { title: "Light level to T-stop", group: "Exposure", blurb: "Turn a lux or foot-candle reading into a stop, or the reverse.", widget: "lux", topic: "exposure-basics", src: ["yedlin_meter", "sekonic_c"], keywords: "lux foot candles meter t-stop" },
    shutter: { title: "Shutter angle", group: "Exposure", blurb: "Angle to speed, the 180° rule and flicker-safe settings.", widget: "shutter", topic: "shutter", keywords: "shutter angle speed flicker" },
    nd: { title: "ND calculator", group: "Exposure", blurb: "How much ND for the stop you want.", widget: "nd", topic: "nd", keywords: "nd neutral density filter" },
    scopes: { title: "Scopes and false color", group: "Exposure", blurb: "What the waveform should look like for each look, on each camera.", widget: "scopes", topic: "looks", src: ["sony_slog3", "bmd_pyxis_os", "sony_mc_features"], keywords: "waveform false color slog3 pyxis" },
    invsq: { title: "Light distance", group: "Light", blurb: "Stops gained or lost when you move a light, and background falloff.", widget: "invsq", topic: "falloff", keywords: "inverse square distance falloff" },
    ratio: { title: "Contrast ratio", group: "Light", blurb: "Stops of difference to ratio, with what it looks like.", widget: "ratio", topic: "ratios", keywords: "ratio key fill contrast" },
    kelvin: { title: "Color temperature", group: "Light", blurb: "Kelvin chart and how two sources mix.", widget: "kelvin", topic: "kelvin", keywords: "kelvin color temperature mixed" },
    diffusion: { title: "Diffusion chart", group: "Light", blurb: "Light loss for common LEE diffusions.", widget: "diffusion", topic: "diffusion", src: ["lee_diff", "lee_ldi"], keywords: "diffusion stops 216 250 251" },
    gobos: { title: "Gobo and cookie patterns", group: "Light", blurb: "The patterns the planner can throw, and what each one says.", widget: "gobos", topic: "gobos", keywords: "gobo cookie pattern window blinds leaves branch" },
    meter: { title: "Phone meter and Kelvin reader", group: "On set", blurb: "Use the phone camera to read a white card and estimate T-stop and Kelvin.", widget: "meter", topic: "exposure-basics", beta: true, keywords: "light meter kelvin reader camera phone" },
    sun: { title: "Sun and golden hour", group: "On set", blurb: "Sun position, sunrise, sunset, golden and blue hour, with a compass.", widget: "sun", topic: "scout", src: ["noaa"], keywords: "sun position golden hour blue hour compass gps" }
  },

  diffusion: [
    ["Opal Frost 410 (your roll)", "about 1/2 stop", "Light. Takes the edge off a light or a window."],
    ["Light Dome III, outer diffuser only (yours)", "less than full", "Brighter, slightly harder center."],
    ["Light Dome III, both diffusers (yours)", "the planner's estimate", "Your main soft key."],
    ["5-in-1 translucent disc (yours)", "meter it", "Handheld 42-inch diffuser, great over sun."],
    ["Fast Flags 2-stop silk (yours)", "2 stops", "24x36 of soft, on a C-stand."],
    ["Grid cloth 430 (your roll)", "2 1/2 stops", "Heavy, very even. Big soft sources."],
    ["ND 1.2 gel (your roll, for windows)", "4 stops", "Not diffusion: darkens a window with no color shift."],
    ["For reference: LEE 251 Quarter White", "1/3 stop", "If you buy more: light softening."],
    ["For reference: LEE 250 Half White", "3/4 stop", "Medium."],
    ["For reference: LEE 216 Full White", "1 1/2 stops", "Heavy, the classic."]
  ],


  glossary: [
    ["DP (director of photography)", "You. You turn the script into pictures: the look, camera placement, lenses, movement, light and exposure. You lead camera, grip and electric, and you answer to the director.", "The DP and the crew"],
    ["Cinematographer", "Another name for the DP.", "The DP and the crew"],
    ["Director", "Owns the story and the performances. The DP's job is to give the director the shots the story needs. On your own films you're both, so lock the look in prep.", "The DP and the crew"],
    ["1st AD", "Runs the schedule and calls the takes. Tell the AD how long each relight will take and when camera is ready. On your shoots, you or the director make these calls.", "The DP and the crew"],
    ["Camera operator", "Frames and moves the camera during the take. On your shoots that's usually you.", "The DP and the crew"],
    ["1st AC (focus puller)", "Builds the camera, changes lenses and pulls focus. Without one, pick stops and blocking you can hold focus on yourself.", "The DP and the crew"],
    ["2nd AC (clapper loader)", "Slates, runs cards and batteries, sets actors' marks and keeps the camera report. The easiest job to hand to a helper.", "The DP and the crew"],
    ["DIT", "Digital imaging technician: backs up cards and checks footage on set. On a small crew, the 2nd AC or you do it at lunch and wrap.", "The DP and the crew"],
    ["Gaffer", "Head of electric. Turns the DP's lighting plan into lights on stands. On your shoots that's usually you, working from the Lighting Planner.", "The DP and the crew"],
    ["Best boy electric", "The gaffer's second: crew, gear and power.", "The DP and the crew"],
    ["Key grip", "Head of grip: stands, flags, frames, rigging, dollies and safety.", "The DP and the crew"],
    ["Best boy grip", "The key grip's second.", "The DP and the crew"],
    ["Dolly grip", "Pushes the dolly and hits the same marks every take. Any steady helper can learn your Dana Dolly in a few rehearsals.", "The DP and the crew"],
    ["Swing", "Crew who works for both grip and electric as needed.", "The DP and the crew"],
    ["Camera department", "The DP, operator, ACs and DIT. Grip and electric work for the DP too.", "The DP and the crew"],

    ["Picture's up", "The next take is coming. Finish your last light tweak and get behind the camera.", "Calls on set"],
    ["Last looks", "Final touches on the actors. Your last check of the frame: stands, flags, reflections, hot spots.", "Calls on set"],
    ["Lock it up", "Quiet and still on set. Nobody moves a light or a stand.", "Calls on set"],
    ["Roll sound / Speed", "The call to start the sound recorder, and its answer. Wait for \"Speed\" before you roll camera so the slate lands on both.", "Calls on set"],
    ["Roll camera / Rolling", "The call to start the camera, and your answer. Say \"Rolling\" only after you see the record light or the timecode moving.", "Calls on set"],
    ["Marker / Mark it", "Slate in frame, scene and take read out loud, then the clap. Frame the slate big enough to read.", "Calls on set"],
    ["Set", "Camera's call that the slate is out and frame and focus are ready.", "Calls on set"],
    ["Action / Cut", "The director's calls to start and end the take. Hold the frame and keep rolling until you hear \"Cut\".", "Calls on set"],
    ["Back to one", "Everyone to first positions: actors to first marks, camera and dolly to the start, focus to the first mark.", "Calls on set"],
    ["Reset / Going again", "Another take is coming. Reset the camera and the move.", "Calls on set"],
    ["Hold the roll", "Wait before rolling: a plane, a noise, a light that flickered, a focus problem. Camera can call it too.", "Calls on set"],
    ["Check the gate / Check the clip", "On film, checking the gate for hair or dirt. On digital, play back the end of the take and confirm it recorded and focus held.", "Calls on set"],
    ["Moving on", "The setup is done. Change lens, move camera, start the relight.", "Calls on set"],
    ["Slate (clapper)", "The board with scene, shot, take, card and date. The clap lines up sound and picture. Not in your kit: a slate app on a phone or a hand clap with the numbers said out loud works.", "Calls on set"],
    ["Scene, shot and take numbers", "Scene 12 is the script scene. 12A, 12B are its setups (many crews skip I and O). Take 3 is the third try at that setup.", "Calls on set"],
    ["Tail slate", "Slating at the end of the take, sticks upside down, when the start couldn't be slated.", "Calls on set"],
    ["Soft sticks", "A gentle clap, used close to an actor's face.", "Calls on set"],
    ["Second sticks", "Clapping again because the first clap was missed or out of frame.", "Calls on set"],
    ["Common marker", "One clap that A and B cameras both see.", "Calls on set"],
    ["MOS", "A take with no sound. Show the slate with the sticks closed.", "Calls on set"],
    ["Abby Singer / Martini shot", "The second-to-last shot of the day, and the last.", "Calls on set"],
    ["That's a wrap", "Shooting is done for the day. Camera's work isn't: back up the cards.", "Calls on set"],

    ["Call time", "When you're due on set. Camera and lighting usually arrive before the actors.", "Set talk for camera"],
    ["Call sheet", "The day's plan. As DP, read it for call time, sunrise and sunset, locations and scene order: that's your lighting and lens plan.", "Set talk for camera"],
    ["Shot list", "Every setup for the day in shooting order, with shot size, lens and move. The DP and director write it together.", "Set talk for camera"],
    ["Storyboard", "Drawings of the planned shots. Stick figures are fine.", "Set talk for camera"],
    ["Overhead (floor plan)", "A top-down drawing of camera, actors and lights. The Lighting Planner makes these.", "Set talk for camera"],
    ["Setup", "One camera position and lighting arrangement. Each new setup gets a new letter on the slate.", "Set talk for camera"],
    ["Blocking", "Working out where actors move and where the camera goes, before lighting.", "Set talk for camera"],
    ["Marks", "Tape on the floor where an actor stops. You light and focus to the marks.", "Set talk for camera"],
    ["Stand-in", "Someone who stands on the actor's marks while you light. On your shoots, a helper or a C-stand with a hat.", "Set talk for camera"],
    ["Cheat", "Moving an actor, prop or light off its real position because it looks right in the frame.", "Set talk for camera"],
    ["Turnaround", "Moving the camera to shoot the other direction (the reverse). Usually means relighting.", "Set talk for camera"],
    ["Flying in", "Coming right now.", "Set talk for camera"],
    ["Points / Hot points", "\"Watch out\" when carrying a stand, a light or something hot through the crew.", "Set talk for camera"],
    ["Copy / Copy that", "Heard and understood, on the headsets.", "Set talk for camera"],
    ["Striking", "Turning off a light, or taking gear down.", "Set talk for camera"],

    ["Extreme wide / wide", "The place is the subject, or the whole body in its space. Shows geography and blocking.", "Framing and coverage"],
    ["Full / cowboy / medium", "Head to toe, mid-thigh up, or waist up. Bodies, gestures and conversations.", "Framing and coverage"],
    ["Medium close-up / close-up / extreme close-up", "Chest up, the face, or one detail (eyes, hands). The closer, the more emotion and the less room for error.", "Framing and coverage"],
    ["Establishing shot", "A wide that tells the audience where and when the scene is.", "Framing and coverage"],
    ["Master", "A wide shot that covers the whole scene from start to end.", "Framing and coverage"],
    ["Coverage", "All the shots that cover a scene: master, singles, overs, inserts.", "Framing and coverage"],
    ["Single / two-shot / OTS", "One person, two people, or a shot over someone's shoulder.", "Framing and coverage"],
    ["Clean single / dirty single", "One person alone in frame, or with a bit of the other person's shoulder in the foreground.", "Framing and coverage"],
    ["Reverse", "The matching shot from the other side, looking back at the other actor.", "Framing and coverage"],
    ["Insert / cutaway", "A close shot of an object, or a shot away from the main action.", "Framing and coverage"],
    ["180-degree line", "Keep the camera on one side of the line between two people so screen direction stays consistent.", "Framing and coverage"],
    ["30-degree rule", "Move the camera at least about 30 degrees, or change shot size a lot, between cuts of the same subject, or the cut looks like a jump.", "Framing and coverage"],
    ["Screen direction", "Which way people and things move or look on screen. Keep it consistent across cuts.", "Framing and coverage"],
    ["Eyeline", "Where an actor looks. Close to the lens feels intimate, wider feels observed.", "Framing and coverage"],
    ["Headroom / look room", "Space above the head, and space in the direction the person is looking.", "Framing and coverage"],
    ["Short-siding", "Putting the empty space behind the person instead of in front. Feels trapped or uneasy. A choice, not a mistake, when you mean it.", "Framing and coverage"],
    ["Rule of thirds", "Placing key things on the lines that split the frame into thirds.", "Framing and coverage"],
    ["Negative space", "Empty area in the frame. Lots of it makes a person feel small or alone.", "Framing and coverage"],
    ["Leading lines", "Lines in the set (a hallway, a table edge, a streak of light) that pull the eye to the subject.", "Framing and coverage"],
    ["Frame within a frame", "A doorway, window or mirror that frames the subject inside the shot.", "Framing and coverage"],
    ["Depth (foreground, middle, background)", "Three layers make a flat screen feel deep. Put something close, the subject in the middle and something lit behind.", "Framing and coverage"],
    ["Dutch angle", "A tilted horizon for unease. Use it sparingly.", "Framing and coverage"],
    ["Aspect ratio", "The frame's width to height. 16:9 for most delivery, 2.39:1 for a wide cinema look. The PYXIS records open gate (3:2) so you can choose later.", "Framing and coverage"],

    ["Locked off", "The camera doesn't move. Your tripod, legs bagged.", "Camera movement and support"],
    ["Pan / tilt", "Turning the camera left-right or up-down from one spot.", "Camera movement and support"],
    ["Push in / pull out", "Moving the camera toward or away from the subject. On your kit, the Dana Dolly.", "Camera movement and support"],
    ["Dolly / track", "Moving the camera on wheels or rails. Your Dana Dolly, or the utility cart on a smooth floor.", "Camera movement and support"],
    ["Slide", "A short sideways move. Shot past a foreground object, it shows depth.", "Camera movement and support"],
    ["Parallax", "Near things pass faster than far things when the camera moves. It's what makes a move feel three-dimensional.", "Camera movement and support"],
    ["Handheld", "The camera on your body. Best on the A7S III, which has in-body stabilization.", "Camera movement and support"],
    ["IBIS", "In-body image stabilization: the sensor moves to cancel shake. Your A7S III has it. The PYXIS and 6K Pro don't.", "Camera movement and support"],
    ["Dolly zoom", "Dolly in while zooming out (or the reverse) so the subject holds its size and the background stretches. The Dana Dolly plus a 24-105 can do it.", "Camera movement and support"],
    ["Whip pan", "A pan so fast the image blurs. Often used to cut between two shots.", "Camera movement and support"],
    ["Oner", "A whole scene in one shot with no cuts.", "Camera movement and support"],
    ["Motivated move", "A camera move with a reason in the scene: an actor stands, a door opens, a thought lands.", "Camera movement and support"],
    ["Low mode / high hat", "The camera right at floor level. No high hat in your kit, so use an apple box or nest the camera on a sandbag.", "Camera movement and support"],
    ["Rolling shutter", "The sensor reads top to bottom, so fast pans can lean vertical lines. Test a whip pan before you rely on one.", "Camera movement and support"],

    ["Prime / zoom", "One focal length, or a range. Your zooms: the two 24-105s, the Sigma 18-35 and the Tokina 11-16. Your primes are the vintage set.", "Lenses and focus"],
    ["Focal length", "In millimeters. Shorter is wider, longer is tighter.", "Lenses and focus"],
    ["Field of view", "How much of the scene the lens sees. Depends on focal length and sensor size. The field of view tool shows it for your cameras.", "Lenses and focus"],
    ["Normal lens", "About 40 to 50mm on full frame: close to how the eye sees a scene.", "Lenses and focus"],
    ["Compression", "Long lenses seem to flatten space, but it's the distance doing it. Step back and use a longer lens, and the background seems closer.", "Lenses and focus"],
    ["Depth of field", "How much of the scene is acceptably sharp. Shallower with a wider aperture, closer focus, a longer lens or a bigger sensor.", "Lenses and focus"],
    ["Circle of confusion", "The blur size still accepted as sharp. The calculators here use the sensor diagonal divided by 1500.", "Lenses and focus"],
    ["Hyperfocal distance", "Focus here and everything from half this distance to infinity is acceptably sharp.", "Lenses and focus"],
    ["Bokeh", "The look of the out-of-focus areas.", "Lenses and focus"],
    ["Swirly bokeh", "The Helios-44M-4's circular swirl in the background, strongest wide open near the frame edges.", "Lenses and focus"],
    ["Flare / veiling glare", "Light hitting the lens makes streaks, spots or a haze that lifts the blacks. Flag it, or use it as a look. Your vintage lenses flare more.", "Lenses and focus"],
    ["Focus breathing", "The frame size shifts a little as you pull focus. Check your lenses before a big rack.", "Lenses and focus"],
    ["Parfocal", "A zoom that holds focus as you zoom. Photo zooms like your 24-105s generally aren't, so refocus after zooming.", "Lenses and focus"],
    ["Image circle / vignetting", "The circle of image a lens throws. The Sigma 18-35 and Tokina 11-16 are made for Super35, so they belong on the 6K Pro, not the full-frame PYXIS.", "Lenses and focus"],
    ["Lens adapter", "Your vintage lenses need them: M42 (Takumar, Helios, Industar) and Contax/Yashica (Zeiss 28) to EF or Sony E. The Canon FD 70-210 adapts only to Sony.", "Lenses and focus"],
    ["Minimum focus distance", "The closest a lens can focus. Check it before you plan a tight insert.", "Lenses and focus"],
    ["Pull focus / rack focus", "Changing focus during a shot to follow someone or to move attention.", "Lenses and focus"],
    ["Focus marks", "Tape on the floor and marks on the lens for each focus point, so you can pull by hand without looking.", "Lenses and focus"],
    ["Focus peaking / magnify", "Peaking paints sharp edges in color. Magnify zooms the screen. Use magnify for the final check.", "Lenses and focus"],
    ["Geared focus ring", "Teeth on the focus ring for a follow focus. Your Carenar 135 has one.", "Lenses and focus"],
    ["Matte box", "The hood on the front of the lens that holds filters and blocks flare. Yours is the Tilta Mirage.", "Lenses and focus"],
    ["Step-up ring", "Adapts a lens's filter thread to a bigger one, so smaller lenses can use the Mirage's 77mm ring.", "Lenses and focus"],

    ["Stop", "Double or half the light. Every exposure setting talks in stops.", "Camera and exposure"],
    ["f-stop / T-stop", "Aperture by math (f) or by measured light through the lens (T).", "Camera and exposure"],
    ["Base (native) ISO", "The ISO where the sensor gives its best range and least noise. PYXIS 400 and 3200, A7S III S-Log3 640 and 12800.", "Camera and exposure"],
    ["Shutter angle", "How long each frame is exposed, as part of the frame time. 180° is the normal-looking motion blur.", "Camera and exposure"],
    ["Shutter speed", "Exposure time in seconds. 180° at 24 fps is 1/48, or 1/50 on cameras that don't offer 1/48.", "Camera and exposure"],
    ["Frame rate", "Frames per second. 24 (23.976) for the film look, 30 for some web and broadcast, 60 or more for slow motion.", "Camera and exposure"],
    ["Overcrank / undercrank", "Shooting faster than playback (slow motion) or slower (fast motion).", "Camera and exposure"],
    ["Flicker", "Pulsing or rolling bands from lights on AC power. Use a flicker-safe shutter (see the shutter tool) or change the light.", "Camera and exposure"],
    ["ND", "Neutral density: darkens evenly so you can keep the stop and shutter you want. Built into the 6K Pro.", "Camera and exposure"],
    ["Dynamic range / latitude", "How many stops from the darkest usable shadow to clipping. Log and RAW keep the most.", "Camera and exposure"],
    ["Middle gray", "18% gray, the tone meters and exposure targets aim for. No gray card in your kit yet, so expose by a white card (61 on A7S III zebras in S-Log3) or by skin in false color.", "Camera and exposure"],
    ["Clipping", "Brightness past the camera's top. Detail is gone and can't come back.", "Camera and exposure"],
    ["Highlight roll-off", "How smoothly brights fade into white. Protect skin and windows from clipping and they roll off gently.", "Camera and exposure"],
    ["Noise", "Grainy speckle in the shadows, worse when you underexpose. Expose well and stay at a native ISO.", "Camera and exposure"],
    ["Log", "A flat recording curve (S-Log3) that keeps more highlights and shadows for grading.", "Camera and exposure"],
    ["RAW / BRAW", "The sensor data, with ISO and white balance adjustable later. BRAW is Blackmagic's version, on the PYXIS and 6K Pro.", "Camera and exposure"],
    ["Codec / compression", "How the camera squeezes the file. In BRAW, 12:1 makes smaller files than 3:1 or 5:1. The lower the number, the more data.", "Camera and exposure"],
    ["Bit depth", "How many shades each color can hold. More bits means smoother gradients in the grade.", "Camera and exposure"],
    ["Open gate", "Recording the whole sensor (3:2 on the PYXIS), so you can reframe or cut horizontal and vertical versions from one take.", "Camera and exposure"],
    ["White balance / tint", "Telling the camera what white is (warm to cool), and the green to magenta adjustment.", "Camera and exposure"],
    ["Waveform", "A scope showing brightness across the frame.", "Camera and exposure"],
    ["False color", "Colors painted over the picture to show exposure. Built into the PYXIS.", "Camera and exposure"],
    ["Zebras", "Stripes on parts of the picture at or above a chosen level.", "Camera and exposure"],
    ["Histogram", "A count of pixels from dark to bright.", "Camera and exposure"],
    ["Crop factor", "How much tighter a smaller sensor frames than full frame with the same lens.", "Camera and exposure"],

    ["Look", "The overall visual style: contrast, color, softness, texture. Decide it in prep.", "Color and look"],
    ["Lookbook", "Reference frames that show the look to the director, crew or client.", "Color and look"],
    ["LUT", "Look-up table: turns log into a normal-looking picture for monitoring or grading.", "Color and look"],
    ["Show LUT", "The one LUT used on set and as the starting grade, so everyone sees the same look.", "Color and look"],
    ["Rec.709", "The standard color and brightness for HD video. A monitoring LUT turns log into Rec.709.", "Color and look"],
    ["CST (color space transform)", "A Resolve tool that converts footage between color spaces, like S-Log3 to Rec.709 or to match Blackmagic footage.", "Color and look"],
    ["Camera matching", "Making the A7S III cut with the PYXIS or 6K Pro: same white balance and exposure targets on set, then a CST and a shot match in Resolve.", "Color and look"],
    ["Vectorscope", "Shows color: direction is hue, distance from the center is saturation.", "Color and look"],
    ["Skin tone line", "A line on the vectorscope where healthy skin of every color falls.", "Color and look"],
    ["High key / low key", "Bright with soft shadows, or mostly dark with strong contrast.", "Color and look"],
    ["Chiaroscuro", "Strong light-and-dark modeling, from Renaissance painting.", "Color and look"],
    ["Color palette", "The few colors in the frame: wardrobe, set and light. Your PavoTubes and PavoSlim can add color to the background.", "Color and look"],
    ["Grade", "Color correction and the look, done in Resolve.", "Color and look"],

    ["Key", "The main light on the subject.", "Light"],
    ["Fill", "Light that lifts the shadow side.", "Light"],
    ["Back light / rim / hair light", "Light from behind that outlines hair and shoulders.", "Light"],
    ["Kicker", "Light from behind and to the side that edges the cheek.", "Light"],
    ["Cross key", "Two people lit by two keys, each one also working as the other person's back light.", "Light"],
    ["Ambient light", "The light already in the location before you add any.", "Light"],
    ["Practical", "A light that's visible in the frame: a lamp, a TV, a phone. Your B7c bulb goes in practical lamps.", "Light"],
    ["Motivated light", "Light that seems to come from a real source in the scene.", "Light"],
    ["Book light", "Light bounced off a white surface and then through diffusion. Very soft.", "Light"],
    ["Short side / broad side", "Keying the side of the face turned away from camera (short) or toward it (broad).", "Light"],
    ["Rembrandt / loop / butterfly / split", "The classic key patterns, named for the shadow they make on the face.", "Light"],
    ["Hard / soft light", "Small or far sources make crisp shadows (hard). Big, close sources make gentle ones (soft).", "Light"],
    ["Source size", "How big the light looks from the subject. Bigger and closer is softer.", "Light"],
    ["Wrap", "How far soft light reaches around a face toward the shadow side.", "Light"],
    ["Inverse square law", "Twice the distance, a quarter of the light.", "Light"],
    ["Falloff", "How quickly light gets darker across the frame or the face. Close lights fall off fast, far lights slowly.", "Light"],
    ["Contrast ratio", "How much brighter the lit side is than the shadow side. 2:1 is one stop.", "Light"],
    ["Spill", "Light landing where you didn't aim it.", "Light"],
    ["Hot spot", "A patch much brighter than its surroundings, often on a wall near a light.", "Light"],
    ["Spot / flood", "Narrow or wide beam on a focusable light like your FL-20G Fresnel.", "Light"],
    ["Fresnel", "A light with a stepped glass lens that focuses from spot to flood. Yours: the FL-20G on a COB light.", "Light"],
    ["Softbox / dome / lantern", "Fabric housings that turn a light into a big soft source. Yours: the Light Dome III and the lantern.", "Light"],
    ["COB", "Chip-on-board LED: one bright emitter, like your 600d and 200x S.", "Light"],
    ["Bi-color", "A light that dials between warm and cool. Your 200x S runs 2700 to 6500K.", "Light"],
    ["RGB / full color", "A light that makes any color. Yours: the PavoSlim 120C, PavoTubes, Aputure MC and B7c.", "Light"],
    ["Lighting effects", "Built-in fire, lightning, TV and police flashes on your PavoTubes, MC and B7c.", "Light"],
    ["Lux / foot-candle", "Units of light falling on a surface. The light-level tool turns them into a stop.", "Light"],
    ["Kelvin (K)", "Color temperature. Lower is warmer, higher is cooler. Daylight 5600K, tungsten 3200K.", "Light"],
    ["CTO / CTB", "Orange gel that warms a light, and blue gel that cools it. In your Rosco color correction kit.", "Light"],
    ["Plus green / minus green", "Gels that add or remove green, to match fluorescent or LED sources.", "Light"],
    ["Mired", "A unit for color shifts. Gels are rated in mireds because a shift is the same in mireds at any Kelvin.", "Light"],
    ["CRI / TLCI", "Scores for how faithfully a light shows color. Higher is better, 95 or more is good.", "Light"],
    ["Day for night", "Shooting in daylight and grading it to look like night.", "Light"],
    ["Golden hour / blue hour", "Warm low sun just after sunrise and before sunset. Then the blue glow when the sun is just below the horizon.", "Light"],

    ["Apple box", "A wooden box for raising people, lights or the camera. Full, half, quarter and pancake. You have 4.", "Grip and electric"],
    ["C-stand", "Century stand: the grip's stand with an arm and knuckle (gobo head). You have 4.", "Grip and electric"],
    ["Gobo head (knuckle)", "The clamp on a C-stand that holds the arm and anything in it.", "Grip and electric"],
    ["Rocky mountain leg", "A C-stand leg that adjusts in height for stairs and slopes. One of your C-stands has it.", "Grip and electric"],
    ["Baby pin / junior pin", "The two standard light mounts: 5/8 inch (baby) and 1 1/8 inch (junior). Your stands are baby pin.", "Grip and electric"],
    ["Sandbag / shot bag", "Weights that keep stands from tipping. Bag the tallest leg.", "Grip and electric"],
    ["Cardellini", "A strong end-jaw clamp for pipes, doors and edges.", "Grip and electric"],
    ["Super clamp", "A small ratcheting clamp for mounting lights or arms anywhere.", "Grip and electric"],
    ["Spring clamp (A-clamp)", "Clips gels, diffusion and fabric to frames and stands.", "Grip and electric"],
    ["Flag / floppy / cutter", "Black fabric that blocks light. A floppy has a fold-down panel. A cutter is long and thin.", "Grip and electric"],
    ["Flag the lens", "A flag just out of frame that keeps a light from flaring the lens.", "Grip and electric"],
    ["Net", "Black mesh that cuts light without softening it. Single cuts less than double. Yours come in the Fast Flags kits.", "Grip and electric"],
    ["Silk", "White fabric that softens and cuts light. Your Fast Flags silk cuts about 2 stops.", "Grip and electric"],
    ["Frame / butterfly / overhead", "A big frame holding silk, net or bounce over or beside a scene. You don't own one: the bed sheet or muslin clamped between two C-stands is a cheap version.", "Grip and electric"],
    ["Bounce", "A surface that reflects light: your 5-in-1s, the bed sheet, a wall, a ceiling.", "Grip and electric"],
    ["Negative fill", "Black material that absorbs bounce to deepen a shadow.", "Grip and electric"],
    ["Duvetyne", "Black fabric for blocking light. Your blackout curtains do the same job.", "Grip and electric"],
    ["Diffusion", "Material in front of a light that softens it. Yours: Opal Frost 410 and grid cloth 430 rolls.", "Grip and electric"],
    ["Gobo", "A pattern that shapes light. In a spotlight it's a metal or glass insert, focused by the lens. Yours fit the Spotlight SE.", "Grip and electric"],
    ["Cookie (cucoloris)", "A cut-out or a real object (a branch) in front of a hard light that throws a dappled pattern.", "Grip and electric"],
    ["Cinefoil (black wrap)", "Matte black heat-resistant foil for snoots and light leaks. Not in your kit: gaffer tape and your flags cover most of its jobs.", "Grip and electric"],
    ["Snoot", "A tube on the front of a light that makes a small round pool.", "Grip and electric"],
    ["Grid / eggcrate", "A honeycomb that narrows a soft light's spread. Your PavoSlim has one.", "Grip and electric"],
    ["Barn doors", "Hinged flaps on a light for shaping the beam.", "Grip and electric"],
    ["Gaffer tape", "Cloth tape that holds and comes off clean. Marks, cables, leaks, everything.", "Grip and electric"],
    ["Stinger", "An extension cord. You have an extra-long one and a medium one.", "Grip and electric"],
    ["Circuit", "The outlets that share one breaker. Spread big lights across circuits so you don't trip one.", "Grip and electric"],

    ["Card (mag)", "The recording media. PYXIS: CFexpress Type B. 6K Pro and Z CAM E2: CFast 2.0.", "Cards and data"],
    ["Format", "Erasing a card for a new day. Do it in the camera, and only after two verified backups.", "Cards and data"],
    ["Offload", "Copying a card to drives.", "Cards and data"],
    ["Checksum (verified copy)", "A copy checked file by file against the card. Resolve's Clone tool does it.", "Cards and data"],
    ["3-2-1 backup", "Three copies, on two kinds of storage, one kept somewhere else.", "Cards and data"],
    ["Camera report", "Notes per card: clips, scene and take, lens, stop, ISO, ND and anything that went wrong. A phone note is enough.", "Cards and data"],
    ["Reel / clip number", "How cameras name clips by card and order. Match it to the slate in the camera report.", "Cards and data"],
    ["Proxy", "A small, easy-to-edit copy of heavy footage. Resolve can make them.", "Cards and data"],
    ["Battery rotation", "Charged, in use, charging. Label them and never leave set with all of them flat.", "Cards and data"]
  ],


  sources: {
    sony_slog3: { title: "Sony, Technical Summary for S-Gamut3.Cine/S-Log3 (gray 41%, white 61%, black 3.5%)", url: "https://wikis.utexas.edu/download/attachments/148027475/Sony_Gamut_S-Log3.pdf?api=v2" },
    sony_help_gamma: { title: "Sony Help Guide: gamma settings (S-Log3 puts 18% gray at 41%)", url: "https://helpguide.sony.net/di/pp/v1/en/contents/TP0000909109.html" },
    slog3_skin: { title: "S-Log3 exposure guide: zebras for white card 61%, gray 41%, skin 52%", url: "https://www.scribd.com/document/650185549/How-Correctly-Expose-S-Log3" },
    sony_mc: { title: "Sony Monitor & Control: supported cameras (ILCE-7SM3 Ver. 3.00 or later) and Android support", url: "https://www.sony.ca/en/electronics/support/articles/CCMC01000" },
    sony_mc_features: { title: "Sony Monitor & Control: waveform, false color, histogram and zebra on a phone", url: "https://creatorscloud.sony.net/catalog/en-sa/monitorcontrol/index.html" },
    a7s3_iso: { title: "B&H FAQ: A7S III S-Log base ISO 640", url: "https://www.bhphotovideo.com/explora/photography/features/faq-sony-a7s-iii" },
    bmd_pyxis_os: { title: "Blackmagic PYXIS OS: false color (pink lighter skin, green darker skin, red over)", url: "https://www.blackmagicdesign.com/sa/products/blackmagicpyxis/blackmagicos" },
    bmd_pyxis_iso: { title: "Newsshooter: PYXIS 6K native ISO 400, second base ISO 3200", url: "https://www.newsshooter.com/2024/04/12/blackmagic-design-introduces-a-new-box-style-blackmagic-pyxis-6k-camera/" },
    bmd_pyxis_spec: { title: "Blackmagic PYXIS 6K: full frame 36 x 24mm sensor", url: "https://www.blackmagicdesign.com/sg/products/blackmagicpyxis" },
    bmd_cam_android: { title: "Blackmagic Camera for Android 2.1: remote control of PYXIS", url: "https://www.newsshooter.com/?p=271023" },
    bmd_dev: { title: "Blackmagic developer protocols: Bluetooth and REST camera control", url: "https://www.blackmagicdesign.com/developer/products/camera/sdk-and-software" },
    lee_diff: { title: "LEE diffusion light loss (216, 250, 251, 252, 410, tough spun)", url: "https://etsumcom.zendesk.com/hc/en-us/articles/228991527-LEE-Diffusion" },
    lee_ldi: { title: "LEE Filters Diffusion Index", url: "https://leefilters.com/lighting/diffusion-index-ldi/" },
    asc_diff: { title: "ASC, Diffusion Confusion (diffusion tests)", url: "https://theasc.com/blog/shot-craft/diffusion-confusion" },
    yedlin_meter: { title: "Steve Yedlin, Exposure Equations and Meter Calibration (C = 250 incident)", url: "https://www.yedlin.net/NerdyFilmTechStuff/ExposureEquationsAndMeterCalibration" },
    sekonic_c: { title: "Sekonic: calibration constants (C = 250 flat disc, 340 dome)", url: "https://answers.sekonic.com/5851973/How-are-your-exposure-meters-calibrated" },
    noaa: { title: "NOAA solar calculation details", url: "https://gml.noaa.gov/grad/solcalc/calcdetails.html" },
    wandering: { title: "Wandering DP (Patrick O'Sullivan) on YouTube", url: "https://www.youtube.com/@wanderingdp/videos" },
    filmgrab: { title: "FILMGRAB: stills from films to study lighting and framing", url: "https://film-grab.com" },
    westcott_ff: { title: "Westcott Fast Flags 24x36 kit: single net about 3/4 stop, 2-stop artificial silk", url: "https://www.vistek.ca/store/248403/westcott-24x36-fast-flags" },
    westcott_silk: { title: "Westcott Fast Flags 2-stop artificial silk", url: "https://markertek.com/product/wes-1952/westcott-1952-24-x-36-inch-2-stop-artificial-silk-diffuser" },
    lee_430: { title: "LEE 430 Grid Cloth: stop value 2 1/2", url: "https://ca.leefiltersdirect.com/products/lee-430-grid-cloth-diffusion" },
    rosco_nd: { title: "Rosco: 299 1.2 Neutral Density cuts 4 stops", url: "https://admin.rosco.com/sites/default/files/content/resource/2016-10/RoscoUKFilmmakingNo3.pdf" },
    gear_locker: { title: "Cam's Gear Locker (your kit list)", url: "https://claude.ai/artifact/Fo56TNTTLSgyjxRPz2JzCF" },
    box_book: { title: "Harry C. Box, Set Lighting Technician's Handbook, 5th edition (Routledge)", url: "https://www.routledge.com/Set-Lighting-Technicians-Handbook-Film-Lighting-Equipment-Practice-and-Electrical-Distribution/Box/p/book/9781138391727" }
  }
};
