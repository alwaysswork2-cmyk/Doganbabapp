import React, { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GRID_ROWS = 7;
const GRID_COLS = 6;
const MAX_TIME = 60;
const BOMB_COST = 5;

const COLORS = ["🔴", "🟡", "🟢", "🔵", "🟣"];
const BG_COLORS: Record<string, string> = {
  "🔴": "#f87171", "🟡": "#facc15", "🟢": "#34d399", "🔵": "#60a5fa", "🟣": "#c084fc"
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createGrid() {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => randomColor())
  );
}

function getConnected(grid: string[][], row: number, col: number, color: string, visited = new Set<string>()) {
  const key = `${row},${col}`;
  if (visited.has(key)) return visited;
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return visited;
  if (grid[row][col] !== color) return visited;
  visited.add(key);
  getConnected(grid, row - 1, col, color, visited);
  getConnected(grid, row + 1, col, color, visited);
  getConnected(grid, row, col - 1, color, visited);
  getConnected(grid, row, col + 1, color, visited);
  return visited;
}

function applyGravity(grid: string[][]) {
  const newGrid = grid.map(row => [...row]);
  for (let col = 0; col < GRID_COLS; col++) {
    let filled = newGrid.map(r => r[col]).filter(c => c !== null);
    let empty = newGrid.length - filled.length;
    for (let row = 0; row < empty; row++) newGrid[row][col] = null as unknown as string;
    for (let row = empty; row < newGrid.length; row++) newGrid[row][col] = filled[row - empty];
  }
  return newGrid;
}

function refillNulls(grid: string[][]) {
  return grid.map(row => row.map(cell => cell === null ? randomColor() : cell));
}

function loadBestScore() {
  try {
    const raw = localStorage.getItem("crisis_game_best");
    return raw ? parseInt(raw, 10) : 0;
  } catch { return 0; }
}

