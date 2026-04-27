# QuitFast

Sigara bırakma uygulaması - React + TypeScript + Vite + Supabase

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

## Build (Deploy için)

```bash
npm run build
```

`dist/` klasörü oluşur. Bu klasörü herhangi bir static hosting'e (Netlify, Vercel, Firebase Hosting) deploy edebilirsin.

## Ortam Değişkenleri

`.env` dosyasında şunlar olmalı:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Codemagic ile Android APK Build

1. Bu projeyi GitHub'a push et
2. Codemagic'te "React Native / Flutter Web" değil **"Other"** seç
3. Build script:
```bash
npm install
npm run build
```
4. Capacitor için ek adımlar gerekirse `npx cap add android` ile Android projesi oluşturulabilir.
