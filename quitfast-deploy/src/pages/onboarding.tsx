import { useState } from "react";
import { useLocation } from "wouter";

type Gender = "Kız" | "Erkek" | "Özel";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [gender, setGender] = useState<Gender>("Erkek");
  const [cigarsPerDay, setCigarsPerDay] = useState("");
  const [cigsPerPack, setCigsPerPack] = useState("");
  const [packsPerDay, setPacksPerDay] = useState("");
  const [pricePerPack, setPricePerPack] = useState("");

  const monthlyCost = (() => {
    const cigarettesPerDay = parseFloat(cigarsPerDay);
    const cigarettesPerPack = parseFloat(cigsPerPack);
    const packsPerDayNum = parseFloat(packsPerDay);
    const currentPricePerPack = parseFloat(pricePerPack);

    if (!packsPerDayNum || !currentPricePerPack) return null;

    const baseDailyCost = packsPerDayNum * currentPricePerPack;

    let extraDailyCost = 0;
    if (cigarettesPerDay && cigarettesPerPack) {
      const includedCigarettes = packsPerDayNum * cigarettesPerPack;
      if (cigarettesPerDay > includedCigarettes) {
        const extraCigarettes = cigarettesPerDay - includedCigarettes;
        const pricePerCigarette = currentPricePerPack / cigarettesPerPack;
        extraDailyCost = extraCigarettes * pricePerCigarette;
      }
    }

    const totalDailyCost = baseDailyCost + extraDailyCost;
    const monthlyCostValue = totalDailyCost * 30;

    return Math.round(monthlyCostValue).toLocaleString("tr-TR");
  })();

  const genderOptions: { id: Gender; label: string; icon: string }[] = [
    { id: "Kız", label: "Kız", icon: "♀" },
    { id: "Erkek", label: "Erkek", icon: "♂" },
    { id: "Özel", label: "Özel", icon: "⚧" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "#0a0e1a",
        color: "#dfe2f3",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        WebkitFontSmoothing: "antialiased",
        position: "relative",
      }}
    >
      {/* Top Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(10,14,26,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <button
          aria-label="Geri Dön"
          onClick={() => setLocation("/login")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#adc6ff",
            display: "flex",
            alignItems: "center",
            padding: 0,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <ArrowBackIcon />
        </button>
        <span
          style={{
            fontWeight: 800,
            fontSize: 17,
            color: "#adc6ff",
            letterSpacing: "-0.4px",
          }}
        >
          Başlangıç
        </span>
        <div style={{ width: 40 }} />
      </nav>

      {/* Scrollable main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "80px 20px 120px",
          maxWidth: 448,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: 28, textAlign: "center" }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#dfe2f3",
              letterSpacing: "-0.4px",
              margin: "0 0 6px 0",
            }}
          >
            Seni Tanıyalım
          </h1>
          <p style={{ fontSize: 13, color: "#c2c6d6", margin: 0 }}>
            Kişiselleştirilmiş yolculuğun için birkaç soru
          </p>
        </header>

        {/* Section 1: Gender */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#dfe2f3",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              textAlign: "center",
              margin: "0 0 12px 0",
            }}
          >
            Cinsiyetin nedir?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {genderOptions.map(({ id, label, icon }) => {
              const isActive = gender === id;
              return (
                <button
                  key={id}
                  onClick={() => setGender(id)}
                  style={{
                    background: isActive
                      ? "rgba(77,142,255,0.12)"
                      : "rgba(27,31,44,0.6)",
                    backdropFilter: "blur(16px)",
                    border: isActive
                      ? "1px solid rgba(173,198,255,0.5)"
                      : "1px solid rgba(66,71,84,0.15)",
                    borderRadius: 14,
                    padding: "14px 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isActive ? "0 0 30px rgba(173,198,255,0.1)" : "none",
                    transition: "all 0.25s",
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      marginBottom: 6,
                      color: isActive ? "#adc6ff" : "#8c909f",
                    }}
                  >
                    {icon}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#adc6ff" : "#c2c6d6",
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Smoking Habits */}
        <section style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(66,71,84,0.3))" }} />
            <h2
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#dfe2f3",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              Sigara Alışkanlıkların
            </h2>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(66,71,84,0.3))" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { placeholder: "Günde kaç sigara içiyordun?", value: cigarsPerDay, onChange: setCigarsPerDay, icon: <SmokingIcon /> },
              { placeholder: "Bir pakette kaç sigara vardı?", value: cigsPerPack, onChange: setCigsPerPack, icon: <PackIcon /> },
              { placeholder: "Günde kaç paket içiyordun?", value: packsPerDay, onChange: setPacksPerDay, icon: <CountIcon /> },
              { placeholder: "Bir paketin fiyatı ne kadardı? (₺)", value: pricePerPack, onChange: setPricePerPack, icon: <MoneyIcon /> },
            ].map(({ placeholder, value, onChange, icon }, i) => (
              <div key={i} style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    color: "#8c909f",
                  }}
                >
                  {icon}
                </span>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  style={{
                    width: "100%",
                    height: 50,
                    paddingLeft: 44,
                    paddingRight: 14,
                    background: "rgba(49,52,66,0.8)",
                    border: "1px solid rgba(66,71,84,0.25)",
                    borderRadius: 14,
                    color: "#dfe2f3",
                    fontSize: 14,
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(173,198,255,0.5)";
                    (e.target.previousSibling as HTMLElement).style.color = "#adc6ff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(66,71,84,0.25)";
                    (e.target.previousSibling as HTMLElement).style.color = "#8c909f";
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Monthly Cost Card */}
        <section>
          <div
            style={{
              background: "#0a0e1a",
              borderRadius: 20,
              padding: "20px 22px",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,180,171,0.2)",
              boxShadow: "0 0 40px rgba(255,180,171,0.05)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -20,
                width: 100,
                height: 100,
                background: "rgba(147,0,10,0.2)",
                borderRadius: "50%",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#c2c6d6",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Aylık Tahmini Maliyet
                  </span>
                </div>
                <div
                  style={{
                    fontSize: monthlyCost ? 30 : 22,
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    background: "linear-gradient(to right, #ffb4ab, #93000a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {monthlyCost ? `₺${monthlyCost}` : "₺—"}
                </div>
                <span style={{ fontSize: 11, color: "#8c909f", fontWeight: 500 }}>
                  Sigaraya harcadığın para
                </span>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(38,42,55,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(66,71,84,0.2)",
                }}
              >
                <WalletIcon />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "12px 20px 28px",
          background: "linear-gradient(to top, #0a0e1a 60%, rgba(10,14,26,0.9) 80%, transparent 100%)",
          zIndex: 40,
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => setLocation("/home")}
          style={{
            width: "100%",
            maxWidth: 448,
            margin: "0 auto",
            height: 54,
            borderRadius: 9999,
            background: "linear-gradient(to right, #4d8eff, #005ac2)",
            border: "none",
            color: "#dfe2f3",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Manrope', sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 0 24px rgba(77,142,255,0.2)",
            transition: "box-shadow 0.3s, transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 32px rgba(77,142,255,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 24px rgba(77,142,255,0.2)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ letterSpacing: "0.3px" }}>Tamamla</span>
          <ArrowForwardIcon />
        </button>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input::placeholder { color: rgba(140,144,159,0.55); }
      `}</style>
    </div>
  );
}

function ArrowBackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ArrowForwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function SmokingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 12H2v4h16" /><path d="M22 12h-2v4h2" /><path d="M7 8c0-2 2-2 2-4" /><path d="M11 8c0-2 2-2 2-4" />
    </svg>
  );
}
function PackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}
function CountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}
function MoneyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8c909f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