function saveBestScore(score: number) {
  localStorage.setItem("crisis_game_best", score.toString());
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CrisisGame({ onClose, onAddXp }: { onClose: () => void, onAddXp?: (xp: number) => void }) {
  const [bestScore, setBestScore] = useState(loadBestScore());
  const [screen, setScreen] = useState("menu"); // menu | game | result
  const [grid, setGrid] = useState(createGrid);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [selected, setSelected] = useState<Set<string> | null>(null);
  const [exploding, setExploding] = useState<Set<string>>(new Set());
  const [bombAnim, setBombAnim] = useState<boolean>(false);
  const [combo, setCombo] = useState(0);
  const [comboText, setComboText] = useState<string | null>(null);
  const [shakeGrid, setShakeGrid] = useState(false);
  const [won, setWon] = useState(false);

  const startGame = useCallback(() => {
    setGrid(createGrid());
    setTimeLeft(MAX_TIME);
    setScore(0);
    setEarnedXp(0);
    setSelected(null);
    setExploding(new Set());
    setCombo(0);
    setComboText(null);
    setWon(false);
    setScreen("game");
  }, []);

  // Timer effect
  useEffect(() => {
    if (screen === "game" && timeLeft > 0 && !won) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (screen === "game" && timeLeft <= 0 && !won) {
      endGame(score);
    }
  }, [screen, timeLeft, won, score]);

  // ── Normal tap ──
  const handleTap = useCallback((row: number, col: number) => {
    if (exploding.size > 0 || bombAnim || timeLeft <= 0) return;

    const color = grid[row][col];
    const connected = getConnected(grid, row, col, color);
    if (connected.size < 2) {
      setSelected(null);
      setShakeGrid(true);
      setTimeout(() => setShakeGrid(false), 300);
      return;
    }

    // Direkt patlatma (seçme adımını atlıyoruz)
    setExploding(connected);
    setSelected(null);
    setTimeout(() => {
      setGrid(prev => {
        let g = prev.map(r => [...r]);
        connected.forEach(k => { const [r, c] = k.split(",").map(Number); g[r][c] = null as unknown as string; });
        g = applyGravity(g);
        g = refillNulls(g);
        return g;
      });
      const newCombo = combo + 1;
      const multiplier = newCombo >= 3 ? 2 : 1;
      const pts = connected.size * 10 * multiplier;
      setScore(s => s + pts);
      setCombo(newCombo);
      if (newCombo >= 3) {
        setComboText(`${newCombo}x KOMBO! +${pts}`);
        setTimeout(() => setComboText(null), 1200);
      }
      setExploding(new Set());
    }, 350);
  }, [grid, selected, timeLeft, exploding, bombAnim, combo, score]);

  const handleBomb = useCallback(() => {
    if (exploding.size > 0 || bombAnim || timeLeft <= 0) return;
    
    if (timeLeft <= BOMB_COST) {
      setShakeGrid(true);
      setTimeout(() => setShakeGrid(false), 400);
      return;
    }

    const cellsToExplode = new Set<string>();
    
    const r = Math.floor(Math.random() * GRID_ROWS);
    const c = Math.floor(Math.random() * GRID_COLS);
    cellsToExplode.add(`${r},${c}`);
    
    const neighbors = [
      [r-1, c], [r+1, c], [r, c-1], [r, c+1],
      [r-1, c-1], [r+1, c+1], [r-1, c+1], [r+1, c-1]
    ].filter(([nr, nc]) => nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS);
    
    neighbors.sort(() => Math.random() - 0.5);
    if (neighbors.length > 0) cellsToExplode.add(`${neighbors[0][0]},${neighbors[0][1]}`);
    if (neighbors.length > 1) cellsToExplode.add(`${neighbors[1][0]},${neighbors[1][1]}`);
    if (neighbors.length > 2) cellsToExplode.add(`${neighbors[2][0]},${neighbors[2][1]}`);

    const initialExplosion = Array.from(cellsToExplode);
    for (const key of initialExplosion) {
      const [rr, cc] = key.split(",").map(Number);
      const color = grid[rr][cc];
      if (color) {
        const connected = getConnected(grid, rr, cc, color);
        if (connected.size >= 2) {
          connected.forEach(k => cellsToExplode.add(k));
        }
      }
    }
    
    setBombAnim(true);
    setTimeout(() => {
      setExploding(cellsToExplode);
      setTimeout(() => {
        setGrid(prev => {
          let g = prev.map(row => [...row]);
          cellsToExplode.forEach(k => { const [rr, cc] = k.split(",").map(Number); g[rr][cc] = null as unknown as string; });
          g = applyGravity(g);
          g = refillNulls(g);
          return g;
        });
        const pts = cellsToExplode.size * 15;
        setScore(s => s + pts);
        setExploding(new Set());
        setBombAnim(false);
        setTimeLeft(t => Math.max(0, t - BOMB_COST));
      }, 450);
    }, 100);
  }, [grid, timeLeft, exploding, bombAnim]);

  const endGame = useCallback((finalScore: number) => {
    setWon(true);
    const newBest = Math.max(bestScore, finalScore);
    setBestScore(newBest);
    saveBestScore(newBest);
    
    setTimeout(() => setScreen("result"), 600);
  }, [bestScore]);

  // ── SCREENS ──
  if (screen === "menu") return <MenuScreen bestScore={bestScore} onStart={startGame} onClose={onClose} />;
  if (screen === "result") return <ResultScreen score={score} earnedXp={earnedXp} bestScore={bestScore} onReplay={startGame} onClose={onClose} />;

  return (
    <GameScreen
      grid={grid}
      timeLeft={timeLeft}
      score={score}
      selected={selected}
      exploding={exploding}
      bombAnim={bombAnim}
      shakeGrid={shakeGrid}
      comboText={comboText}
      onTap={handleTap}
      onBomb={handleBomb}
      onClose={() => { endGame(score); onClose(); }}
    />
  );
}

// ─── MENU SCREEN ──────────────────────────────────────────────────────────────
function MenuScreen({ bestScore, onStart, onClose }: any) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <div style={{ fontSize: 56, marginBottom: 8 }}>💥</div>
        <h1 style={styles.title}>ZİNCİR KIRICI</h1>
        <p style={styles.subtitle}>Sigara isteğini patlatarak geç!</p>

        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{bestScore}</span>
            <span style={styles.statLabel}>En İyi Skor</span>
          </div>
        </div>

        <div style={styles.rulesBox}>
          <RuleRow icon="⏱️" text="1 dakikan var, en yüksek skoru yap!" />
          <RuleRow icon="👆" text="Aynı renk 2+ hücreye dokun ve patlat" />
          <RuleRow icon="✅" text="Zincir ne kadar uzunsa o kadar puan!" />
          <RuleRow icon="💣" text="BOMBA: 4 topu patlatır (-5 sn)" />
        </div>

        <button
          onClick={onStart}
          style={{ ...styles.playBtn }}
        >
          OYNA →
        </button>
      </div>
    </div>
  );
}

