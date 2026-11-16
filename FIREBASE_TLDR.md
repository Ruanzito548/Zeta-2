# 🏃 TL;DR - Firebase Setup Express (2 minutos)

## Suas Credenciais

```javascript
{
  apiKey: "AIzaSyBhQKuXx9Ev0yueZ7w3JEbD80yE1gwIPoo",
  authDomain: "zeta-2.firebaseapp.com",
  projectId: "zeta-2",
  storageBucket: "zeta-2.firebasestorage.app",
  messagingSenderId: "286668624287",
  appId: "1:286668624287:web:76833495efe44777dfedaa"
}
```

---

## 🚀 O que Fazer AGORA

### 1️⃣ Vercel - Adicione 6 Variáveis (5 min)

Link: https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables

| # | Nome | Valor |
|---|------|-------|
| 1 | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBhQKuXx9Ev0yueZ7w3JEbD80yE1gwIPoo` |
| 2 | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `zeta-2.firebaseapp.com` |
| 3 | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `zeta-2` |
| 4 | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `zeta-2.firebasestorage.app` |
| 5 | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `286668624287` |
| 6 | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:286668624287:web:76833495efe44777dfedaa` |

**Depois:** Clique em **Redeploy to Production** (Vercel vai pedir)

### 2️⃣ Firebase - Autorizar Domínios (2 min)

Link: https://console.firebase.google.com/project/zeta-2/authentication/settings

Add domains:
```
projeto-nextjs-xi.vercel.app
localhost:3000
```

### 3️⃣ Testar (1 min)

```
https://projeto-nextjs-xi.vercel.app
F12 → Console → procure por "Firebase initialized"
✅ Pronto!
```

---

## 📝 Depois (Quando estiver pronto)

**Baixar Service Account JSON:**
- Firebase Console → ⚙️ Project Settings → Service Accounts → Generate Key
- Copiar conteúdo completo do JSON
- Enviar pro Copilot para adicionar 7ª variável

---

**Total: 8-10 minutos** ⏱️

**Start: VERCEL_ENV_SETUP_VISUAL.md** 👈
