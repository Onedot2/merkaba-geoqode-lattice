import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const NL = f.includes("\r\n") ? "\r\n" : "\n";

// ctrl-row
const cRow = `      <div class="ctrl-row">${NL}        <button class="ctrl-btn" id="ctrl-prev" title="Previous scene">\u23EE</button>${NL}        <button class="ctrl-btn xl" id="ctrl-play" title="Play / Pause">\u25B6</button>`;
console.log("ctrl-row match:", f.indexOf(cRow) !== -1);

// startPlayback
const sp = `function startPlayback() {${NL}  playerPlaying = true;`;
console.log("startPlayback match:", f.indexOf(sp) !== -1);

// pausePlayback
const pp = `function pausePlayback() {${NL}  playerPlaying = false;`;
console.log("pausePlayback match:", f.indexOf(pp) !== -1);

// kbd F
const kb = `    case 'f': case 'F': document.getElementById('ctrl-fs').click(); break;`;
console.log("kbd F match:", f.indexOf(kb) !== -1);

// card-thumb
const ct = `    <div class="card-thumb" style="background:\${prog.thumb}">`;
console.log("card-thumb match:", f.indexOf(ct) !== -1);

// card click listener
const cc = `  card.addEventListener('click', () => openPlayer(prog.id, hasProgress ? p.scene : 0));`;
console.log("card click match:", f.indexOf(cc) !== -1);

// openInfo
const oi = `function openInfo(progId, e) {`;
console.log("openInfo match:", f.indexOf(oi) !== -1);

// jsAnchor
const ja = `\n</script>\n</body>\n</html>`;
const ja2 = `\r\n</script>\r\n</body>\r\n</html>`;
console.log("jsAnchor (LF):", f.indexOf(ja) !== -1);
console.log("jsAnchor (CRLF):", f.indexOf(ja2) !== -1);

// modal-acts
const ma = `      <div class="modal-acts">`;
console.log("modal-acts match:", f.indexOf(ma) !== -1);

// up-next player close
const unc = `\n</div>\n\n<!-- \u2500\u2500 INFO MODAL \u2500\u2500 -->`;
const unc2 = `\r\n</div>\r\n\r\n<!-- \u2500\u2500 INFO MODAL \u2500\u2500 -->`;
console.log("player-close anchor (LF):", f.indexOf(unc) !== -1);
console.log("player-close anchor (CRLF):", f.indexOf(unc2) !== -1);

// card-live-cv check (already patched?)
console.log("card-live-cv exists:", f.includes("card-live-cv"));

// mobile CSS anchor
const mob = `    /* \u2500\u2500 MOBILE \u2500\u2500 */`;
console.log("mobile CSS anchor:", f.indexOf(mob) !== -1);
