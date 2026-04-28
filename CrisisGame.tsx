import React, { useState, useEffect, useCallback, useRef } from "react";

const GRID_ROWS = 7;
const GRID_COLS = 6;
const MAX_TIME = 60;
const BOMB_COST = 5;

const COLORS = ["🔴", "🟡", "🟢", "🔵", "🟣"];
const BG_COLORS: Record<string, string> = {
  "🔴": "#f87171", "🟡": "#facc15", "🟢": "#34d399", "🔵": "#60a5fa", "🟣": "#c084fc"
};

// ─── WEB AUDIO ────────────────────────────────────────────────────────────────
function createAudioContext(): AudioContext | null {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); }
  catch { return null; }
}

function playPop(ctx: AudioContext) {
  try {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine";
    const t = ctx.currentTime;
    o.frequency.setValueAtTime(600, t);
    o.frequency.exponentialRampToValueAtTime(200, t + 0.1);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.start(t); o.stop(t + 0.12);
  } catch {}
}

function playCombo(ctx: AudioContext, level: number) {
  try {
    const notes = [523, 659, 784, 1047, 1319];
    for (let i = 0; i < Math.min(level, notes.length); i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "triangle";
      const t = ctx.currentTime + i * 0.09;
      o.frequency.setValueAtTime(notes[i], t);
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.start(t); o.stop(t + 0.18);
    }
  } catch {}
}

function playBomb(ctx: AudioContext) {
  try {
    const t = ctx.currentTime;

    // Katman 1: Derin boom gürültüsü
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.8);
    const src = ctx.createBufferSource();
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 100;
    const g1 = ctx.createGain();
    src.buffer = buf;
    src.connect(lp); lp.connect(g1); g1.connect(ctx.destination);
    g1.gain.setValueAtTime(1.5, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    src.start(t); src.stop(t + 0.6);

    // Katman 2: Orta frekans "crack" sesi
    const buf2 = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const d2 = buf2.getChannelData(0);
    for (let i = 0; i < d2.length; i++)
      d2[i] = (Math.random() * 2 - 1) * (1 - i / d2.length);
    const src2 = ctx.createBufferSource();
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 800; bp.Q.value = 0.5;
    const g2 = ctx.createGain();
    src2.buffer = buf2;
    src2.connect(bp); bp.connect(g2); g2.connect(ctx.destination);
    g2.gain.setValueAtTime(0.8, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    src2.start(t); src2.stop(t + 0.15);

    // Katman 3: Tiz "fsssh" yayılma sesi
    const buf3 = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const d3 = buf3.getChannelData(0);
    for (let i = 0; i < d3.length; i++)
      d3[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d3.length, 0.8);
    const src3 = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
    const g3 = ctx.createGain();
    src3.buffer = buf3;
    src3.connect(hp); hp.connect(g3); g3.connect(ctx.destination);
    g3.gain.setValueAtTime(0.25, t);
    g3.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    src3.start(t); src3.stop(t + 0.3);

    // Katman 4: Düşen pitch tonu (BOOM hissi)
    const osc = ctx.createOscillator(), og = ctx.createGain();
    osc.connect(og); og.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.4);
    og.gain.setValueAtTime(0.6, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.4);
  } catch {}
}

function playError(ctx: AudioContext) {
  try {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "square"; o.frequency.value = 160;
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.start(); o.stop(ctx.currentTime + 0.12);
  } catch {}
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }

function createGrid() {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => randomColor())
  );
}

function getConnected(grid: string[][], row: number, col: number, color: string, visited = new Set<string>()): Set<string> {
  const key = `${row},${col}`;
  if (visited.has(key) || row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS || grid[row][col] !== color) return visited;
  visited.add(key);
  getConnected(grid, row - 1, col, color, visited);
  getConnected(grid, row + 1, col, color, visited);
  getConnected(grid, row, col - 1, color, visited);
  getConnected(grid, row, col + 1, color, visited);
  return visited;
}

