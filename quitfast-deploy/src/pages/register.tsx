import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { getSupabaseClient } from "../lib/supabase";

export default function Register() {
  const [, setLocation] = useLocation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (username.trim().length < 3) errs.username = "En az 3 karakter olmalı.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Geçerli bir e-posta girin.";
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 120) errs.age = "Geçerli bir yaş girin.";
    if (password.length < 8) errs.password = "En az 8 karakter olmalı.";
    return errs;
  };

  const handleGoogleRegister = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch {
      setErrors({ form: "Google ile kayıt başarısız oldu." });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      setSuccessMsg("Hesap oluşturuldu!");
      setTimeout(() => setLocation("/onboarding"), 600);
    } catch {
      setErrors({ form: "Kayıt tamamlanamadı. Lütfen tekrar dene." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "radial-gradient(circle at center, #0D1A2E 0%, #070C18 100%)",
        minHeight: "100dvh",
        color: "#dfe2f3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Back button */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "24px",
          display: "flex",
          alignItems: "center",
          zIndex: 50,
          maxWidth: 448,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => setLocation("/login")}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#dfe2f3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <ArrowBackIcon />
        </button>
      </header>

      <main
        style={{
          width: "100%",
          maxWidth: 448,
          display: "flex",
          flexDirection: "column",
          marginTop: 48,
          marginBottom: 32,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
              margin: "0 0 8px 0",
            }}
          >
            Hesap Oluştur
          </h1>
          <p style={{ fontSize: 13, color: "#8c909f", margin: 0 }}>
            Yolculuğuna bugün başla
          </p>
        </div>

        {/* Google Register */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "13px 24px",
            borderRadius: 14,
            background: "#dfe2f3",
            color: "#0a0e1a",
            fontWeight: 700,
            fontSize: 14,
            fontFamily: "'Manrope', sans-serif",
            border: "none",
            cursor: "pointer",
            marginBottom: 20,
            transition: "transform 0.15s, opacity 0.2s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <GoogleIcon />
          Google ile Kayıt Ol
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(66,71,84,0.4)" }} />
          <span style={{ fontSize: 12, color: "#8c909f", fontWeight: 500 }}>veya e-posta ile</span>
          <div style={{ flex: 1, height: 1, background: "rgba(66,71,84,0.4)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Username */}
          <InputField
            icon={<UserIcon />}
            placeholder="Kullanıcı Adı"
            type="text"
            value={username}
            onChange={(v) => { setUsername(v); setErrors((p) => ({ ...p, username: "" })); }}
            error={errors.username}
            active={false}
          />

          {/* Email */}
          <InputField
            icon={<MailIcon />}
            placeholder="E-posta Adresi"
            type="email"
            value={email}
            onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
            error={errors.email}
            active={false}
          />

          {/* Age */}
          <InputField
            icon={<CalendarIcon />}
            placeholder="Yaşınız"
            type="number"
            value={age}
            onChange={(v) => { setAge(v); setErrors((p) => ({ ...p, age: "" })); }}
            error={errors.age}
            active={false}
          />

          {/* Password */}
          <div>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                height: 52,
                borderRadius: 14,
                background: "#0F1C2E",
                border: `1px solid ${errors.password ? "rgba(255,100,100,0.5)" : "rgba(66,71,84,0.3)"}`,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 16,
                  color: "#8c909f",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Şifre"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  paddingLeft: 48,
                  paddingRight: 48,
                  fontSize: 14,
                  color: "#dfe2f3",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8c909f",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p style={{ fontSize: 12, color: "#ff6464", margin: "4px 0 0 4px" }}>{errors.password}</p>
            )}
          </div>

          {errors.form && (
            <p style={{ fontSize: 12, color: "#ff6464", textAlign: "center" }}>{errors.form}</p>
          )}

          {/* Submit */}
          {successMsg ? (
            <div
              style={{
                marginTop: 24,
                width: "100%",
                height: 52,
                borderRadius: 9999,
                background: "linear-gradient(to right, #059669, #10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                boxShadow: "0 8px 32px rgba(16,185,129,0.25)",
              }}
            >
              ✓ {successMsg}
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: 24,
                width: "100%",
                height: 52,
                borderRadius: 9999,
                background: "linear-gradient(to right, #4d8eff, #005ac2)",
                border: "none",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.3px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 8px 32px rgba(77,142,255,0.25)",
                transition: "transform 0.2s, opacity 0.2s",
              }}
              onMouseDown={(e) => { if (!isSubmitting) e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {isSubmitting ? "İşleniyor..." : "Kayıt Ol"}
            </button>
          )}
        </form>

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#8c909f", margin: 0 }}>
            Zaten hesabın var mı?{" "}
            <button
              type="button"
              onClick={() => setLocation("/login")}
              style={{
                color: "#adc6ff",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: 4,
                fontSize: 13,
              }}
            >
              Giriş Yap →
            </button>
          </p>
        </div>
      </main>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        input::placeholder { color: rgba(140,144,159,0.7); }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}

function InputField({
  icon, placeholder, type, value, onChange, error, active, isDate,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  active?: boolean;
  isDate?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isHighlighted = active || focused;

  return (
    <div>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: 52,
          borderRadius: 14,
          background: "#0F1C2E",
          border: `1px solid ${
            error
              ? "rgba(255,100,100,0.5)"
              : isHighlighted
              ? "#adc6ff"
              : "rgba(66,71,84,0.3)"
          }`,
          boxShadow: isHighlighted ? "0 0 20px rgba(173,198,255,0.15)" : "none",
          overflow: "hidden",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 16,
            color: isHighlighted ? "#adc6ff" : "#8c909f",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            transition: "color 0.2s",
          }}
        >
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingLeft: 48,
            paddingRight: 16,
            fontSize: 14,
            color: "#dfe2f3",
            colorScheme: isDate ? "dark" : undefined,
          }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#ff6464", margin: "4px 0 0 4px" }}>{error}</p>
      )}
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
function UserIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" /></svg>;
}
function MailIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>;
}
function CalendarIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function EyeIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function EyeOffIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