function RuleRow({ icon, text }: { icon: string, text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#cbd5e1" }}>{text}</span>
    </div>
  );
}

// ─── GAME SCREEN ──────────────────────────────────────────────────────────────
function GameScreen({ grid, timeLeft, score, selected, exploding, bombAnim, shakeGrid, comboText, onTap, onBomb, onClose }: any) {
  const progressPct = Math.min((timeLeft / MAX_TIME) * 100, 100);

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.gameCard, animation: shakeGrid ? "shake 0.3s ease" : "none" }}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={{ ...styles.movesNum, color: timeLeft <= 10 ? "#ef4444" : "#f1f5f9" }}>{timeLeft}</span>
            <span style={styles.movesLabel}>saniye</span>
          </div>
          <div style={styles.scoreBox}>
            <span style={styles.scoreNum}>{score}</span>
            <span style={styles.scoreLabel}>puan</span>
          </div>
          <div style={styles.headerRight}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>🎮 Sınırsız</span>
            <button onClick={onClose} style={styles.quitBtn}>✕</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>

        {/* Combo text */}
        {comboText && (
          <div style={styles.comboText}>{comboText}</div>
        )}

        {/* Grid */}
        <div style={styles.gridWrap}>
          {grid.map((row: string[], r: number) =>
            row.map((color: string, c: number) => {
              const key = `${r},${c}`;
              const isSelected = selected?.has(key);
              const isExploding = exploding.has(key);
              return (
                <Cell
                  key={key}
                  color={color}
                  isSelected={isSelected}
                  isExploding={isExploding}
                  onClick={() => onTap(r, c)}
                />
              );
            })
          )}
        </div>

        {/* Bomb button */}
        <button
          onClick={onBomb}
          style={{
            ...styles.bombBtn,
            background: "linear-gradient(135deg,#1e293b,#334155)",
            boxShadow: "none",
            transform: "scale(1)",
          }}
        >
          <span style={{ fontSize: 24 }}>💣</span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
              BOMBA
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>
              4 Topu Patlat
            </div>
          </div>
          <div style={{
            marginLeft: "auto",
            background: timeLeft <= BOMB_COST ? "#ef444444" : "#10b98144",
            borderRadius: 6,
            padding: "2px 7px",
            fontSize: 12,
            fontWeight: 700,
            color: timeLeft <= BOMB_COST ? "#fca5a5" : "#6ee7b7",
          }}>
            -{BOMB_COST} sn
          </div>
        </button>

        <style>{`
          @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 100%{transform:scale(0);opacity:0} }
          @keyframes shake { 0%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} 100%{transform:translateX(0)} }
          @keyframes bombFlash { 0%{opacity:0} 50%{opacity:1} 100%{opacity:0} }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
          @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </div>
    </div>
  );
}

function Cell({ color, isSelected, isExploding, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: isSelected
          ? `radial-gradient(circle, white 10%, ${BG_COLORS[color]} 70%)`
          : BG_COLORS[color],
        border: isSelected ? "2.5px solid white" : "2px solid rgba(255,255,255,0.15)",
        boxShadow: isSelected
          ? `0 0 16px ${BG_COLORS[color]}, 0 0 6px white`
          : `0 2px 6px rgba(0,0,0,0.3)`,
        cursor: "pointer",
        transition: "transform 0.1s, box-shadow 0.15s",
        transform: isExploding ? "scale(0)" : isSelected ? "scale(1.12)" : "scale(1)",
        animation: isExploding ? "pop 0.35s forwards" : "none",
        opacity: isExploding ? 0 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        userSelect: "none",
      }}
    >
      {color}
    </div>
  );
}

// ─── RESULT SCREEN ────────────────────────────────────────────────────────────
function ResultScreen({ score, earnedXp, bestScore, onReplay, onClose }: any) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={{ fontSize: 64, marginBottom: 4 }}>⏱️</div>
        <h2 style={{ ...styles.title, fontSize: 26, marginBottom: 4 }}>
          Süre Doldu!
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
          Düşünceni dağıttın, bu yeterli ✨
        </p>

        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{score}</span>
            <span style={styles.statLabel}>Skor</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>{bestScore}</span>
            <span style={styles.statLabel}>Rekor</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onReplay} style={styles.playBtn}>
            Tekrar Oyna
          </button>
          <button onClick={onClose} style={{ ...styles.playBtn, background: "linear-gradient(135deg,#334155,#1e293b)" }}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.92)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "linear-gradient(160deg,#0f172a,#1e293b)",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: 24,
    padding: "28px 24px",
    width: "100%",
    maxWidth: 380,
    textAlign: "center",
    position: "relative",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  gameCard: {
    background: "linear-gradient(160deg,#0f172a,#1e293b)",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: 24,
    padding: "16px 14px",
    width: "100%",
    maxWidth: 380,
    position: "relative",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    color: "#f1f5f9",
    margin: "0 0 6px",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "rgba(255,255,255,0.07)",
    border: "none",
    color: "#94a3b8",
    width: 30,
    height: 30,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: "14px 20px",
    marginBottom: 16,
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: {
    fontSize: 24,
    fontWeight: 800,
    color: "#f1f5f9",
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    background: "rgba(148,163,184,0.15)",
    margin: "0 4px",
  },
  rulesBox: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 20,
    textAlign: "left",
  },
  playBtn: {
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white",
    border: "none",
    padding: "16px 24px",
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 8px 20px rgba(99,102,241,0.4)",
    transition: "transform 0.1s, opacity 0.2s",
  },
  resetNote: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 14,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  movesNum: {
    fontSize: 28,
    fontWeight: 900,
    color: "#f1f5f9",
    lineHeight: 1,
  },
  movesLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 600,
  },
  scoreBox: {
    display: "flex",
    alignItems: "baseline",
    gap: 4,
  },
  scoreNum: {
    fontSize: 32,
    fontWeight: 900,
    color: "#10b981",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: 700,
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  quitBtn: {
    background: "rgba(255,255,255,0.07)",
    border: "none",
    color: "#94a3b8",
    width: 28,
    height: 28,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
  },
  progressTrack: {
    height: 8,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #34d399, #10b981)",
    transition: "width 0.3s ease",
  },
  comboText: {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
    color: "white",
    padding: "6px 16px",
    borderRadius: 20,
    fontWeight: 800,
    fontSize: 14,
    zIndex: 20,
    animation: "slideUp 0.3s ease, pulse 0.6s infinite",
    boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
  },
  gridWrap: {
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_COLS}, 44px)`,
    gap: 4,
    width: "fit-content",
    margin: "0 auto",
    position: "relative",
    background: "rgba(0,0,0,0.2)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  bombBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  }
};