function applyGravity(grid: string[][]) {
  const g = grid.map(r => [...r]);
  for (let c = 0; c < GRID_COLS; c++) {
    const filled = g.map(r => r[c]).filter(Boolean);
    const empty = g.length - filled.length;
    for (let r = 0; r < empty; r++) g[r][c] = null as any;
    for (let r = empty; r < g.length; r++) g[r][c] = filled[r - empty];
  }
  return g;
}

function refill(grid: string[][]) {
  return grid.map(r => r.map(c => c ?? randomColor()));
}

function loadBest() { try { return parseInt(localStorage.getItem("cg_best") || "0"); } catch { return 0; } }
function saveBest(s: number) { try { localStorage.setItem("cg_best", String(s)); } catch {} }

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function CrisisGame({ onClose, onAddXp }: { onClose: () => void; onAddXp?: (xp: number) => void }) {
  const [bestScore, setBestScore] = useState(loadBest);
  const [screen, setScreen] = useState<"menu" | "game" | "result">("menu");
  const [grid, setGrid] = useState(createGrid);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboText, setComboText] = useState<string | null>(null);
  const [shakeGrid, setShakeGrid] = useState(false);
  const [won, setWon] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const audio = () => {
    if (!audioRef.current) audioRef.current = createAudioContext();
    if (audioRef.current?.state === "suspended") audioRef.current.resume();
    return audioRef.current;
  };

  const startGame = useCallback(() => {
    setGrid(createGrid()); setTimeLeft(MAX_TIME); setScore(0);
    setBusy(false); setCombo(0); setComboText(null); setWon(false);
    setScreen("game");
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setWon(true);
    const nb = Math.max(bestScore, finalScore);
    setBestScore(nb); saveBest(nb);
    setTimeout(() => setScreen("result"), 500);
  }, [bestScore]);

  useEffect(() => {
    if (screen !== "game" || won) return;
    if (timeLeft <= 0) { endGame(score); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [screen, timeLeft, won, score]);

  // Web Animations API — React state'i değil, doğrudan DOM'a uygula
  const animateCells = useCallback((keys: Set<string>, type: "pop" | "new") => {
    keys.forEach(key => {
      const el = cellRefs.current.get(key);
      if (!el) return;
      if (type === "pop") {
        el.animate(
          [
            { transform: "scale(1)", opacity: "1" },
            { transform: "scale(1.25)", opacity: "0.7" },
            { transform: "scale(0.2)", opacity: "0" },
          ],
          { duration: 160, easing: "ease-out", fill: "none" }
        );
      } else {
        el.animate(
          [
            { transform: "scale(0.6)", opacity: "0" },
            { transform: "scale(1.08)", opacity: "1" },
            { transform: "scale(1)", opacity: "1" },
          ],
          { duration: 180, easing: "ease-out", fill: "none" }
        );
      }
    });
  }, []);

  const handleTap = useCallback((row: number, col: number) => {
    if (busy || timeLeft <= 0) return;
    const ctx = audio();
    const color = grid[row][col];
    const connected = getConnected(grid, row, col, color);

    if (connected.size < 2) {
      if (ctx) playError(ctx);
      setShakeGrid(true);
      setTimeout(() => setShakeGrid(false), 220);
      return;
    }

    if (ctx) playPop(ctx);
    setBusy(true);

    // 1) Patlama animasyonunu DOM'a uygula (React render yok = kararma yok)
    animateCells(connected, "pop");

    // 2) Animasyon bitmeden hemen önce grid'i güncelle
    setTimeout(() => {
      const newKeys = new Set<string>();
      setGrid(prev => {
        let g = prev.map(r => [...r]);
        connected.forEach(k => { const [r, c] = k.split(",").map(Number); g[r][c] = null as any; });
        g = applyGravity(g);
        const filled = refill(g);
        for (let r = 0; r < GRID_ROWS; r++)
          for (let c = 0; c < GRID_COLS; c++)
            if (!g[r][c] && filled[r][c]) newKeys.add(`${r},${c}`);
        return filled;
      });

      // 3) React render'dan sonra yeni hücrelere animasyon
      requestAnimationFrame(() => requestAnimationFrame(() => {
        animateCells(newKeys, "new");
        setBusy(false);
      }));

      const nc = combo + 1;
      const pts = connected.size * 10 * (nc >= 3 ? 2 : 1);
      setScore(s => s + pts);
      setCombo(nc);
      if (nc >= 3) {
        if (nc % 5 === 0 && ctx) playCombo(ctx, nc);
        setComboText(`${nc}x KOMBO! +${pts}`);
        setTimeout(() => setComboText(null), 1300);
      }
    }, 140);
  }, [grid, timeLeft, busy, combo, animateCells]);

  const handleBomb = useCallback(() => {
    if (busy || timeLeft <= 0) return;
    const ctx = audio();
    if (timeLeft <= BOMB_COST) {
      if (ctx) playError(ctx);
      setShakeGrid(true); setTimeout(() => setShakeGrid(false), 220);
      return;
    }
    if (ctx) playBomb(ctx);
    setBusy(true);

    const cells = new Set<string>();
    const r = Math.floor(Math.random() * GRID_ROWS);
    const c = Math.floor(Math.random() * GRID_COLS);
    cells.add(`${r},${c}`);
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1],[r-1,c-1],[r+1,c+1],[r-1,c+1],[r+1,c-1]]
      .filter(([nr,nc]) => nr>=0&&nr<GRID_ROWS&&nc>=0&&nc<GRID_COLS)
      .sort(()=>Math.random()-0.5).slice(0,3)
      .forEach(([nr,nc]) => cells.add(`${nr},${nc}`));

    Array.from(cells).forEach(key => {
      const [rr,cc] = key.split(",").map(Number);
      const col = grid[rr][cc];
      if (col) { const conn = getConnected(grid, rr, cc, col); if (conn.size >= 2) conn.forEach(k => cells.add(k)); }
    });

    animateCells(cells, "pop");

    setTimeout(() => {
      const newKeys = new Set<string>();
      setGrid(prev => {
        let g = prev.map(r => [...r]);
        cells.forEach(k => { const [rr,cc] = k.split(",").map(Number); g[rr][cc] = null as any; });
        g = applyGravity(g);
        const filled = refill(g);
        for (let r2 = 0; r2 < GRID_ROWS; r2++)
          for (let c2 = 0; c2 < GRID_COLS; c2++)
            if (!g[r2][c2] && filled[r2][c2]) newKeys.add(`${r2},${c2}`);
        return filled;
      });

      requestAnimationFrame(() => requestAnimationFrame(() => {
        animateCells(newKeys, "new");
        setBusy(false);
      }));

      const pts = cells.size * 15;
      setScore(s => s + pts);
      setTimeLeft(t => Math.max(0, t - BOMB_COST));
    }, 140);
  }, [grid, timeLeft, busy, animateCells]);

  if (screen === "menu") return <MenuScreen bestScore={bestScore} onStart={startGame} onClose={onClose} />;
  if (screen === "result") return <ResultScreen score={score} bestScore={bestScore} onReplay={startGame} onClose={onClose} />;

  return (
    <div style={S.overlay}>
      <div style={{ ...S.gameCard, animation: shakeGrid ? "shake 0.22s ease" : "none" }}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <span style={{ ...S.movesNum, color: timeLeft <= 10 ? "#ef4444" : "#f1f5f9" }}>{timeLeft}</span>
            <span style={S.movesLabel}>saniye</span>
          </div>
          <div style={S.scoreBox}>
            <span style={S.scoreNum}>{score}</span>
            <span style={S.scoreLabel}>puan</span>
          </div>
          <button onClick={() => { endGame(score); onClose(); }} style={S.quitBtn}>✕</button>
        </div>

        {/* Progress */}
        <div style={S.progressTrack}>
          <div style={{
            ...S.progressFill,
            width: `${(timeLeft / MAX_TIME) * 100}%`,
            background: timeLeft <= 10 ? "linear-gradient(90deg,#ef4444,#f97316)" : "linear-gradient(90deg,#34d399,#10b981)"
          }} />
        </div>

        {/* Combo */}
        {comboText && <div style={S.comboText}>{comboText}</div>}

        {/* Grid */}
        <div style={S.gridWrap}>
          {grid.map((row, r) => row.map((color, c) => {
            const key = `${r},${c}`;
            return (
              <div
                key={key}
                ref={el => { if (el) cellRefs.current.set(key, el); else cellRefs.current.delete(key); }}
                onClick={() => handleTap(r, c)}
                onPointerDown={e => { e.currentTarget.style.transform = "scale(0.87)"; }}
                onPointerUp={e => { e.currentTarget.style.transform = ""; }}
                onPointerLeave={e => { e.currentTarget.style.transform = ""; }}
                style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: BG_COLORS[color],
                  border: "2px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 3px 7px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, userSelect: "none",
                  transition: "transform 0.07s ease",
                }}
              >
                {color}
              </div>
            );
          }))}
        </div>

        {/* Bomb */}
        <button onClick={handleBomb} style={{ ...S.bombBtn, background: "linear-gradient(135deg,#1e293b,#334155)" }}>
          <span style={{ fontSize: 24 }}>💣</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>BOMBA</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>4 Tobu Patlat</div>
          </div>
          <div style={{
            marginLeft: "auto",
            background: timeLeft <= BOMB_COST ? "#ef444433" : "#10b98133",
            borderRadius: 6, padding: "2px 8px",
            fontSize: 12, fontWeight: 700,
            color: timeLeft <= BOMB_COST ? "#fca5a5" : "#6ee7b7",
          }}>-{BOMB_COST} sn</div>
        </button>

        <style>{`
          @keyframes shake  { 0%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} 100%{transform:translateX(0)} }
          @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.6} }
          @keyframes slideUp{ from{opacity:0;transform:translateX(-50%) translateY(6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        `}</style>
      </div>
    </div>
  );
}

