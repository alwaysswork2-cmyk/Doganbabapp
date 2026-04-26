import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { getSupabaseClient } from "../lib/supabase";

export default function EmailLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusType("idle");

    if (!email.trim() || !password.trim()) {
      setStatusType("error");
      setStatusMessage("Lütfen e-posta ve şifreni gir.");
      return;
    }
    if (password.length < 6) {
      setStatusType("error");
      setStatusMessage("Şifre en az 6 karakter olmalı.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setStatusType("success");
      setStatusMessage("Giriş başarılı!");
      setTimeout(() => setLocation("/home"), 400);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error instanceof Error ? error.message : "Giriş tamamlanamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        minHeight: "100dvh",
        color: "#dfe2f3",
        display: "flex",
        flexDirection: "column",
        WebkitFontSmoothing: "antialiased",
        position: "relative",
      }}
    >
      {/* Radial background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(circle at center, #0D1A2E 0%, #070C18 100%)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "16px 24px",
          background: "transparent",
          position: "relative",
          zIndex: 10,
        }}
      >
        <button
          aria-label="Geri Dön"
          onClick={() => setLocation("/login")}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#dfe2f3",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(38,42,55,0.8)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <ArrowBackIcon />
        </button>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px 32px",
          maxWidth: 448,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#dfe2f3",
              letterSpacing: "-0.5px",
              margin: "0 0 8px 0",
              lineHeight: 1.2,
            }}
          >
            Tekrar Hoş Geldin
          </h1>
          <p style={{ fontSize: 13, color: "rgba(194,198,214,0.8)", margin: 0, fontWeight: 400 }}>
            Hesabına giriş yap
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}
        >
          {/* Email */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: emailFocused || email ? "#adc6ff" : "#8c909f",
                transition: "color 0.3s",
              }}
            >
              <MailIcon />
            </span>
            <input
              type="email"
              placeholder="E-posta Adresi"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={{
                width: "100%",
                height: 52,
                paddingLeft: 48,
                paddingRight: 16,
                background: emailFocused || email
                  ? "rgba(49,52,66,0.8)"
                  : "rgba(49,52,66,0.6)",
                border: emailFocused || email
                  ? "1px solid #adc6ff"
                  : "1px solid rgba(66,71,84,0.3)",
                color: "#dfe2f3",
                fontSize: 14,
                borderRadius: 14,
                outline: "none",
                boxShadow: emailFocused || email
                  ? "0 0 20px rgba(173,198,255,0.15)"
                  : "none",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: passwordFocused ? "#dfe2f3" : "#424754",
                transition: "color 0.2s",
              }}
            >
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifre"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={{
                width: "100%",
                height: 52,
                paddingLeft: 48,
                paddingRight: 48,
                background: "rgba(49,52,66,0.6)",
                border: passwordFocused
                  ? "1px solid rgba(173,198,255,0.5)"
                  : "1px solid rgba(66,71,84,0.3)",
                color: "#dfe2f3",
                fontSize: 14,
                borderRadius: 14,
                outline: "none",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                paddingRight: 16,
                display: "flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#424754",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#dfe2f3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#424754")}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>

          {/* Forgot password */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <a
              href="#"
              style={{
                fontSize: 12,
                color: "#adc6ff",
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4d8eff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#adc6ff")}
            >
              Şifremi Unuttum
            </a>
          </div>

          {/* Error/success message */}
          {statusMessage && (
            <p
              style={{
                fontSize: 12,
                color: statusType === "success" ? "#adc6ff" : "#ffb4ab",
                textAlign: "center",
                margin: 0,
              }}
            >
              {statusMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: 24,
              width: "100%",
              height: 52,
              background: "linear-gradient(to right, #4d8eff, #005ac2)",
              color: "#dfe2f3",
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 9999,
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: "0 0 30px rgba(77,142,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseDown={(e) => { if (!isSubmitting) e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {isSubmitting ? "İşleniyor..." : "Giriş Yap"}
          </button>
        </form>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#c2c6d6", margin: 0 }}>
            Hesabın yok mu?{" "}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setLocation("/register"); }}
              style={{
                color: "#adc6ff",
                fontWeight: 700,
                textDecoration: "none",
                marginLeft: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4d8eff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#adc6ff")}
            >
              Ücretsiz başla <ArrowForwardIcon />
            </a>
          </p>
        </div>
      </main>

      <style>{`
        input::placeholder { color: #8c909f; }
        input:focus { outline: none; }
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
