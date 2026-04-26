import { useLocation } from "wouter";
import { getSupabaseClient } from "../lib/supabase";
import logoImg from "/logo.png";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleGoogleLogin = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch {
      // handle silently
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "#0a0e1a",
        color: "#dfe2f3",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 300,
          background: "rgba(173,198,255,0.12)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo & Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 56 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 24,
              overflow: "hidden",
              marginBottom: 24,
              boxShadow: "0 0 40px rgba(173,198,255,0.15)",
            }}
          >
            <img
              src={logoImg}
              alt="QuitFast Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#dfe2f3",
              margin: "0 0 8px 0",
            }}
          >
            QuitFast
          </h1>
          <p style={{ fontSize: 13, color: "#c2c6d6", fontWeight: 500, textAlign: "center", margin: 0 }}>
            Sigara bırakmanın en akıllı yolu
          </p>
        </div>

        {/* Buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {/* Google */}
          <Btn style={lightBtnStyle} onClick={handleGoogleLogin}>
            <GoogleIcon />
            Google ile Giriş Yap
          </Btn>

          {/* Email Login */}
          <Btn style={blueBtnStyle} onClick={() => setLocation("/email-login")}>
            <MailIcon />
            E-posta ile Giriş Yap
          </Btn>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 14, color: "#c2c6d6", margin: 0 }}>
          Yeni misin?{" "}
          <button
            type="button"
            onClick={() => setLocation("/register")}
            style={{
              color: "#adc6ff",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              padding: 0,
            }}
          >
            Kayıt Ol
          </button>
        </p>
      </div>
    </div>
  );
}

function Btn({
  style,
  onClick,
  children,
}: {
  style: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

const baseBtn: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: "16px 24px",
  borderRadius: 16,
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "0.3px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.15s",
  fontFamily: "'Manrope', sans-serif",
};

const lightBtnStyle: React.CSSProperties = {
  ...baseBtn,
  background: "#dfe2f3",
  color: "#0a0e1a",
};

const blueBtnStyle: React.CSSProperties = {
  ...baseBtn,
  background: "linear-gradient(90deg, #4d8eff 0%, #005ac2 100%)",
  color: "#dfe2f3",
  boxShadow: "0 0 20px rgba(173,198,255,0.2)",
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