function MenuScreen({ bestScore, onStart, onClose }: any) {
  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <button onClick={onClose} style={S.closeBtn}>✕</button>
        <div style={{ fontSize: 56, marginBottom: 8 }}>💥</div>
        <h1 style={S.title}>ZİNCİR KIRICI</h1>
        <p style={S.subtitle}>Sigara isteğini patlatarak geç!</p>
        <div style={S.statsRow}>
          <div style={S.stat}><span style={S.statNum}>{bestScore}</span><span style={S.statLabel}>En İyi Skor</span></div>
        </div>
        <div style={S.rulesBox}>
          {[["⏱️","1 dakikan var, en yüksek skoru yap!"],["👆","Aynı renk 2+ hücreye dokun ve patlat"],["✅","Zincir ne kadar uzunsa o kadar puan!"],["💣","BOMBA: 4 tobu patlatır (-5 sn)"]].map(([icon,text]) => (
            <div key={text} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <span style={{ fontSize:13, color:"#cbd5e1" }}>{text}</span>
            </div>
          ))}
        </div>
        <button onClick={onStart} style={S.playBtn}>OYNA →</button>
      </div>
    </div>
  );
}

function ResultScreen({ score, bestScore, onReplay, onClose }: any) {
  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <div style={{ fontSize: 64, marginBottom: 4 }}>⏱️</div>
        <h2 style={{ ...S.title, fontSize: 26, marginBottom: 4 }}>Süre Doldu!</h2>
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:20 }}>Düşünceni dağıttın, bu yeterli ✨</p>
        <div style={S.statsRow}>
          <div style={S.stat}><span style={S.statNum}>{score}</span><span style={S.statLabel}>Skor</span></div>
          <div style={S.statDivider} />
          <div style={S.stat}><span style={S.statNum}>{bestScore}</span><span style={S.statLabel}>Rekor</span></div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={onReplay} style={S.playBtn}>Tekrar Oyna</button>
          <button onClick={onClose} style={{ ...S.playBtn, background:"linear-gradient(135deg,#334155,#1e293b)" }}>Kapat</button>
        </div>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  overlay: {
    position:"fixed", inset:0,
    background:"rgba(2,6,23,0.96)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:9999, padding:16,
    fontFamily:"'Segoe UI',system-ui,sans-serif",
  },
  card: {
    background:"linear-gradient(160deg,#0f172a,#1e293b)",
    border:"1px solid rgba(148,163,184,0.15)",
    borderRadius:24, padding:"28px 24px",
    width:"100%", maxWidth:380,
    textAlign:"center", position:"relative",
    boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
  },
  gameCard: {
    background:"linear-gradient(160deg,#0f172a,#1e293b)",
    border:"1px solid rgba(148,163,184,0.15)",
    borderRadius:24, padding:"16px 14px",
    width:"100%", maxWidth:380,
    position:"relative",
    boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
  },
  title:{ fontSize:28, fontWeight:900, color:"#f1f5f9", margin:"0 0 6px", letterSpacing:-0.5 },
  subtitle:{ fontSize:14, color:"#94a3b8", marginBottom:20 },
  closeBtn:{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.07)", border:"none", color:"#94a3b8", width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:700 },
  statsRow:{ display:"flex", justifyContent:"center", alignItems:"center", gap:12, background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"14px 20px", marginBottom:16 },
  stat:{ display:"flex", flexDirection:"column", alignItems:"center" },
  statNum:{ fontSize:24, fontWeight:800, color:"#f1f5f9", lineHeight:1.1 },
  statLabel:{ fontSize:11, color:"#64748b", marginTop:2 },
  statDivider:{ width:1, height:32, background:"rgba(148,163,184,0.15)", margin:"0 4px" },
  rulesBox:{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"14px 16px", marginBottom:20, textAlign:"left" },
  playBtn:{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"white", border:"none", padding:"16px 24px", borderRadius:16, fontSize:18, fontWeight:800, cursor:"pointer", width:"100%", boxShadow:"0 8px 20px rgba(99,102,241,0.4)" },
  header:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  headerLeft:{ display:"flex", flexDirection:"column", alignItems:"flex-start" },
  movesNum:{ fontSize:28, fontWeight:900, lineHeight:1 },
  movesLabel:{ fontSize:12, color:"#94a3b8", fontWeight:600 },
  scoreBox:{ display:"flex", alignItems:"baseline", gap:4 },
  scoreNum:{ fontSize:32, fontWeight:900, color:"#10b981" },
  scoreLabel:{ fontSize:14, color:"#64748b", fontWeight:700 },
  quitBtn:{ background:"rgba(255,255,255,0.07)", border:"none", color:"#94a3b8", width:28, height:28, borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:700 },
  progressTrack:{ height:8, background:"rgba(255,255,255,0.05)", borderRadius:4, marginBottom:18, overflow:"hidden" },
  progressFill:{ height:"100%", transition:"width 0.3s ease, background 0.5s ease" },
  comboText:{ position:"absolute", top:78, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#ef4444)", color:"white", padding:"6px 16px", borderRadius:20, fontWeight:800, fontSize:14, zIndex:20, animation:"slideUp 0.3s ease, pulse 0.6s infinite", boxShadow:"0 4px 12px rgba(245,158,11,0.4)", whiteSpace:"nowrap" },
  gridWrap:{ display:"grid", gridTemplateColumns:`repeat(${GRID_COLS},44px)`, gap:4, width:"fit-content", margin:"0 auto", background:"transparent", padding:12, borderRadius:16, marginBottom:18 },
  bombBtn:{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 16px", border:"none", borderRadius:16, cursor:"pointer", transition:"all 0.2s", textAlign:"left" },
};
